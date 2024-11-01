# Kookie - Cookie Manager Chrome Extension

A powerful Chrome extension for managing browser cookies with an intuitive interface for viewing, editing, importing, and exporting cookies across domains.

[中文文档](README.zh-CN.md)

## ✨ Features

- 🔍 View all cookies for the current website
- ✏️ Edit all properties of individual cookies
- 📋 Import/Export cookies via clipboard
- 🔄 Bulk modify cookie domains
- 🏷️ Filter cookies by domain
- 🔎 Search for specific cookies
- ➕ Add new cookies
- 🗑️ Delete individual or all cookies

## 🖼️ Screenshots

[Add screenshots here]

## 🛠️ Tech Stack

- [Plasmo](https://docs.plasmo.com/) - Chrome extension framework
- [React](https://reactjs.org/) - UI library
- [Mantine](https://mantine.dev/) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/kookie.git
cd kookie
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` directory

## 📦 Build

Generate production build:
```bash
pnpm build
```

Package the extension:
```bash
pnpm package
```

## 📖 Usage Guide

1. **View Cookies**
   - Click the extension icon to open the manager
   - All cookies are displayed in a list
   - Click to expand for detailed information

2. **Edit Cookies**
   - Click the edit icon next to a cookie
   - Modify the properties
   - Click save to apply changes

3. **Import/Export**
   - Click "Copy" to export cookies
   - Click "Paste" to import from clipboard
   - Option to edit domains before import/export

4. **Filter and Search**
   - Use the domain selector to filter specific domains
   - Use the search box to find specific cookies

## 🔒 Privacy

This extension:
- Only accesses cookies when explicitly requested
- Does not collect any user data
- Does not send data to any external servers
- All operations are performed locally in your browser

## 📄 License

[MIT License](LICENSE)

## 👤 Author

gooney

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📝 Changelog

### 1.0.0
- Initial release
- Basic cookie management features
- Import/Export functionality
- Domain filtering and search
- Bulk operations support