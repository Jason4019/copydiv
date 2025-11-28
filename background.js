// background.js - 后台服务工作者

// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('扩展已安装');
    // 设置默认值
    chrome.storage.sync.set({
      enabled: true,
      commonWords: [] // 常用词列表，数据结构：[{ id: number, text: string, createdAt: number }]
    });
  } else if (details.reason === 'update') {
    console.log('扩展已更新');
    // 迁移旧数据或初始化新字段
    chrome.storage.sync.get(['commonWords'], (result) => {
      if (!result.commonWords) {
        chrome.storage.sync.set({ commonWords: [] });
      }
    });
  }
});

// 监听来自内容脚本或弹出窗口的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    // 处理数据请求
    chrome.storage.sync.get(null, (data) => {
      sendResponse({ success: true, data });
    });
    return true; // 保持消息通道开放以支持异步响应
  }
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 标签页加载完成后的操作
    console.log('标签页已加载:', tab.url);
  }
});

