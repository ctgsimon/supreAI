~~~Markdown
# TypeScript 开发

---

## 🧭 核心原则

> **冲突裁决优先级**：类型安全 > 安全 > 可读性 > 一致性 > 微优化

1. **类型安全（不可协商）**：`strict: true`，禁止 `any`（`unknown` + 类型守卫除外，需注释理由）
2. **显式优于隐式**：所有函数签名、返回值、泛型约束必须显式标注
3. **组合优于继承**：interface + 函数组合实现复用，class 仅用于有状态实体
4. **不可变优先**：`readonly` / `as const` / `Readonly<T>` 为默认，可变需理由
5. **错误是值**：显式处理每个错误路径，禁止吞异常，构建有意义错误链

---

## 📁 项目结构

```
src/
├── types/          # 全局类型定义 / 自动生成的 API 类型
├── core/           # 纯业务逻辑（无框架依赖）
├── services/       # 外部服务封装（API / DB / 第三方）
├── utils/          # 纯工具函数
├── config/         # 配置加载 + 环境变量校验
└── index.ts        # 公共 API 导出（库项目）
```

> ⚠️ **Barrel Export 警告**：`index.ts` 统一导出会导致 tree-shaking 失效。
> 应用项目按需直接导入；仅库项目使用 barrel export。

---

## ⚙️ 技术要求

### 类型系统

```typescript
// ❌ 禁止：any / 类型断言逃逸 / 非空断言滥用
function parse(data: any) { return data.name }
const user = getUser() as User          // 跳过检查
const name = user!.profile!.name        // 运行时可能炸

// ✅ 要求：unknown + 类型守卫 + 安全访问
function parse(data: unknown): ParsedResult {
  if (!isValidPayload(data)) {
    throw new AppError("INVALID_PAYLOAD", "数据格式不合法")
  }
  return data  // 此时类型已收窄
}

// 类型守卫
function isValidPayload(data: unknown): data is Payload {
  return (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as Record<string, unknown>).name === "string"
  )
}

const name = user?.profile?.name ?? "未知用户"
```

### interface vs type

```typescript
// ✅ interface：对象结构（支持声明合并 + extends）
interface User {
  readonly id: string
  name: string
  email: string
}

interface Admin extends User {
  permissions: readonly Permission[]
}

// ✅ type：联合 / 交叉 / 映射 / 工具类型
type Status = "active" | "inactive" | "suspended"
type UserUpdate = Partial<Pick<User, "name" | "email">>
type ApiResponse<T> = { data: T; meta: PaginationMeta }
```

### enum vs as const

```typescript
// ❌ 避免：数字枚举（运行时生成反向映射，体积膨胀）
enum Direction { Up, Down, Left, Right }

// ✅ 优先：as const 对象（tree-shakeable，类型更精确）
const Direction = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const

type Direction = (typeof Direction)[keyof typeof Direction]
// → "UP" | "DOWN" | "LEFT" | "RIGHT"

// ✅ 可接受：字符串枚举（当需要枚举方法/遍历时）
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
```

### 泛型

```typescript
// ❌ 禁止：无约束泛型
function merge<T, U>(a: T, b: U) { ... }

// ✅ 要求：泛型必须加约束
function merge<T extends object, U extends object>(
  a: T,
  b: U
): T & U {
  return { ...a, ...b }
}

// ✅ 工具类型适度使用，避免过度类型体操
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
// ⚠️ 超过 3 层嵌套的条件类型需注释说明意图
```

### 运行时校验（编译时与运行时桥接）

```typescript
// ❌ 禁止：信任外部数据的编译时类型
const user = (await res.json()) as User  // 运行时无保障

// ✅ 要求：Zod schema 定义 → 推导类型（单一事实来源）
import { z } from "zod"

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "user", "guest"]),
})

type User = z.infer<typeof UserSchema>  // 类型从 schema 推导

// 外部数据必须经过运行时校验
const user = UserSchema.parse(await res.json())
```

### 命名规范

| 类别 | 风格 | 示例 |
|------|------|------|
| 变量 / 函数 | camelCase | `getUserById`, `isActive` |
| 类 / 接口 / 类型 | PascalCase | `UserService`, `ApiResponse` |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 枚举成员 | PascalCase（枚举）/ UPPER（as const） | `HttpMethod.GET`, `Direction.UP` |
| 文件名 | kebab-case | `user-service.ts`, `api-client.ts` |

### 函数设计

```typescript
// ❌ 禁止：参数过多 / 返回值模糊
function createUser(
  name: string, email: string, age: number,
  role: string, avatar?: string
) { ... }

// ✅ 要求：对象参数（≥3 个时） + 显式返回类型
interface CreateUserParams {
  readonly name: string
  readonly email: string
  readonly age: number
  readonly role: UserRole
  readonly avatar?: string
}

async function createUser(params: CreateUserParams): Promise<User> {
  const validated = CreateUserSchema.parse(params)
  return userRepository.create(validated)
}
```

