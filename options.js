// options.js - 选项页面脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordInput = document.getElementById('wordInput');
  const addBtn = document.getElementById('addBtn');
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const messageDiv = document.getElementById('message');
  const inputError = document.getElementById('inputError');
  const categoryTabs = document.getElementById('categoryTabs');
  const editModal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const editCategoryInput = document.getElementById('editCategory');
  const editColorInput = document.getElementById('editColor');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editError = document.getElementById('editError');

  let editingId = null; // 当前编辑的词条ID
  let currentCategory = '全部'; // 当前筛选的分类

  // 初始化：加载常用词列表
  loadWords();

  // 添加常用词
  addBtn.addEventListener('click', addWord);
  wordInput.addEventListener('keydown', (e) => {
    // Ctrl+Enter 或 Cmd+Enter 提交
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      addWord();
    }
  });

  // 编辑相关事件
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

  // 点击模态框外部关闭
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
      cancelEdit();
    }
  });

  /**
   * 加载常用词列表
   */
  function loadWords() {
    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      renderCategoryTabs(words);
      renderWordsList(words);
    });
  }

  /**
   * 渲染分类标签
   */
  function renderCategoryTabs(words) {
    if (!categoryTabs) return;

    categoryTabs.innerHTML = '';

    const categoriesSet = new Set();
    categoriesSet.add('全部');
    words.forEach((w) => {
      const cat = w.category && w.category.trim() ? w.category.trim() : '默认';
      categoriesSet.add(cat);
    });

    const categories = Array.from(categoriesSet);

    categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'category-tab';
      if (cat === currentCategory) {
        btn.classList.add('active');
      }
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        currentCategory = cat;
        renderCategoryTabs(words);
        renderWordsList(words);
      });
      categoryTabs.appendChild(btn);
    });
  }

  /**
   * 渲染常用词列表
   */
  function renderWordsList(words) {
    wordsList.innerHTML = '';

    const filteredWords = currentCategory === '全部'
      ? words
      : words.filter((w) => {
          const cat = w.category && w.category.trim() ? w.category.trim() : '默认';
          return cat === currentCategory;
        });

    if (filteredWords.length === 0) {
      emptyState.style.display = 'block';
      wordsList.style.display = 'none';
      return;
    }

    if (words.length === 0) {
      emptyState.style.display = 'block';
      wordsList.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    wordsList.style.display = 'block';

    filteredWords.forEach((word) => {
      const wordItem = createWordItem(word);
      wordsList.appendChild(wordItem);
    });
  }

  /**
   * 创建常用词列表项
   */
  function createWordItem(word) {
    const item = document.createElement('div');
    item.className = 'word-item';
    item.dataset.id = word.id;

    const color = word.color || getDefaultColor(word.id || 0);

    const colorDot = document.createElement('span');
    colorDot.className = 'word-color-dot';
    colorDot.style.backgroundColor = color;

    const textSpan = document.createElement('div');
    textSpan.className = 'word-text';
    textSpan.textContent = word.text;
    textSpan.style.whiteSpace = 'pre-wrap'; // 支持换行显示

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

    return item;
  }

  /**
   * 添加常用词
   */
  function addWord() {
    const text = wordInput.value.trimEnd(); // 保留开头的换行，去除末尾空白
    const trimmedText = text.trim(); // 用于验证是否为空
    
    // 输入验证（使用 trim 后的文本检查是否为空，但长度检查使用原始文本）
    if (!trimmedText) {
      showInputError('请输入常用词');
      return;
    }
    
    if (text.length > 500) {
      showInputError('常用词长度不能超过500个字符');
      return;
    }

    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      
      // 检查是否重复（比较时使用原始文本，保留换行）
      if (words.some(w => w.text === text)) {
        showInputError('该常用词已存在');
        return;
      }

      // 生成新ID
      const newId = words.length > 0 
        ? Math.max(...words.map(w => w.id)) + 1 
        : 1;

      // 添加新词
      const newWord = {
        id: newId,
        text: text,
        createdAt: Date.now(),
        color: getDefaultColor(newId),
        category: '默认'
      };

      words.push(newWord);
      
      chrome.storage.sync.set({ commonWords: words }, () => {
        wordInput.value = '';
        clearInputError();
        loadWords();
        showMessage('常用词添加成功！', 'success');
      });
    });
  }

  /**
   * 编辑常用词
   */
  function editWord(id) {
    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      const word = words.find(w => w.id === id);
      
      if (word) {
        editingId = id;
        editInput.value = word.text;
        if (editCategoryInput) {
          editCategoryInput.value = word.category || '默认';
        }
        if (editColorInput) {
          editColorInput.value = word.color || getDefaultColor(word.id || 0);
        }
        editModal.style.display = 'flex';
        editInput.focus();
        clearEditError();
      }
    });
  }

  /**
   * 保存编辑
   */
  function saveEdit() {
    const text = editInput.value.trimEnd(); // 保留开头的换行，去除末尾空白
    const trimmedText = text.trim(); // 用于验证是否为空
    const category = editCategoryInput ? editCategoryInput.value.trim() : '';
    const color = editColorInput ? editColorInput.value : '';
    
    // 输入验证（使用 trim 后的文本检查是否为空，但长度检查使用原始文本）
    if (!trimmedText) {
      showEditError('请输入常用词');
      return;
    }
    
    if (text.length > 500) {
      showEditError('常用词长度不能超过500个字符');
      return;
    }

    if (editingId === null) {
      return;
    }

    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      
      // 检查是否与其他词重复
      const duplicateWord = words.find(w => w.text === text && w.id !== editingId);
      if (duplicateWord) {
        showEditError('该常用词已存在');
        return;
      }

      // 更新词条
      const wordIndex = words.findIndex(w => w.id === editingId);
      if (wordIndex !== -1) {
        words[wordIndex].text = text;
        words[wordIndex].category = category || '默认';
        words[wordIndex].color = color || getDefaultColor(words[wordIndex].id || 0);
        
        chrome.storage.sync.set({ commonWords: words }, () => {
          cancelEdit();
          loadWords();
          showMessage('常用词更新成功！', 'success');
        });
      }
    });
  }

  /**
   * 取消编辑
   */
  function cancelEdit() {
    editingId = null;
    editInput.value = '';
    editModal.style.display = 'none';
    clearEditError();
  }

  /**
   * 删除常用词
   */
  function deleteWord(id) {
    if (!confirm('确定要删除这个常用词吗？')) {
      return;
    }

    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      const filteredWords = words.filter(w => w.id !== id);
      
      chrome.storage.sync.set({ commonWords: filteredWords }, () => {
        loadWords();
        showMessage('常用词已删除', 'success');
      });
    });
  }

  /**
   * 获取默认颜色（根据 id 或索引生成）
   */
  function getDefaultColor(index) {
    const palette = [
      '#0078d4', // 蓝
      '#107c10', // 绿
      '#d83b01', // 橙
      '#5c2d91', // 紫
      '#038387', // 青
      '#e3008c', // 粉
      '#8e562e', // 棕
      '#0063b1', // 深蓝
    ];
    if (index === undefined || index === null) {
      return palette[0];
    }
    return palette[index % palette.length];
  }

  /**
   * 显示输入错误
   */
  function showInputError(message) {
    inputError.textContent = message;
    inputError.style.display = 'block';
  }

  /**
   * 清除输入错误
   */
  function clearInputError() {
    inputError.textContent = '';
    inputError.style.display = 'none';
  }

  /**
   * 显示编辑错误
   */
  function showEditError(message) {
    editError.textContent = message;
    editError.style.display = 'block';
  }

  /**
   * 清除编辑错误
   */
  function clearEditError() {
    editError.textContent = '';
    editError.style.display = 'none';
  }

  /**
   * 显示消息提示
   */
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 3000);
  }

  // 监听存储变化，实现自动刷新
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.commonWords) {
      loadWords();
    }
  });
});
