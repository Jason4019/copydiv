// popup.js - 弹出窗口脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const statusDiv = document.getElementById('status');
  const openOptionsLink = document.getElementById('openOptions');
  const settingsBtn = document.getElementById('settingsBtn');
  const categoryTabs = document.getElementById('categoryTabs');

  const state = {
    words: [],
    currentCategory: '全部', // 初始值，会在 init 中更新
  };

  // 设置按钮点击事件
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  // 空状态中的链接点击事件
  if (openOptionsLink) {
    openOptionsLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  }

  init();

  async function init() {
    // 确保 i18n 已加载
    if (typeof i18n === 'undefined' || !i18n.getLanguage) {
      console.warn('i18n 未加载，使用默认中文');
      state.currentCategory = '全部';
      await loadWords();
      return;
    }
    
    try {
      const lang = await i18n.getLanguage();
      i18n.currentLang = lang;
      i18n.updateDocumentLang();
      
      const defaultCat = await CommonWordsUtils.getDefaultCategory();
      const allText = i18n.t('all');
      state.currentCategory = defaultCat === '全部' ? allText : defaultCat;
      await loadWords();
      updateAllTexts();
      
      CommonWordsUtils.onWordsChanged((words) => {
        state.words = words;
        renderCategoryTabs();
        renderWordsList();
      });
      
      i18n.onLanguageChanged(() => {
        updateAllTexts();
        renderCategoryTabs();
        renderWordsList();
      });
    } catch (error) {
      console.error('初始化失败:', error);
      state.currentCategory = '全部';
      await loadWords();
    }
  }

  async function loadWords() {
    state.words = await CommonWordsUtils.getWords();
    renderCategoryTabs();
    renderWordsList();
  }

  function renderCategoryTabs() {
    if (!categoryTabs) return;

    categoryTabs.innerHTML = '';
    const allText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('all') : '全部';
    const defaultText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    const categories = new Set([allText]);
    state.words.forEach((word) => {
      const cat = getWordCategory(word);
      categories.add(cat === '默认' ? defaultText : cat);
    });

    categories.forEach((category) => {
      const btn = document.createElement('button');
      btn.className = 'category-tab';
      if (category === state.currentCategory) {
        btn.classList.add('active');
      }
      btn.textContent = category;
      btn.addEventListener('click', () => {
        state.currentCategory = category;
        renderCategoryTabs();
        renderWordsList();
      });
      categoryTabs.appendChild(btn);
    });
  }

  function renderWordsList() {
    wordsList.innerHTML = '';

    if (state.words.length === 0) {
      emptyState.style.display = 'block';
      wordsList.style.display = 'none';
      return;
    }

    const allText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('all') : '全部';
    const filtered = state.currentCategory === allText || state.currentCategory === '全部'
      ? state.words
      : state.words.filter((word) => {
          const cat = getWordCategory(word);
          const defaultText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
          const displayCat = cat === '默认' ? defaultText : cat;
          return displayCat === state.currentCategory;
        });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      wordsList.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    wordsList.style.display = 'flex';

    filtered.forEach((word) => {
      const button = document.createElement('button');
      button.className = 'word-btn';
      button.textContent = word.text;
      button.title = `点击复制：${(word.text || '').replace(/\n/g, ' ')}`;
      button.style.whiteSpace = 'pre-wrap';
      button.style.textAlign = 'left';

      const color = word.color || CommonWordsUtils.getDefaultColor(word.id || 0);
      button.style.backgroundColor = color;
      button.style.borderColor = color;
      button.style.color = '#fff';

      button.addEventListener('click', () => copyToClipboard(word.text));
      wordsList.appendChild(button);
    });
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      const successMsg = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('popup.copy.success') : '已复制到剪贴板';
      showStatus(successMsg, 'success');
      closePopup();
    } catch (error) {
      try {
        fallbackCopy(text);
        const successMsg = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('popup.copy.success') : '已复制到剪贴板';
        showStatus(successMsg, 'success');
        closePopup();
      } catch (fallbackError) {
        const errorMsg = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('popup.copy.failed') : '复制失败，请重试';
        showStatus(errorMsg, 'error', 2600);
        console.error('复制失败:', fallbackError);
      }
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  function showStatus(message, type, duration = 1200) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
      statusDiv.style.display = 'none';
    }, duration);
  }

  function closePopup() {
    setTimeout(() => window.close(), 120);
  }

  function getWordCategory(word) {
    const defaultText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    const cat = (word.category && word.category.trim()) ? word.category.trim() : defaultText;
    return cat === '默认' ? defaultText : cat;
  }

  function updateAllTexts() {
    if (typeof i18n === 'undefined' || !i18n.t) {
      console.warn('i18n 未加载，跳过文本更新');
      return;
    }

    try {
      const titleEl = document.querySelector('h1');
      if (titleEl) titleEl.textContent = i18n.t('popup.title');
      
      // 更新设置按钮的 title 和 aria-label
      if (settingsBtn) {
        const settingsText = i18n.t('settings.title') || '设置';
        settingsBtn.setAttribute('title', settingsText);
        settingsBtn.setAttribute('aria-label', settingsText);
      }
      
      const emptyStateEl = document.getElementById('emptyState');
      if (emptyStateEl) {
        const p = emptyStateEl.querySelector('p');
        const link = emptyStateEl.querySelector('a');
        if (p) p.textContent = i18n.t('popup.empty');
        if (link) link.textContent = i18n.t('popup.empty.link');
      }
    } catch (error) {
      console.error('更新文本失败:', error);
    }
  }
});
