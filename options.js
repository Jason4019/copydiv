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
  const tabButtons = document.querySelectorAll('.options-tab');
  const tabWords = document.getElementById('tab-words');
  const tabSettings = document.getElementById('tab-settings');
  const editModal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const editCategoryInput = document.getElementById('editCategory');
  const editColorInput = document.getElementById('editColor');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editError = document.getElementById('editError');

  const state = {
    words: [],
    currentCategory: '全部',
    defaultCategory: '全部',
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
    state.defaultCategory = await CommonWordsUtils.getDefaultCategory();
    await loadWords();
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
      if (target === 'settings') {
        tabSettings.classList.add('active');
      } else {
        tabWords.classList.add('active');
      }
    });
  });

  if (defaultCategorySelect) {
    defaultCategorySelect.addEventListener('change', async (e) => {
      const value = e.target.value || '全部';
      state.defaultCategory = value;
      await CommonWordsUtils.setDefaultCategory(value);
      showMessage(`已将 popup 默认标签设置为「${value}」`, 'info', 1800);
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
    state.words.forEach((word) => {
      categories.add(getWordCategory(word));
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
        state.defaultCategory = '全部';
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
      editBtn.textContent = '编辑';
      editBtn.addEventListener('click', () => editWord(word.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = '删除';
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
      showInputError('该常用词已存在');
      return;
    }

    const newId = words.length > 0 ? Math.max(...words.map((w) => w.id)) + 1 : 1;
    const newWord = {
      id: newId,
      text: rawText,
      createdAt: Date.now(),
      color: CommonWordsUtils.getDefaultColor(newId),
      category: '默认',
    };

    words.push(newWord);
    await CommonWordsUtils.saveWords(words);

    wordInput.value = '';
    clearInputError();
    showMessage('🎉 已添加到常用词列表', 'success');
  }

  async function editWord(id) {
    const words = await CommonWordsUtils.getWords();
    const word = words.find((w) => w.id === id);
    if (!word) return;

    state.editingId = id;
    editInput.value = word.text;
    editCategoryInput.value = getWordCategory(word);
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

    const category = editCategoryInput.value.trim() || '默认';
    const color = editColorInput.value || CommonWordsUtils.getDefaultColor(state.editingId);

    const words = await CommonWordsUtils.getWords();
    const duplicate = words.find((w) => w.text === rawText && w.id !== state.editingId);
    if (duplicate) {
      showEditError('该常用词已存在');
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
    showMessage('✅ 常用词已更新', 'success');
    cancelEdit();
  }

  function cancelEdit() {
    state.editingId = null;
    editInput.value = '';
    editCategoryInput.value = '默认';
    editColorInput.value = '#0078d4';
    clearEditError();
    editModal.style.display = 'none';
  }

  async function deleteWord(id) {
    const words = await CommonWordsUtils.getWords();
    const target = words.find((w) => w.id === id);
    if (!target) return;

    if (!confirm(`确认删除“${target.text.slice(0, 20)}”吗？`)) {
      return;
    }

    const filtered = words.filter((w) => w.id !== id);
    await CommonWordsUtils.saveWords(filtered);
    showMessage('🗑 已删除', 'info');
  }

  // 校验 & 提示
  function validateText(text, errorElement) {
    const trimmed = text.trim();
    if (!trimmed) {
      if (errorElement === inputError) {
        showInputError('请输入常用词');
      } else {
        showEditError('请输入常用词');
      }
      return false;
    }

    if (text.length > 500) {
      if (errorElement === inputError) {
        showInputError('常用词长度不能超过500个字符');
      } else {
        showEditError('常用词长度不能超过500个字符');
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
    return (word.category && word.category.trim()) ? word.category.trim() : '默认';
  }
});
