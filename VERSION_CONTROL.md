# 版本管理指南

本项目使用 Git 进行版本管理。

## 基本命令

### 初始化（已完成）
```bash
git init
```

### 查看状态
```bash
git status
```
查看哪些文件被修改、添加或删除。

### 添加文件到暂存区
```bash
# 添加所有文件
git add .

# 添加特定文件
git add manifest.json popup.js
```

### 提交更改
```bash
git commit -m "提交说明信息"
```

### 查看提交历史
```bash
git log
```

### 查看文件差异
```bash
# 查看工作区的更改
git diff

# 查看已暂存的更改
git diff --staged
```

## 常用工作流程

### 1. 日常开发流程
```bash
# 1. 查看当前状态
git status

# 2. 添加修改的文件
git add .

# 3. 提交更改
git commit -m "描述你的更改内容"

# 4. 查看提交历史
git log --oneline
```

### 2. 创建分支（推荐用于新功能）
```bash
# 创建并切换到新分支
git checkout -b feature/新功能名称

# 或者使用新语法
git switch -c feature/新功能名称

# 查看所有分支
git branch

# 切换回主分支
git checkout main
# 或
git switch main
```

### 3. 撤销更改
```bash
# 撤销工作区的修改（未暂存）
git restore 文件名

# 撤销所有工作区的修改
git restore .

# 取消暂存（已 add 但未 commit）
git restore --staged 文件名
```

### 4. 查看提交历史
```bash
# 简洁模式
git log --oneline

# 图形化显示
git log --graph --oneline --all

# 查看最近 5 次提交
git log -5 --oneline
```

## 远程仓库（可选）

如果需要推送到 GitHub、GitLab 等远程仓库：

### 添加远程仓库
```bash
git remote add origin https://github.com/用户名/仓库名.git
```

### 推送到远程
```bash
# 首次推送
git push -u origin main

# 后续推送
git push
```

### 从远程拉取
```bash
git pull
```

## 推荐的分支策略

- `main` 或 `master` - 主分支，保持稳定
- `develop` - 开发分支
- `feature/功能名` - 功能分支
- `fix/问题描述` - 修复分支

## 提交信息规范

建议使用清晰的提交信息：

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建/工具相关
```

示例：
```bash
git commit -m "feat: 添加弹出窗口功能"
git commit -m "fix: 修复内容脚本注入问题"
```

