// utils.js - 共享工具函数

(function (global) {
  const CommonWordsUtils = {
    palette: [
      '#0078d4', // 蓝
      '#107c10', // 绿
      '#d83b01', // 橙
      '#5c2d91', // 紫
      '#038387', // 青
      '#e3008c', // 粉
      '#8e562e', // 棕
      '#0063b1', // 深蓝
    ],

    getDefaultColor(index = 0) {
      return this.palette[index % this.palette.length];
    },

    async getDefaultCategory() {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['defaultCategory'], (result) => {
          resolve(result.defaultCategory || '全部');
        });
      });
    },

    async setDefaultCategory(category) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ defaultCategory: category || '全部' }, () => resolve(category || '全部'));
      });
    },

    async getWords() {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['commonWords'], (result) => {
          resolve(result.commonWords || []);
        });
      });
    },

    async saveWords(words) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ commonWords: words }, () => resolve(words));
      });
    },

    onWordsChanged(callback) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes.commonWords) {
          callback(changes.commonWords.newValue || []);
        }
      });
    }
  };

  global.CommonWordsUtils = CommonWordsUtils;
})(window);
