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

// 当前版本无需长期运行的后台逻辑，仅保留安装/更新初始化
