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

### 本地开发

1. **安装依赖**
```bash
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local 填入真实的 API Key
```

3. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产部署

支持 **Cloudflare + GitHub + Vercel** 完整部署方案：

1. **GitHub**: 代码托管和版本控制
2. **Vercel**: 应用部署和 API 托管
3. **Cloudflare**: DNS 管理、CDN 加速、安全防护

详细部署步骤见下方 [部署指南](#-部署指南) 部分。

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

⚠️ **重要安全提醒**：请勿将 API Key 直接写在代码中！

1. 复制 `.env.example` 文件为 `.env.local`：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的真实 API Key：
```env
OPENROUTER_API_KEY=your_actual_openrouter_api_key
NEXT_PUBLIC_SITE_URL=your_site_url
```

3. `.env.local` 文件已被 `.gitignore` 忽略，不会被推送到 GitHub

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

## 🚀 部署指南

### Cloudflare + GitHub + Vercel 完整部署方案

#### 1. GitHub 配置 ✅

代码已推送到 GitHub，无需额外配置。

#### 2. Vercel 部署配置

1. **连接 GitHub**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择 `argue-win.like228` 仓库

2. **环境变量配置**
   ```
   OPENROUTER_API_KEY = your_new_openrouter_api_key
   NEXT_PUBLIC_SITE_URL = https://argue-win.like228.online
   NODE_ENV = production
   ```

3. **部署设置**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### 3. Cloudflare DNS 配置

1. **添加域名到 Cloudflare**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 添加站点: `like228.online`
   - 更新域名服务器到 Cloudflare

2. **DNS 记录配置**
   ```
   类型: CNAME
   名称: argue-win
   目标: your-vercel-domain.vercel.app
   代理状态: 已代理 (橙色云朵)
   ```

3. **SSL/TLS 设置**
   - 加密模式: 完全(严格)
   - 边缘证书: 启用
   - 始终使用 HTTPS: 启用

#### 4. Cloudflare 安全配置

1. **防火墙规则**
   ```
   规则名称: API 保护
   字段: URI 路径
   运算符: 包含
   值: /api/argue
   操作: 质询 (Captcha)
   ```

2. **速率限制**
   ```
   规则名称: API 限流
   匹配条件: URI 路径包含 "/api/argue"
   速率: 20 请求/分钟
   操作: 阻止
   ```

3. **Bot Fight Mode**
   - 启用 Bot Fight Mode
   - 启用 Super Bot Fight Mode (Pro 计划)

#### 5. 验证部署

1. **检查域名解析**
   ```bash
   nslookup argue-win.like228.online
   ```

2. **测试 API 端点**
   ```bash
   curl -X POST https://argue-win.like228.online/api/argue \
     -H "Content-Type: application/json" \
     -d '{"opponentText":"测试","intensity":5}'
   ```

3. **检查安全头**
   ```bash
   curl -I https://argue-win.like228.online
   ```

#### 6. 监控和维护

1. **Vercel Analytics**: 启用访问统计
2. **Cloudflare Analytics**: 监控流量和安全事件
3. **OpenRouter Dashboard**: 监控 API 使用量
4. **GitHub Actions**: 可选的 CI/CD 自动化

### 🔒 安全检查清单

- ✅ API Key 存储在 Vercel 环境变量中
- ✅ 域名白名单验证
- ✅ 请求频率限制
- ✅ Cloudflare DDoS 保护
- ✅ SSL/TLS 加密
- ✅ 安全头配置
- ✅ Bot 检测和防护

---

**理性讨论，和谐交流** 💚
