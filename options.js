// options.js - 选项页面脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordInput = document.getElementById('wordInput');
  const addBtn = document.getElementById('addBtn');
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const messageDiv = document.getElementById('message');
  const inputError = document.getElementById('inputError');
  const editModal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editError = document.getElementById('editError');

  let editingId = null; // 当前编辑的词条ID

  // 初始化：加载常用词列表
  loadWords();

  // 添加常用词
  addBtn.addEventListener('click', addWord);
  wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addWord();
    }
  });

  // 编辑相关事件
  saveEditBtn.addEventListener('click', saveEdit);
  cancelEditBtn.addEventListener('click', cancelEdit);
  editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
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
      renderWordsList(words);
    });
  }

  /**
   * 渲染常用词列表
   */
  function renderWordsList(words) {
    wordsList.innerHTML = '';
    
    if (words.length === 0) {
      emptyState.style.display = 'block';
      wordsList.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    wordsList.style.display = 'block';

    words.forEach((word) => {
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

    const textSpan = document.createElement('span');
    textSpan.className = 'word-text';
    textSpan.textContent = word.text;

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

    item.appendChild(textSpan);
    item.appendChild(actionsDiv);

    return item;
  }

  /**
   * 添加常用词
   */
  function addWord() {
    const text = wordInput.value.trim();
    
    // 输入验证
    if (!validateInput(text, inputError)) {
      return;
    }

    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      
      // 检查是否重复
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
        createdAt: Date.now()
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
    const text = editInput.value.trim();
    
    // 输入验证
    if (!validateInput(text, editError)) {
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
   * 输入验证
   */
  function validateInput(text, errorElement) {
    if (!text) {
      if (errorElement === inputError) {
        showInputError('请输入常用词');
      } else {
        showEditError('请输入常用词');
      }
      return false;
    }

    if (text.length > 100) {
      if (errorElement === inputError) {
        showInputError('常用词长度不能超过100个字符');
      } else {
        showEditError('常用词长度不能超过100个字符');
      }
      return false;
    }

    return true;
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
