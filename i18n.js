// i18n.js - 国际化语言文件

(function (global) {
  const i18n = {
    languages: {
      'zh-CN': {
        // 通用
        'all': '全部',
        'default': '默认',
        'save': '保存',
        'cancel': '取消',
        'edit': '编辑',
        'delete': '删除',
        'add': '添加',
        'settings': '配置管理',
        'help': '帮助',
        'about': '关于',
        
        // Options 页面
        'options.title': '常用词设置',
        'options.tab.words': '常用词管理',
        'options.tab.settings': '配置管理',
        'options.tab.help': '帮助',
        'options.tab.about': '关于',
        'options.add.title': '添加常用词',
        'options.add.placeholder': '输入常用词（支持换行）...',
        'options.add.button': '添加',
        'options.words.title': '常用词列表',
        'options.words.empty': '暂无常用词，请添加常用词',
        'options.edit.title': '编辑常用词',
        'options.edit.category': '分类',
        'options.edit.category.placeholder': '如：默认、工作、生活等',
        'options.edit.color': '颜色',
        'options.delete.confirm': '确认删除"{text}"吗？',
        'options.message.added': '🎉 已添加到常用词列表',
        'options.message.updated': '✅ 常用词已更新',
        'options.message.deleted': '🗑 已删除',
        'options.message.defaultCategory': '已将 popup 默认标签设置为「{value}」',
        'options.error.empty': '请输入常用词',
        'options.error.length': '常用词长度不能超过500个字符',
        'options.error.duplicate': '该常用词已存在',
        
        // Settings 页面
        'settings.title': '设置',
        'settings.title.full': '配置管理',
        'settings.defaultCategory': 'popup 默认标签：',
        'settings.defaultCategory.hint': '打开弹窗时优先显示的分类',
        'settings.language': '语言：',
        'settings.language.hint': '选择界面显示语言',
        
        // Popup 页面
        'popup.title': '常用词',
        'popup.empty': '暂无常用词',
        'popup.empty.link': '前往设置添加',
        'popup.copy.success': '已复制到剪贴板',
        'popup.copy.failed': '复制失败，请重试',
        
        // About 页面
        'about.title': '关于',
        'about.version': '版本：',
        'about.projectInfo': '📦 项目信息',
        'about.projectInfo.name': '扩展名称：',
        'about.projectInfo.version': '版本号：',
        'about.projectInfo.manifest': 'Manifest 版本：',
        'about.links': '🔗 相关链接',
        'about.license': '📝 许可证',
        'about.license.text': '本项目采用 MIT 许可证开源。',
        'about.thanks': '🙏 致谢',
        'about.thanks.text': '感谢使用 CopyDiv 扩展！如有问题或建议，欢迎在 GitHub 上提交 Issue。',
      },
      'en-US': {
        // Common
        'all': 'All',
        'default': 'Default',
        'save': 'Save',
        'cancel': 'Cancel',
        'edit': 'Edit',
        'delete': 'Delete',
        'add': 'Add',
        'settings': 'Settings',
        'help': 'Help',
        'about': 'About',
        
        // Options page
        'options.title': 'Common Words Settings',
        'options.tab.words': 'Words Management',
        'options.tab.settings': 'Settings',
        'options.tab.help': 'Help',
        'options.tab.about': 'About',
        'options.add.title': 'Add Common Word',
        'options.add.placeholder': 'Enter common word (supports line breaks)...',
        'options.add.button': 'Add',
        'options.words.title': 'Common Words List',
        'options.words.empty': 'No common words, please add some',
        'options.edit.title': 'Edit Common Word',
        'options.edit.category': 'Category',
        'options.edit.category.placeholder': 'e.g., Default, Work, Life, etc.',
        'options.edit.color': 'Color',
        'options.delete.confirm': 'Confirm delete "{text}"?',
        'options.message.added': '🎉 Added to common words list',
        'options.message.updated': '✅ Common word updated',
        'options.message.deleted': '🗑 Deleted',
        'options.message.defaultCategory': 'Set popup default category to "{value}"',
        'options.error.empty': 'Please enter a common word',
        'options.error.length': 'Common word cannot exceed 500 characters',
        'options.error.duplicate': 'This common word already exists',
        
        // Settings page
        'settings.title': 'Settings',
        'settings.title.full': 'Settings',
        'settings.defaultCategory': 'Popup Default Category:',
        'settings.defaultCategory.hint': 'Category to display when opening popup',
        'settings.language': 'Language:',
        'settings.language.hint': 'Select interface language',
        
        // Popup page
        'popup.title': 'Common Words',
        'popup.empty': 'No common words',
        'popup.empty.link': 'Go to Settings to Add',
        'popup.copy.success': 'Copied to clipboard',
        'popup.copy.failed': 'Copy failed, please try again',
        
        // About page
        'about.title': 'About',
        'about.version': 'Version:',
        'about.projectInfo': '📦 Project Information',
        'about.projectInfo.name': 'Extension Name:',
        'about.projectInfo.version': 'Version:',
        'about.projectInfo.manifest': 'Manifest Version:',
        'about.links': '🔗 Links',
        'about.license': '📝 License',
        'about.license.text': 'This project is licensed under the MIT License.',
        'about.thanks': '🙏 Acknowledgments',
        'about.thanks.text': 'Thank you for using CopyDiv extension! If you have any questions or suggestions, please submit an Issue on GitHub.',
      }
    },

    currentLang: 'zh-CN',

    init() {
      // 从存储中读取语言设置
      chrome.storage.sync.get(['language'], (result) => {
        if (result.language && this.languages[result.language]) {
          this.currentLang = result.language;
        }
        this.updateDocumentLang();
      });
    },

    async getLanguage() {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['language'], (result) => {
          resolve(result.language || 'zh-CN');
        });
      });
    },

    async setLanguage(lang) {
      if (!this.languages[lang]) {
        lang = 'zh-CN';
      }
      return new Promise((resolve) => {
        chrome.storage.sync.set({ language: lang }, () => {
          this.currentLang = lang;
          this.updateDocumentLang();
          resolve(lang);
        });
      });
    },

    t(key, params = {}) {
      const translation = this.languages[this.currentLang]?.[key] || key;
      if (Object.keys(params).length === 0) {
        return translation;
      }
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    },

    updateDocumentLang() {
      if (document.documentElement) {
        document.documentElement.lang = this.currentLang;
      }
    },

    onLanguageChanged(callback) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes.language) {
          this.currentLang = changes.language.newValue || 'zh-CN';
          this.updateDocumentLang();
          callback(this.currentLang);
        }
      });
    }
  };

  // 初始化
  i18n.init();

  global.i18n = i18n;
})(window);
