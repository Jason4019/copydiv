// 测试脚本 - 在扩展的选项页面或弹出窗口的 Console 中运行
// 注意：必须在扩展的上下文中运行（options.html 或 popup.html 的 Console），不能在普通网页运行

console.log('=== 常用词插件测试脚本 ===\n');

// 检查 chrome.storage 是否可用
if (typeof chrome === 'undefined' || !chrome.storage) {
  console.error('❌ 错误：chrome.storage 不可用！');
  console.error('请在扩展的选项页面（options.html）或弹出窗口（popup.html）的 Console 中运行此脚本。');
  console.error('打开方式：');
  console.error('1. 选项页面：右键扩展图标 → 选项 → 按 F12 打开开发者工具');
  console.error('2. 弹出窗口：点击扩展图标 → 右键弹出窗口 → 检查 → 在 Console 中运行');
} else {
  console.log('✅ chrome.storage 可用\n');

  // 测试1：设置测试数据
  console.log('测试1：设置测试数据...');
  chrome.storage.sync.set({ 
    commonWords: [
      { id: 1, text: '第一行\n第二行\n第三行', createdAt: Date.now() },
      { id: 2, text: '单行文本', createdAt: Date.now() },
      { id: 3, text: '多行示例：\n这是第二行\n这是第三行', createdAt: Date.now() }
    ] 
  }, () => {
    console.log('✅ 测试数据已设置\n');
    
    // 测试2：读取数据
    console.log('测试2：读取常用词列表...');
    chrome.storage.sync.get(['commonWords'], (result) => {
      const words = result.commonWords || [];
      console.log(`✅ 成功读取 ${words.length} 个常用词：`);
      words.forEach((word, index) => {
        console.log(`  ${index + 1}. ID: ${word.id}, 文本: ${JSON.stringify(word.text)}`);
      });
      console.log('');
      
      // 测试3：添加新词
      console.log('测试3：添加新常用词...');
      const newWord = {
        id: Math.max(...words.map(w => w.id)) + 1,
        text: '测试添加\n换行测试',
        createdAt: Date.now()
      };
      words.push(newWord);
      chrome.storage.sync.set({ commonWords: words }, () => {
        console.log('✅ 新词已添加\n');
        
        // 测试4：验证换行
        console.log('测试4：验证换行字符...');
        chrome.storage.sync.get(['commonWords'], (result) => {
          const allWords = result.commonWords || [];
          const hasNewline = allWords.some(w => w.text.includes('\n'));
          if (hasNewline) {
            console.log('✅ 换行字符保存成功');
            const wordWithNewline = allWords.find(w => w.text.includes('\n'));
            console.log(`   示例：${JSON.stringify(wordWithNewline.text)}`);
          } else {
            console.log('❌ 未找到包含换行的词');
          }
          console.log('\n=== 测试完成 ===');
          console.log('提示：刷新页面查看效果');
        });
      });
    });
  });
}

// 辅助函数：清空所有数据
window.clearTestData = function() {
  chrome.storage.sync.set({ commonWords: [] }, () => {
    console.log('✅ 测试数据已清空，请刷新页面');
  });
};

// 辅助函数：查看当前数据
window.viewTestData = function() {
  chrome.storage.sync.get(['commonWords'], (result) => {
    const words = result.commonWords || [];
    console.log(`当前有 ${words.length} 个常用词：`);
    words.forEach((word, index) => {
      console.log(`${index + 1}. ${JSON.stringify(word.text)}`);
    });
  });
};

console.log('\n提示：可以使用以下辅助函数：');
console.log('  clearTestData() - 清空所有测试数据');
console.log('  viewTestData() - 查看当前数据');
