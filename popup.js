// popup.js - 弹出窗口脚本

document.addEventListener('DOMContentLoaded', () => {
  const wordsList = document.getElementById('wordsList');
  const emptyState = document.getElementById('emptyState');
  const statusDiv = document.getElementById('status');
  const openOptionsLink = document.getElementById('openOptions');

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
    wordsList.style.display = 'flex';

    words.forEach((word) => {
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
    button.title = `点击复制：${word.text}`;
    
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
});
