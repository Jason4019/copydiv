// content.js - 内容脚本

// 监听来自弹出窗口或后台脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'execute') {
    // 执行页面操作
    try {
      // 在这里添加你的页面操作逻辑
      console.log('内容脚本执行操作');
      
      // 示例：显示通知
      showNotification('操作已执行');
      
      sendResponse({ success: true, message: '操作完成' });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // 保持消息通道开放
});

// 页面加载完成后的初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('内容脚本已初始化');
  // 在这里添加初始化逻辑
}

function showNotification(message) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'extension-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // 3秒后移除
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

