~~~Markdown
# Web 应用开发宪法

---

## 🧭 核心原则

> **冲突裁决优先级**：无障碍 > 安全 > 性能 > 一致性 > 视觉效果

1. **组件化优先**：单一职责，单组件≤300行，原子设计分层，可独立测试
2. **API 优先**：前后端分离，错误格式标准化（RFC 7807），类型从 Schema 自动生成
3. **响应式 + 无障碍（不可协商）**：Mobile First，WCAG 2.1 AA，语义化 HTML
4. **性能优先**：LCP<2.5s, INP<200ms, CLS<0.1, 移动端首屏资源<1MB
5. **类型安全**：TypeScript `strict: true`，禁止 `any`（`unknown` + 类型守卫除外，需注释理由）
6. **安全不可妥协**：强制 HTTPS，CSP 策略，用户输入一律消毒

---

## 📁 项目结构

```
src/
├── core/           # hooks / utils / constants / 自动生成的 API 类型
├── components/     # 原子设计（atoms → molecules → organisms）
├── features/       # 业务模块（各含 components/hooks/api/types）
├── layouts/        # 响应式布局（Mobile/Desktop/ResponsiveShell）
├── pages/          # 路由页面
├── styles/         # 主题变量 / 断点 / 深色模式 CSS 变量
├── i18n/           # 国际化资源
└── services/       # API 客户端 / 第三方服务封装
```

---

## 📱 多平台适配

| 平台 | 关键策略 |
|------|----------|
| 移动端 | 触摸目标≥44px，避免 hover 依赖，懒加载，注意 safe-area-inset |
| 桌面端 | 键盘导航 + 快捷键，预加载/预取关键资源 |
| PWA | Service Worker 缓存（核心页 Cache First，API Stale-While-Revalidate） |
| 低端设备 | 减少 JS 体积，长列表必须虚拟化 |

断点标准：sm:640px / md:768px / lg:1024px / xl:1280px / 2xl:1536px

---

## ⚙️ 技术要求

### 样式
- Tailwind CSS 优先，通过 `tailwind.config` 统一设计令牌
- **禁止内联静态样式**；动态值通过 CSS 变量：`style={{ '--progress': percent + '%' }}`
- 深色模式：CSS 变量 + `prefers-color-scheme`，支持手动切换
- z-index 分层管理（dropdown:100 → sticky:200 → modal:400 → toast:600）

### 状态管理（按类型选择，禁止全塞全局 store）
| 类型 | 方案 | 示例 |
|------|------|------|
| 服务端数据 | TanStack Query / SWR | 用户列表、订单 |
| 全局客户端 | Zustand / Pinia | 登录态、主题 |
| 表单 | React Hook Form / VeeValidate | 表单输入校验 |
| URL 状态 | 路由搜索参数 | 搜索词、分页 |
| 局部 UI | useState / ref | 弹窗开关 |

### 安全
- 认证令牌存 HttpOnly Cookie，**禁止 localStorage 存敏感信息**
- 禁止 `dangerouslySetInnerHTML` 裸用，必须 DOMPurify 消毒
- 生产环境禁止 `console.log`，禁止输出 Token/密码/PII

### 国际化
- 面向用户的文本必须外部化（i18n），**禁止硬编码文案**
- 日期/数字/货币用 `Intl` API，禁止手动拼接
- 使用逻辑属性（`margin-inline-start`）以支持 RTL

### 图片与资源
```jsx
// ✅ 始终这样输出图片
<picture>
  <source srcSet="photo.avif" type="image/avif" />
  <source srcSet="photo.webp" type="image/webp" />
  <img 
    srcSet="photo-480.jpg 480w, photo-800.jpg 800w"
    sizes="(max-width: 600px) 480px, 800px"
    loading="lazy" decoding="async"
    alt="描述性文字"   // alt 不可为空
    width={800} height={600}  // 必须声明防止 CLS
  />
</picture>
```

---

## 🚫 反模式（绝对禁止）

```jsx
// ❌ hover 依赖 → 移动端不可用
<div onMouseOver={handler}>...</div>
// ✅ hover + focus 双触发 + tabIndex
<div onMouseEnter={show} onFocus={show} onBlur={hide} tabIndex={0}>...</div>

// ❌ 非语义化 → 屏幕阅读器无法理解
<div onClick={submit}>提交</div>
// ✅ 语义化
<button type="submit" onClick={submit}>提交</button>

// ❌ 全部塞全局 store
const useStore = create(set => ({ isModalOpen: false, userList: [], formData: {} }))
// ✅ 各归各位
const [isModalOpen, setIsModalOpen] = useState(false)          // 本地
const { data } = useQuery({ queryKey: ['users'] })             // 服务端
const { register } = useForm()                                  // 表单

// ❌ 手动维护 API 类型
interface User { id: number; name: string }
// ✅ 从 Schema 自动生成
import type { components } from '@/core/types/api'
type User = components['schemas']['User']
```

---

## ✅ 生成代码自检清单

每次输出代码前，逐项确认：

- [ ] 组件单一职责，≤300行，无平台硬编码
- [ ] 触摸目标≥44px，键盘可导航，焦点可见
- [ ] 语义化 HTML + 正确 ARIA，色彩对比度≥4.5:1
- [ ] 响应式适配所有断点，支持深色模式
- [ ] 图片优化（现代格式/srcSet/lazy/alt/宽高声明）
- [ ] API 请求有超时/重试/取消（AbortController），组件卸载时清理
- [ ] 类型安全，无 `any`，API 类型自动生成
- [ ] 用户输入已消毒，无敏感信息泄露
- [ ] 文案已外部化（i18n），无硬编码
- [ ] 状态管理方式与状态类型匹配
- [ ] Error Boundary 兜底，降级展示友好页面
- [ ] 无 `console.log`，无内联静态样式
~~~