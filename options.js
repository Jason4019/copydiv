// options.js - 选项页面脚本

document.addEventListener('DOMContentLoaded', () => {
  const enableCheckbox = document.getElementById('enableExtension');
  const setting1Input = document.getElementById('setting1');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const messageDiv = document.getElementById('message');

  // 加载保存的设置
  loadSettings();

  saveBtn.addEventListener('click', saveSettings);
  resetBtn.addEventListener('click', resetSettings);

  function loadSettings() {
    chrome.storage.sync.get(['enabled', 'setting1'], (result) => {
      enableCheckbox.checked = result.enabled !== false; // 默认为 true
      setting1Input.value = result.setting1 || '';
    });
  }

  function saveSettings() {
    const settings = {
      enabled: enableCheckbox.checked,
      setting1: setting1Input.value
    };

    chrome.storage.sync.set(settings, () => {
      showMessage('设置已保存！', 'success');
    });
  }

  function resetSettings() {
    chrome.storage.sync.clear(() => {
      loadSettings();
      showMessage('设置已重置！', 'info');
    });
  }

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 3000);
  }
});

