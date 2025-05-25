# 吵架包赢 🔥

一个基于 AI 的智能反驳助手，帮你在任何争论中都能占据上风！

## ✨ 功能特点

- 🤖 **AI 智能生成**：使用 DeepSeek V3 模型生成高质量的反驳回复
- 📱 **移动端优化**：完美适配手机和电脑，微信风格设计
- 🎚️ **语气调节**：1-10 级语气强烈程度调节，从温和到火力全开
- 💾 **本地存储**：自动保存历史记录到 localStorage
- 📋 **一键复制**：轻松复制生成的回复内容
- ⚡ **实时生成**：快速响应，即时获得 3 条不同角度的反驳

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 🛠️ 技术栈

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **AI 模型**：DeepSeek V3 (通过 OpenRouter)
- **图标**：Lucide React
- **存储**：localStorage

## 📱 使用方法

1. **输入对方的话**：在文本框中输入对方说的内容
2. **调节语气强度**：拖动滑块选择回复的强烈程度（1-10）
3. **点击开始吵架**：AI 将生成 3 条不同角度的反驳回复
4. **复制使用**：点击复制按钮，将回复粘贴到聊天中

## 🎨 设计理念

- **微信风格**：采用微信绿色主题，符合中国用户习惯
- **移动优先**：专为手机用户设计，支持触摸操作
- **简洁易用**：界面简洁，操作直观，老少皆宜
- **理性讨论**：提倡理性辩论，避免人身攻击

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件：

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=your_site_url
```

### API 配置

应用使用 OpenRouter 的 DeepSeek V3 模型，需要：

1. 注册 [OpenRouter](https://openrouter.ai) 账号
2. 获取 API Key
3. 配置环境变量

## 📂 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── argue/
│   │       └── route.ts      # API 路由
│   │   └── globals.css           # 全局样式
│   │   └── layout.tsx           # 根布局
│   │   └── page.tsx             # 主页面
│   └── ...
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本应用仅供娱乐和学习使用，请理性使用 AI 生成的内容，提倡和谐讨论，避免恶意争吵。

---

**理性讨论，和谐交流** 💚
