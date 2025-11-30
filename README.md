# CopyDiv - 常用词快速复制扩展

一个实用的 Edge/Chrome 浏览器扩展，帮助你快速管理和复制常用文本内容。

## ✨ 主要功能

- 📝 **常用词管理**：添加、编辑、删除常用词，支持多行文本（最多 500 字符）
- 🏷️ **分类管理**：为常用词设置分类（如：工作、生活、默认等），快速筛选
- 🎨 **颜色标记**：为每个常用词设置不同颜色，方便视觉识别
- 📋 **快速复制**：点击按钮即可复制到剪贴板，复制成功后自动关闭弹窗
- ⚙️ **配置管理**：设置 popup 弹窗默认显示的分类
- 📚 **帮助文档**：内置详细的使用说明和常见问题解答
- 🔄 **数据同步**：使用 Chrome 同步存储，数据在登录账户间自动同步

## 📦 安装步骤

### 从源码安装

1. 克隆或下载项目到本地
   ```bash
   git clone https://github.com/Jason4019/copydiv.git
   cd copydiv
   ```

2. 打开 Edge 浏览器
3. 在地址栏输入 `edge://extensions/`
4. 开启右上角的"开发人员模式"开关
5. 点击"加载解压缩的扩展"
6. 选择项目文件夹 `copydiv`

### 从 Chrome Web Store 安装

（待发布）

## 🚀 快速开始

1. **添加常用词**
   - 右键扩展图标 → 选择"选项"
   - 在"常用词管理"页面输入文本（支持多行）
   - 点击"添加"按钮或按 `Ctrl+Enter`（Mac: `Cmd+Enter`）

2. **使用常用词**
   - 点击浏览器工具栏的扩展图标
   - 点击任意常用词按钮即可复制到剪贴板
   - 复制成功后弹窗会自动关闭

3. **管理常用词**
   - 在选项页面可以编辑、删除常用词
   - 编辑时可以设置分类和颜色
   - 使用顶部标签快速筛选不同分类

## 📖 使用说明

### 添加常用词

- 支持单行和多行文本
- 在文本框中按 `Enter` 可以换行
- 按 `Ctrl+Enter`（Mac: `Cmd+Enter`）快速提交
- 每个常用词最多 500 个字符

### 编辑常用词

- 点击常用词右侧的"编辑"按钮
- 可以修改文本、分类和颜色
- 按 `Ctrl+Enter` 保存，`Esc` 取消

### 分类管理

- 在编辑时为常用词设置分类名称（如：工作、生活、接口模板等）
- 顶部标签可以快速筛选不同分类
- 支持自定义分类名称

### 颜色标记

- 每个常用词可以设置不同的颜色
- 在弹窗中，常用词按钮会显示对应的颜色
- 方便快速识别和分类

### 配置选项

- 在"配置管理"页面可以设置 popup 默认标签
- 设置后，下次打开弹窗时会自动显示该分类下的常用词

## ⌨️ 快捷键

- `Ctrl+Enter` / `Cmd+Enter`：添加或保存常用词
- `Esc`：取消编辑
- `Enter`：在文本框中换行（多行输入）

## 📁 项目结构

```
copydiv/
├── manifest.json          # 扩展清单文件（Manifest V3）
├── popup.html            # 弹出窗口 HTML
├── popup.js              # 弹出窗口脚本
├── background.js         # 后台服务工作者
├── options.html          # 选项页面 HTML
├── options.js            # 选项页面脚本
├── utils.js              # 共享工具函数
├── styles/               # 样式文件目录
│   ├── popup.css         # 弹出窗口样式
│   └── options.css       # 选项页面样式
├── icons/                # 图标文件目录
│   ├── icon16.png        # 16x16 图标
│   ├── icon48.png        # 48x48 图标
│   └── icon128.png       # 128x128 图标
├── README.md             # 项目说明文档
├── TEST_GUIDE.md         # 测试指南
└── QUICK_TEST.md         # 快速测试清单
```

## 🛠️ 技术栈

- **Manifest V3**：使用最新的扩展标准
- **Chrome Storage API**：数据存储和同步
- **原生 JavaScript**：无依赖，轻量级
- **现代 CSS**：响应式设计，支持换行显示

## 📝 开发说明

### 权限说明

- `storage`：用于存储常用词数据，支持 Chrome 同步

### 数据存储

- 使用 `chrome.storage.sync` 存储常用词列表
- 数据结构：`{ id, text, category, color, createdAt }`
- 数据会在登录的 Chrome/Edge 账户间自动同步

### 代码结构

- `utils.js`：共享工具函数（颜色调色板、存储封装等）
- `options.js`：选项页面逻辑（常用词管理、配置管理）
- `popup.js`：弹出窗口逻辑（快速复制）
- `background.js`：后台服务（安装初始化）

## 🧪 测试

详细测试指南请参考 [TEST_GUIDE.md](./TEST_GUIDE.md)

快速测试清单请参考 [QUICK_TEST.md](./QUICK_TEST.md)

## 📄 许可证

本项目采用 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

- 报告问题：[GitHub Issues](https://github.com/Jason4019/copydiv/issues)
- 提交代码：[GitHub Pull Requests](https://github.com/Jason4019/copydiv/pulls)

## 📞 联系方式

- GitHub: [@Jason4019](https://github.com/Jason4019)
- 项目地址: [https://github.com/Jason4019/copydiv](https://github.com/Jason4019/copydiv)

## 🙏 致谢

感谢使用 CopyDiv 扩展！如有问题或建议，欢迎在 GitHub 上提交 Issue。

---

**版本**: 1.0.0  
**最后更新**: 2025