### 错误处理

```typescript
// ❌ 禁止：吞异常 / 无类型错误 / console.log
try { await save(data) }
catch { /* 静默吞掉 */ }

try { await save(data) }
catch (e) { console.log(e) }  // 无结构化处理

// ✅ 要求：统一错误类型 + 显式处理
class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
    public readonly cause?: Error,
  ) {
    super(message)
    this.name = "AppError"
  }
}

async function saveUser(user: User): Promise<void> {
  try {
    await repository.save(user)
  } catch (error) {
    throw new AppError(
      "USER_SAVE_FAILED",
      `保存用户 ${user.id} 失败`,
      { userId: user.id },
      error instanceof Error ? error : undefined,
    )
  }
}
```

### 不可变优先

```typescript
// ❌ 禁止：可变数据结构默认暴露
interface Config {
  endpoints: string[]        // 外部可随意 push
  settings: Record<string, string>
}

// ✅ 要求：默认 readonly，可变需理由
interface Config {
  readonly endpoints: readonly string[]
  readonly settings: Readonly<Record<string, string>>
}

// as const 锁定字面量类型
const ROLES = ["admin", "user", "guest"] as const
type Role = (typeof ROLES)[number]  // "admin" | "user" | "guest"
```

### 安全
- 禁止硬编码密钥/密码，从环境变量读取并用 Zod 校验
- 所有外部输入（API/用户/文件）必须运行时校验
- 生产环境禁止 `console.log`，使用结构化日志
- 依赖定期审计（`npm audit` / `pnpm audit`），高危漏洞立即修复

### 核心 tsconfig 要求

```jsonc
{
  "compilerOptions": {
    "strict": true,            // 不可协商
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,  // 索引访问返回 T | undefined
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "verbatimModuleSyntax": true       // 强制 type-only import
  }
}
```

---

## 🚫 更多反模式

```typescript
// ❌ 默认导出（重构困难 + 命名不一致）
export default class UserService { ... }
import Whatever from "./user-service"  // 导入方可随意命名

// ✅ 命名导出
export class UserService { ... }
import { UserService } from "./user-service"

// ❌ 类型断言绕过检查
const config = {} as Config  // 运行时空对象，字段全 undefined

// ✅ 构建完整对象或用 builder
const config: Config = {
  endpoints: ["https://api.example.com"],
  settings: { theme: "dark" },
}

// ❌ 过度类型体操（无注释的 4 层嵌套条件类型）
type X<T> = T extends A ? T extends B ? T extends C ? D : E : F : G

// ✅ 拆分 + 注释意图
/** 提取可序列化的属性键 */
type SerializableKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

/** 只保留可序列化属性 */
type Serializable<T> = Pick<T, SerializableKeys<T>>
```

---

## 🧪 测试要求

- 测试文件 `*.test.ts`，与源码同目录或 `tests/` 镜像
- 结构：`describe` 模块 → `it` 用例，遵循 **Arrange-Act-Assert**
- Mock 最小化：只 mock 外部依赖（网络/数据库/文件系统）
- 覆盖率：核心逻辑≥90%，整体≥80%，CI 强制卡点

```typescript
// ✅ 测试示例
describe("UserSchema", () => {
  it("应拒绝无效 email", () => {
    const result = UserSchema.safeParse({
      id: "123",
      name: "test",
      email: "not-an-email",
      role: "user",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email")
    }
  })
})
```

---

## ✅ 生成代码自检清单

每次输出代码前，逐项确认：

- [ ] `strict: true` + `noUncheckedIndexedAccess`，无 `any`，无 `as` 类型断言逃逸
- [ ] 函数签名完整（参数类型 + 返回类型 + 泛型约束）
- [ ] interface 用于对象结构，type 用于联合/映射/工具类型
- [ ] 外部数据经 Zod 等运行时校验，类型从 schema 推导
- [ ] 命名导出优先，无默认导出（页面组件/框架要求除外）
- [ ] 对象属性默认 `readonly`，数组默认 `readonly T[]`
- [ ] 错误显式处理（AppError），无吞异常，无裸 `console.log`
- [ ] 函数参数≤3 个，超限用 readonly 接口对象
- [ ] `as const` 替代数字枚举，字符串枚举需明确理由
- [ ] 无硬编码密钥/配置，环境变量 Zod 校验
- [ ] 测试覆盖正常/边界/错误路径，mock 仅限外部依赖
- [ ] 导入顺序规范（内置 → 第三方 → 项目内部 → 相对路径）
~~~