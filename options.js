// options.js - 选项页面脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordInput = document.getElementById('wordInput');
  const addBtn = document.getElementById('addBtn');
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const messageDiv = document.getElementById('message');
  const inputError = document.getElementById('inputError');
  const categoryTabs = document.getElementById('categoryTabs');
  const defaultCategorySelect = document.getElementById('defaultCategorySelect');
  const languageSelect = document.getElementById('languageSelect');
  const tabButtons = document.querySelectorAll('.options-tab');
  const tabWords = document.getElementById('tab-words');
  const tabSettings = document.getElementById('tab-settings');
  const tabHelp = document.getElementById('tab-help');
  const tabAbout = document.getElementById('tab-about');
  const editModal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const editCategoryInput = document.getElementById('editCategory');
  const editColorInput = document.getElementById('editColor');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editError = document.getElementById('editError');

  const state = {
    words: [],
    currentCategory: '全部', // 初始值，会在 init 中更新
    defaultCategory: '全部', // 初始值，会在 init 中更新
    editingId: null,
  };

  // 初始化
  init();
  CommonWordsUtils.onWordsChanged((words) => {
    state.words = words;
    renderCategoryTabs();
    renderWordsList();
  });

  async function init() {
    // 确保 i18n 已加载
    if (typeof i18n === 'undefined') {
      console.error('i18n 未加载，使用默认中文');
      // 如果 i18n 未加载，使用默认值继续运行
      state.currentCategory = '全部';
      state.defaultCategory = '全部';
      await loadWords();
      return;
    }
    
    try {
      const lang = await i18n.getLanguage();
      i18n.currentLang = lang;
      i18n.updateDocumentLang();
      
      const allText = i18n.t('all');
      const defaultCat = await CommonWordsUtils.getDefaultCategory();
      state.defaultCategory = defaultCat === '全部' ? allText : defaultCat;
      state.currentCategory = state.defaultCategory;
      
      await loadWords();
      await initLanguageSelect();
      updateAllTexts();
    } catch (error) {
      console.error('初始化失败:', error);
      // 使用默认值继续运行
      state.currentCategory = '全部';
      state.defaultCategory = '全部';
      await loadWords();
    }
  }

  addBtn.addEventListener('click', addWord);
  wordInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      addWord();
    }
  });

  saveEditBtn.addEventListener('click', saveEdit);
  cancelEditBtn.addEventListener('click', cancelEdit);
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cancelEdit();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    }
  });

  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
      cancelEdit();
    }
  });

  // 顶部 Tab 切换
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      tabWords.classList.remove('active');
      tabSettings.classList.remove('active');
      tabHelp.classList.remove('active');
      tabAbout.classList.remove('active');
      
      if (target === 'settings') {
        tabSettings.classList.add('active');
      } else if (target === 'help') {
        tabHelp.classList.add('active');
      } else if (target === 'about') {
        tabAbout.classList.add('active');
        loadAboutInfo();
      } else {
        tabWords.classList.add('active');
      }
    });
  });

  if (defaultCategorySelect) {
    defaultCategorySelect.addEventListener('change', async (e) => {
      const allText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('all') : '全部';
      const value = e.target.value || allText;
      state.defaultCategory = value;
      await CommonWordsUtils.setDefaultCategory(value);
      const msg = (typeof i18n !== 'undefined' && i18n.t) 
        ? i18n.t('options.message.defaultCategory', { value })
        : `已将 popup 默认标签设置为「${value}」`;
      showMessage(msg, 'info', 1800);
    });
  }

  // 初始化语言选择器（延迟到 init 完成后）
  async function initLanguageSelect() {
    if (!languageSelect) return;
    
    try {
      const currentLang = await i18n.getLanguage();
      languageSelect.value = currentLang;
      
      languageSelect.addEventListener('change', async (e) => {
        const lang = e.target.value || 'zh-CN';
        await i18n.setLanguage(lang);
        updateAllTexts();
        const langText = lang === 'zh-CN' ? '中文' : 'English';
        showMessage(i18n.t('settings.language') + ': ' + langText, 'success', 1800);
      });
    } catch (error) {
      console.error('初始化语言选择器失败:', error);
    }
  }

  // 监听语言变化
  if (typeof i18n !== 'undefined') {
    i18n.onLanguageChanged(() => {
      updateAllTexts();
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
    const allText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('all') : '全部';
    const defaultText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    const categories = new Set([allText]);
    state.words.forEach((word) => {
      const cat = getWordCategory(word);
      categories.add(cat === '默认' ? defaultText : cat);
    });

    const categoryArray = Array.from(categories);

    categoryArray.forEach((category) => {
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

    // 同步默认分类下拉选项
    if (defaultCategorySelect) {
      defaultCategorySelect.innerHTML = '';
      categoryArray.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        defaultCategorySelect.appendChild(option);
      });

      if (!categoryArray.includes(state.defaultCategory)) {
        state.defaultCategory = allText;
      }
      defaultCategorySelect.value = state.defaultCategory;
    }
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
    wordsList.style.flexDirection = 'column';
    wordsList.style.gap = '10px';

    filtered.forEach((word) => {
      const item = document.createElement('div');
      item.className = 'word-item';
      item.dataset.id = word.id;

      const colorDot = document.createElement('span');
      colorDot.className = 'word-color-dot';
      colorDot.style.backgroundColor = word.color || CommonWordsUtils.getDefaultColor(word.id || 0);

      const textSpan = document.createElement('div');
      textSpan.className = 'word-text';
      textSpan.textContent = word.text;
      textSpan.style.whiteSpace = 'pre-wrap';

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'word-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit';
      editBtn.textContent = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('edit') : '编辑';
      editBtn.addEventListener('click', () => editWord(word.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('delete') : '删除';
      deleteBtn.addEventListener('click', () => deleteWord(word.id));

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      item.appendChild(colorDot);
      item.appendChild(textSpan);
      item.appendChild(actionsDiv);
      wordsList.appendChild(item);
    });
  }

  async function addWord() {
    const rawText = wordInput.value.trimEnd();
    if (!validateText(rawText, inputError)) {
      return;
    }

    const words = await CommonWordsUtils.getWords();
    if (words.some((w) => w.text === rawText)) {
      showInputError((typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.error.duplicate') : '该常用词已存在');
      return;
    }

    const newId = words.length > 0 ? Math.max(...words.map((w) => w.id)) + 1 : 1;
    const defaultCategory = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    const newWord = {
      id: newId,
      text: rawText,
      createdAt: Date.now(),
      color: CommonWordsUtils.getDefaultColor(newId),
      category: defaultCategory,
    };

    words.push(newWord);
    await CommonWordsUtils.saveWords(words);

    wordInput.value = '';
    clearInputError();
    showMessage((typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.message.added') : '🎉 已添加到常用词列表', 'success');
  }

  async function editWord(id) {
    const words = await CommonWordsUtils.getWords();
    const word = words.find((w) => w.id === id);
    if (!word) return;

    state.editingId = id;
    editInput.value = word.text;
    const cat = getWordCategory(word);
    const defaultText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    editCategoryInput.value = cat === '默认' ? defaultText : cat;
    editColorInput.value = word.color || CommonWordsUtils.getDefaultColor(word.id || 0);
    clearEditError();
    editModal.style.display = 'flex';
    editInput.focus();
  }

  async function saveEdit() {
    if (state.editingId === null) return;

    const rawText = editInput.value.trimEnd();
    if (!validateText(rawText, editError)) {
      return;
    }

    const defaultCategory = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    const category = editCategoryInput.value.trim() || defaultCategory;
    const color = editColorInput.value || CommonWordsUtils.getDefaultColor(state.editingId);

    const words = await CommonWordsUtils.getWords();
    const duplicate = words.find((w) => w.text === rawText && w.id !== state.editingId);
    if (duplicate) {
      showEditError((typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.error.duplicate') : '该常用词已存在');
      return;
    }

    const index = words.findIndex((w) => w.id === state.editingId);
    if (index === -1) return;

    words[index] = {
      ...words[index],
      text: rawText,
      category,
      color,
    };

    await CommonWordsUtils.saveWords(words);
    showMessage((typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.message.updated') : '✅ 常用词已更新', 'success');
    cancelEdit();
  }

  function cancelEdit() {
    state.editingId = null;
    editInput.value = '';
    editCategoryInput.value = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    editColorInput.value = '#0078d4';
    clearEditError();
    editModal.style.display = 'none';
  }

  async function deleteWord(id) {
    const words = await CommonWordsUtils.getWords();
    const target = words.find((w) => w.id === id);
    if (!target) return;

    const confirmText = (typeof i18n !== 'undefined' && i18n.t) 
      ? i18n.t('options.delete.confirm', { text: target.text.slice(0, 20) })
      : `确认删除"${target.text.slice(0, 20)}"吗？`;
    if (!confirm(confirmText)) {
      return;
    }

    const filtered = words.filter((w) => w.id !== id);
    await CommonWordsUtils.saveWords(filtered);
    const deletedMsg = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.message.deleted') : '🗑 已删除';
    showMessage(deletedMsg, 'info');
  }

  // 校验 & 提示
  function validateText(text, errorElement) {
    const trimmed = text.trim();
    if (!trimmed) {
      const errorMsg = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.error.empty') : '请输入常用词';
      if (errorElement === inputError) {
        showInputError(errorMsg);
      } else {
        showEditError(errorMsg);
      }
      return false;
    }

    if (text.length > 500) {
      const errorMsg = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('options.error.length') : '常用词长度不能超过500个字符';
      if (errorElement === inputError) {
        showInputError(errorMsg);
      } else {
        showEditError(errorMsg);
      }
      return false;
    }

    return true;
  }

  function showInputError(message) {
    inputError.textContent = message;
    inputError.style.display = 'block';
  }

  function clearInputError() {
    inputError.textContent = '';
    inputError.style.display = 'none';
  }

  function showEditError(message) {
    editError.textContent = message;
    editError.style.display = 'block';
  }

  function clearEditError() {
    editError.textContent = '';
    editError.style.display = 'none';
  }

  function showMessage(text, type = 'info', duration = 2200) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, duration);
  }

  function getWordCategory(word) {
    const defaultText = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('default') : '默认';
    const cat = (word.category && word.category.trim()) ? word.category.trim() : defaultText;
    // 兼容旧数据：如果分类是中文"默认"，转换为当前语言的"默认"
    return cat === '默认' ? defaultText : cat;
  }

  // 加载关于页面信息
  function loadAboutInfo() {
    try {
      const manifest = chrome.runtime.getManifest();
      
      // 更新版本信息
      const appNameEl = document.getElementById('appName');
      const appDescriptionEl = document.getElementById('appDescription');
      const appVersionEl = document.getElementById('appVersion');
      const manifestNameEl = document.getElementById('manifestName');
      const manifestVersionEl = document.getElementById('manifestVersion');
      const manifestVersionNumberEl = document.getElementById('manifestVersionNumber');
      
      if (appNameEl) appNameEl.textContent = manifest.name || 'CopyDiv';
      if (appDescriptionEl) appDescriptionEl.textContent = manifest.description || ((typeof i18n !== 'undefined' && i18n.t) ? i18n.t('popup.title') : '快速复制常用词');
      if (appVersionEl) appVersionEl.textContent = manifest.version || '1.0.0';
      if (manifestNameEl) manifestNameEl.textContent = manifest.name || '-';
      if (manifestVersionEl) manifestVersionEl.textContent = manifest.version || '-';
      if (manifestVersionNumberEl) manifestVersionNumberEl.textContent = `v${manifest.manifest_version || 3}`;
    } catch (error) {
      console.error('加载关于信息失败:', error);
    }
  }

  // 更新所有文本内容
  function updateAllTexts() {
    if (typeof i18n === 'undefined' || !i18n.t) {
      console.warn('i18n 未加载，跳过文本更新');
      return;
    }

    try {
      // 更新所有带有 data-i18n 属性的元素
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = i18n.t(key);
        }
      });

      // 更新 Tab 按钮（只更新文字，保留图标）
      const tabWordsBtn = document.querySelector('[data-tab="words"]');
      const tabSettingsBtn = document.querySelector('[data-tab="settings"]');
      const tabHelpBtn = document.querySelector('[data-tab="help"]');
      const tabAboutBtn = document.querySelector('[data-tab="about"]');
      
      if (tabWordsBtn) {
        const span = tabWordsBtn.querySelector('span');
        if (span) span.textContent = i18n.t('options.tab.words');
      }
      if (tabSettingsBtn) {
        const span = tabSettingsBtn.querySelector('span');
        if (span) span.textContent = i18n.t('options.tab.settings');
      }
      if (tabHelpBtn) {
        const span = tabHelpBtn.querySelector('span');
        if (span) span.textContent = i18n.t('options.tab.help');
      }
      if (tabAboutBtn) {
        const span = tabAboutBtn.querySelector('span');
        if (span) span.textContent = i18n.t('options.tab.about');
      }

      // 更新标题
      const titleEl = document.querySelector('h1');
      if (titleEl) titleEl.textContent = i18n.t('options.title');

      // 更新按钮文本
      if (addBtn) addBtn.textContent = i18n.t('options.add.button');
      if (saveEditBtn) saveEditBtn.textContent = i18n.t('save');
      if (cancelEditBtn) cancelEditBtn.textContent = i18n.t('cancel');

      // 更新输入框占位符
      if (wordInput) wordInput.placeholder = i18n.t('options.add.placeholder');
      if (editInput) editInput.placeholder = i18n.t('options.add.placeholder');
      if (editCategoryInput) editCategoryInput.placeholder = i18n.t('options.edit.category.placeholder');

      // 更新空状态
      const emptyStateEl = document.getElementById('emptyState');
      if (emptyStateEl) {
        const p = emptyStateEl.querySelector('p');
        if (p) p.textContent = i18n.t('options.words.empty');
      }

      // 更新分类标签（需要重新渲染）
      renderCategoryTabs();
    } catch (error) {
      console.error('更新文本失败:', error);
    }
  }
});
