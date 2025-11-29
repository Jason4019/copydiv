// popup.js - 弹出窗口脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const statusDiv = document.getElementById('status');
  const openOptionsLink = document.getElementById('openOptions');
  const categoryTabs = document.getElementById('categoryTabs');

  let currentCategory = '全部';

  // 打开设置页面
  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // 初始化：加载常用词列表
  loadWords();

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

    emptyState.style.display = 'none';
    wordsList.style.display = 'flex';

    filteredWords.forEach((word) => {
      const wordBtn = createWordButton(word);
      wordsList.appendChild(wordBtn);
    });
  }

  /**
   * 创建常用词按钮
   */
  function createWordButton(word) {
    const button = document.createElement('button');
    button.className = 'word-btn';
    button.textContent = word.text;
    button.title = `点击复制：${(word.text || '').replace(/\n/g, ' ')}`; // 提示中换行替换为空格
    button.style.whiteSpace = 'pre-wrap'; // 支持换行显示
    button.style.textAlign = 'left'; // 左对齐

    const color = word.color || getDefaultColor(word.id || 0);
    button.style.backgroundColor = color;
    button.style.borderColor = color;
    button.style.color = '#fff';
    
    button.addEventListener('click', () => {
      copyToClipboard(word.text);
    });

    return button;
  }

  /**
   * 复制到剪贴板
   */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showStatus(`已复制：${text}`, 'success');
    } catch (error) {
      // 降级方案：使用传统方法
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showStatus(`已复制：${text}`, 'success');
      } catch (fallbackError) {
        showStatus('复制失败，请重试', 'error');
        console.error('复制失败:', fallbackError);
      }
    }
  }

  /**
   * 显示状态提示
   */
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
      statusDiv.style.display = 'none';
    }, 2000);
  }

  // 监听存储变化，实现自动刷新
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.commonWords) {
      loadWords();
    }
  });

  /**
   * 获取默认颜色（与 options 保持一致）
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
});
