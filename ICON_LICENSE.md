# 图标版权和许可说明

## 图标文件位置

图标文件位于 `icons/` 目录：
- `icon16.png` - 16x16 像素
- `icon48.png` - 48x48 像素
- `icon128.png` - 128x128 像素

## 版权状态

### 当前状态
✅ **已确认**：图标使用 Favicon.io 生成

### 图标来源
- **生成工具**：Favicon.io
- **工具网站**：https://favicon.io/
- **生成方式**：通过 Favicon.io 在线工具生成

### 可能的情况

#### 情况 1：自定义设计
- 如果您自己设计了图标，您拥有版权
- 建议在项目中明确声明版权归属

#### 情况 2：使用第三方图标
- 如果使用了第三方图标（如从图标库下载），需要：
  - ✅ 确认使用许可（如 MIT、CC0、商业许可等）
  - ✅ 在项目中注明来源和许可
  - ✅ 遵守许可条款（如需要署名）

#### 情况 3：使用图标生成工具（当前情况）
- 本扩展的图标使用 **Favicon.io** 生成
- Favicon.io 使用条款说明：
  - ✅ 工具本身免费使用
  - ⚠️ 用户需确保使用的资源（字体、emoji等）有适当许可
  - ⚠️ Favicon.io 可能使用 Google Fonts 和 Twemoji 等资源
  - 📝 建议：如果使用了特定字体或 emoji，需确认其许可

## 建议操作

### 1. 检查图标来源
- 回顾图标是如何获得的
- 查找原始来源和许可信息

### 2. 添加许可声明
如果图标有特定的许可要求，建议在项目中添加：

#### 在 README.md 中添加
```markdown
## 图标许可
- 图标来源：[来源名称]
- 许可类型：[MIT / CC0 / 自定义等]
- 许可链接：[如有]
```

#### 创建 LICENSE-ICONS 文件
如果图标使用不同的许可，创建单独的文件说明。

### 3. 推荐图标资源（如果需要替换）

#### 免费图标库（可商用）
- **Flaticon** (需要署名)
- **Icons8** (免费版需要署名)
- **Font Awesome** (MIT License)
- **Material Icons** (Apache 2.0)
- **Heroicons** (MIT License)

#### 图标生成工具
- **Favicon.io** - 生成 favicon
- **RealFaviconGenerator** - 多平台图标生成
- **Canva** - 在线设计工具

## 示例许可声明模板

### 如果使用 MIT 许可的图标
```markdown
## 图标许可
本扩展使用的图标来自 [来源名称]，采用 MIT 许可。
原始项目：[链接]
```

### 如果使用 CC0 许可的图标
```markdown
## 图标许可
本扩展使用的图标采用 CC0 许可（公共领域）。
来源：[链接]
```

### 如果使用自定义图标
```markdown
## 图标许可
本扩展的图标为自定义设计，版权归项目作者所有。
```

### 如果使用 Favicon.io 生成的图标（当前情况）
```markdown
## 图标许可
本扩展的图标使用 Favicon.io (https://favicon.io/) 生成。
- 工具网站：https://favicon.io/
- 使用条款：https://favicon.io/terms-of-use
- 注意事项：如使用了 Google Fonts 或 Twemoji，需遵守相应许可
  - Google Fonts：开源字体，通常可商用
  - Twemoji：CC-BY 4.0 许可（需要署名）
```

## 商店提交注意事项

在提交到 Chrome Web Store 或 Edge Add-ons 时：
- ✅ 确保图标不侵犯他人版权
- ✅ 确保图标符合商店要求（清晰、可识别）
- ✅ 如有需要，提供许可证明

## 当前状态

### ✅ 已确认信息
- **图标来源**：Favicon.io
- **生成方式**：通过 Favicon.io 在线工具生成
- **工具许可**：免费使用

### ⚠️ 需要确认
1. **使用的资源**：确认生成图标时是否使用了：
   - Google Fonts（通常可商用）
   - Twemoji（CC-BY 4.0，需要署名）
   - 其他字体或图形资源

2. **建议操作**：
   - 如果只使用了文字/字母生成图标，通常无许可问题
   - 如果使用了 emoji，需遵守 Twemoji 的 CC-BY 4.0 许可（需要署名）
   - 建议在 README.md 中添加图标许可说明

## 建议的许可声明

建议在 `README.md` 中添加以下内容：

```markdown
## 图标许可
本扩展的图标使用 [Favicon.io](https://favicon.io/) 生成。
- 工具网站：https://favicon.io/
- 使用条款：https://favicon.io/terms-of-use
```

---

**重要**：在发布到商店前，必须确认图标的使用许可，避免版权问题。
