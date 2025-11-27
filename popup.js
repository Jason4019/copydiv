// popup.js - 弹出窗口脚本

document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('actionBtn');
  const statusDiv = document.getElementById('status');

  // 从存储中加载设置
  chrome.storage.sync.get(['enabled'], (result) => {
    if (result.enabled !== undefined) {
      updateButtonState(result.enabled);
    }
  });

  actionBtn.addEventListener('click', async () => {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // 执行内容脚本操作
      await chrome.tabs.sendMessage(tab.id, { action: 'execute' });
      
      showStatus('操作成功！', 'success');
    } catch (error) {
      showStatus('操作失败: ' + error.message, 'error');
    }
  });

  function updateButtonState(enabled) {
    actionBtn.textContent = enabled ? '已启用' : '已禁用';
    actionBtn.classList.toggle('enabled', enabled);
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
});

