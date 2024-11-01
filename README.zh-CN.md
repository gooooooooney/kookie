# Kookie - Cookie 管理器 Chrome 扩展

一个功能强大的 Chrome 扩展程序，用于管理浏览器 cookies。它提供了直观的用户界面，让您可以轻松地跨域查看、编辑、导入和导出 cookies。

[English](README.md)

## ✨ 功能特性

- 🔍 查看当前网站的所有 cookies
- ✏️ 编辑单个 cookie 的所有属性
- 📋 通过剪贴板导入/导出 cookies
- 🔄 批量修改 cookies 域名
- 🏷️ 按域名筛选 cookies
- 🔎 搜索特定的 cookies
- ➕ 添加新的 cookies
- 🗑️ 删除单个或所有 cookies

## 🖼️ 截图展示

[此处添加截图]

## 🛠️ 技术栈

- [Plasmo](https://docs.plasmo.com/) - Chrome 扩展开发框架
- [React](https://reactjs.org/) - 用户界面库
- [Mantine](https://mantine.dev/) - UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集

## 🚀 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/your-username/kookie.git
cd kookie
```

2. 安装依赖：
```bash
pnpm install
```

3. 启动开发服务器：
```bash
pnpm dev
```

4. 在 Chrome 中加载扩展：
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `build/chrome-mv3-dev` 目录

## 📦 构建

生成生产版本：
```bash
pnpm build
```

打包扩展：
```bash
pnpm package
```

## 📖 使用指南

1. **查看 Cookies**
   - 点击扩展图标打开管理界面
   - 所有 cookies 会以列表形式展示
   - 点击展开查看详细信息

2. **编辑 Cookie**
   - 点击 cookie 右侧的编辑图标
   - 修改相关属性
   - 点击保存应用更改

3. **导入/导出**
   - 点击"Copy"按钮导出 cookies
   - 点击"Paste"按钮从剪贴板导入 cookies
   - 可以选择在导入/导出前编辑域名

4. **筛选和搜索**
   - 使用顶部的域名选择器筛选特定域名
   - 使用搜索框查找特定的 cookies

## 🔒 隐私声明

本扩展：
- 仅在明确请求时访问 cookies
- 不收集任何用户数据
- 不向任何外部服务器发送数据
- 所有操作都在您的浏览器本地执行

## 📄 许可证

[MIT 许可证](LICENSE)

## 👤 作者

gooney

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 更新日志

### 1.0.0
- 首次发布
- 基础 cookie 管理功能
- 导入/导出功能
- 域名过滤和搜索
- 批量操作支持