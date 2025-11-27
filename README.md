# CopyDiv Edge 浏览器扩展

一个功能强大的 Edge 浏览器扩展项目。

## 文件结构

```
copydiv/
├── manifest.json          # 扩展清单文件（Manifest V3）
├── popup.html            # 弹出窗口 HTML
├── popup.js              # 弹出窗口脚本
├── background.js         # 后台服务工作者
├── content.js            # 内容脚本
├── options.html          # 选项页面 HTML
├── options.js            # 选项页面脚本
├── styles/               # 样式文件目录
│   ├── popup.css         # 弹出窗口样式
│   ├── options.css       # 选项页面样式
│   └── content.css       # 内容脚本样式
└── icons/                # 图标文件目录
    ├── icon16.png        # 16x16 图标
    ├── icon48.png        # 48x48 图标
    └── icon128.png       # 128x128 图标
```

## 安装步骤

1. 打开 Edge 浏览器
2. 在地址栏输入 `edge://extensions/`
3. 开启"开发人员模式"（右上角开关）
4. 点击"加载解压缩的扩展"
5. 选择项目文件夹

## 功能说明

- **弹出窗口**：点击扩展图标时显示的界面
- **后台脚本**：处理扩展的后台逻辑
- **内容脚本**：在网页中注入的脚本
- **选项页面**：扩展的设置界面

## 开发说明

- 使用 Manifest V3 标准
- 支持所有网站（`<all_urls>`）
- 使用 Chrome Storage API 存储数据

## 注意事项

1. 需要添加图标文件到 `icons/` 目录
2. 根据实际需求修改权限设置
3. 开发时记得在扩展管理页面点击"重新加载"以应用更改

