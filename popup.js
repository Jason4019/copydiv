// popup.js - 弹出窗口脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const statusDiv = document.getElementById('status');
  const openOptionsLink = document.getElementById('openOptions');
  const categoryTabs = document.getElementById('categoryTabs');

  const state = {
    words: [],
    currentCategory: '全部',
  };

  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  init();

  async function init() {
    state.currentCategory = await CommonWordsUtils.getDefaultCategory();
    await loadWords();
    CommonWordsUtils.onWordsChanged((words) => {
      state.words = words;
      renderCategoryTabs();
      renderWordsList();
    });
  }

  async function loadWords() {
    state.words = await CommonWordsUtils.getWords();
    renderCategoryTabs();
    renderWordsList();
  }

  function renderCategoryTabs() {
    if (!categoryTabs) return;

    categoryTabs.innerHTML = '';
    const categories = new Set(['全部']);
    state.words.forEach((word) => categories.add(getWordCategory(word)));

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

    const filtered = state.currentCategory === '全部'
      ? state.words
      : state.words.filter((word) => getWordCategory(word) === state.currentCategory);

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
      showStatus('已复制到剪贴板', 'success');
      closePopup();
    } catch (error) {
      try {
        fallbackCopy(text);
        showStatus('已复制到剪贴板', 'success');
        closePopup();
      } catch (fallbackError) {
        showStatus('复制失败，请重试', 'error', 2600);
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
    return (word.category && word.category.trim()) ? word.category.trim() : '默认';
  }
});
