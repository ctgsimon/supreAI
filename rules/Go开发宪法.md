~~~Markdown
# Go 开发宪法

---

## 🧭 核心原则

> **冲突裁决优先级**：简单性 > 安全 > 显式 > 可读性 > 微优化

1. **简单性优先**：用最少代码解决问题，YAGNI，禁止过度抽象
2. **显式优于隐式**：类型转换 / 错误处理 / 依赖声明必须显式，禁止魔法行为
3. **组合优于继承**：struct + interface 组合复用，优先小接口（1-3 个方法）
4. **并发安全（不可协商）**：goroutine + channel 通信优先；共享内存必加 sync.Mutex/RWMutex
5. **错误是值**：error 必须显式处理，构建有意义错误链（`fmt.Errorf + %w`），禁止忽略

---

## 📁 项目结构

```
cmd/
├── server/            # 服务入口
├── cli/               # 命令行入口
└── mobile/            # gomobile 入口（如需要）
internal/
├── core/              # 100% 复用：业务逻辑 / 领域模型 / 算法
├── platform/          # 平台适配层
│   ├── interface.go   # 平台接口定义（小接口）
│   ├── mobile/        # gomobile 绑定 / Android-iOS 桥接
│   └── desktop/       # fyne / wails / 系统 API
├── service/           # 应用服务层（编排核心逻辑）
├── repository/        # 数据访问层
├── transport/         # HTTP / gRPC handler
└── config/            # 配置加载（按环境/平台差异化）
pkg/                   # 可导出的公共库（谨慎添加）
```

---

## ⚙️ 技术要求

### 基础
- Go 1.22+，启用 `GOOS/GOARCH` 交叉编译验证
- 依赖管理：Go Modules 精确锁定，新增依赖需确认多平台兼容
- 格式化：`gofmt` + `goimports`（CI 强制），`golangci-lint` 全量通过

### 平台隔离（核心规则）

```go
// ❌ 禁止：运行时判断平台，难测试且污染核心逻辑
func GetStoragePath() string {
    if runtime.GOOS == "android" {
        return "/sdcard/app/data"
    }
    home, _ := os.UserHomeDir()
    return filepath.Join(home, ".app")
}

// ✅ 要求：build tags + 接口隔离

// file: storage.go — 接口定义
type Storage interface {
    Save(key string, data []byte) error
    Load(key string) ([]byte, error)
}

// file: storage_mobile.go
//go:build android || ios

type mobileStorage struct{ /* ... */ }
func (s *mobileStorage) Save(key string, data []byte) error { /* 平台实现 */ }

// file: storage_desktop.go
//go:build darwin || linux || windows

type desktopStorage struct{ /* ... */ }
func (s *desktopStorage) Save(key string, data []byte) error { /* 平台实现 */ }

// 核心逻辑只依赖接口
func ProcessData(s Storage, raw []byte) error {
    result := transform(raw) // 纯业务逻辑
    return s.Save("result", result)
}
```

### 错误处理

```go
// ❌ 禁止：忽略错误 / 裸返回 / 无上下文
result, _ := doSomething()       // 忽略 error
if err != nil { return err }     // 丢失上下文

// ✅ 要求：显式处理 + 错误链
result, err := doSomething()
if err != nil {
    return fmt.Errorf("process order %d: %w", orderID, err)
}

// ✅ 自定义错误类型用于业务判断
var ErrNotFound = errors.New("not found")

func GetUser(id int64) (*User, error) {
    user, err := repo.Find(id)
    if err != nil {
        return nil, fmt.Errorf("get user %d: %w", id, err)
    }
    if user == nil {
        return nil, fmt.Errorf("user %d: %w", id, ErrNotFound)
    }
    return user, nil
}

// 调用方用 errors.Is 判断
if errors.Is(err, ErrNotFound) { /* 404 */ }
```

### 并发安全

```go
// ❌ 禁止：无控制地创建 goroutine
func SyncData(chunks []Chunk) {
    for _, c := range chunks {
        go upload(c)  // 数量不可控，资源耗尽
    }
}

// ✅ 要求：信号量 + context 取消 + errgroup
func SyncData(ctx context.Context, chunks []Chunk) error {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(10) // 限制并发度

    for _, c := range chunks {
        c := c
        g.Go(func() error {
            select {
            case <-ctx.Done():
                return ctx.Err()
            default:
                return upload(ctx, c)
            }
        })
    }
    return g.Wait()
}
```

### 资源管理

```go
// ❌ 禁止：不释放资源 / 不用 defer
f, _ := os.Open(path)
data := readAll(f)
// 忘记 f.Close()

// ✅ 要求：defer 立即释放 + 错误检查
f, err := os.Open(path)
if err != nil {
    return fmt.Errorf("open %s: %w", path, err)
}
defer f.Close()
```

### 接口设计

```go
// ❌ 禁止：大接口 / interface{} 滥用
type Service interface {
    CreateUser(...)
    GetUser(...)
    DeleteUser(...)
    SendEmail(...)     // 职责混杂
    GenerateReport(...)
}

func Process(data any) { /* any 滥用 */ }

// ✅ 要求：小接口 + 泛型替代 any
type UserReader interface {
    GetUser(ctx context.Context, id int64) (*User, error)
}

type UserWriter interface {
    CreateUser(ctx context.Context, u *User) error
}

// 需要时组合
type UserService interface {
    UserReader
    UserWriter
}

// 泛型替代 any
func Filter[T any](items []T, predicate func(T) bool) []T {
    var result []T
    for _, item := range items {
        if predicate(item) {
            result = append(result, item)
        }
    }
    return result
}
```

### 安全
- 禁止硬编码密钥/密码/路径，从环境变量或平台安全存储读取（Keychain/Keystore）
- SQL 必须参数化查询，禁止字符串拼接
- HTTP handler 必须设置超时（`http.Server{ReadTimeout, WriteTimeout}`）
- 生产环境禁止 `fmt.Println`，使用结构化日志（`slog` / `zerolog`）

### 日志规范

```go
// ❌ 禁止
fmt.Printf("user %s login, password: %s\n", user.Name, user.Password)

// ✅ 要求：结构化 + 脱敏
slog.Info("user login",
    "user_id", user.ID,
    "platform", platform,
    "trace_id", traceID,
)
```

---

## 🚫 更多反模式

```go
// ❌ init() 隐藏副作用
func init() {
    db = connectDB()        // 隐式初始化，测试无法控制
    registerAllHandlers()   // 魔法行为
}

// ✅ 显式初始化 + 依赖注入
func NewApp(db *sql.DB, logger *slog.Logger) *App {
    return &App{db: db, logger: logger}
}

// ❌ panic 用于业务错误
func MustGetUser(id int64) *User {
    u, err := repo.Find(id)
    if err != nil {
        panic(err) // 业务逻辑不应 panic
    }
    return u
}

// ✅ panic 仅用于不可恢复的程序错误（初始化阶段除外）
func GetUser(id int64) (*User, error) {
    u, err := repo.Find(id)
    if err != nil {
        return nil, fmt.Errorf("get user %d: %w", id, err)
    }
    return u, nil
}
```

---

## 🧪 测试要求

```bash
# 核心逻辑：竞态检测 + 覆盖率
go test ./internal/core/... -race -cover -coverprofile=coverage.out

# 平台适配层：按目标平台
GOOS=android go test ./internal/platform/mobile/...
GOOS=darwin  go test ./internal/platform/desktop/...

# 集成测试：独立标记
go test ./... -tags=integration -race
```

- **表驱动测试**（Table-Driven Tests）为默认模式
- **每个 Bug 修复附带回归测试**
- **测试包命名 `_test`**：黑盒测试优先（`package foo_test`），仅内部逻辑用白盒
- **Mock 最小化**：只 mock 外部依赖（网络/数据库），interface 天然支持测试替换

```go
// ✅ 表驱动测试示例
func TestParseAmount(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    int64
        wantErr bool
    }{
        {"valid", "100.50", 10050, false},
        {"negative", "-50", -5000, false},
        {"invalid", "abc", 0, true},
        {"empty", "", 0, true},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseAmount(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}
```

---

## ✅ 生成代码自检清单

每次输出代码前，逐项确认：

- [ ] 核心逻辑无 `runtime.GOOS` 判断，平台差异用 build tags + interface 隔离
- [ ] 所有 error 显式处理，错误链包含上下文（`fmt.Errorf + %w`），无 `_` 忽略
- [ ] 并发有明确上限控制（`errgroup.SetLimit` / 信号量），支持 context 取消
- [ ] 资源操作 `defer` 释放，无文件/连接泄漏
- [ ] 接口小而专（1-3 方法），无 `any` / `interface{}` 滥用（泛型替代）
- [ ] 无 `init()` 隐藏副作用，依赖通过构造函数显式注入
- [ ] 业务逻辑禁止 `panic`，仅程序不可恢复错误允许
- [ ] 无 `fmt.Println`，使用结构化日志（slog），敏感信息已脱敏
- [ ] 无硬编码密钥/路径/配置，SQL 参数化查询
- [ ] HTTP 服务设置超时，graceful shutdown 处理
- [ ] 表驱动测试覆盖正常/边界/错误路径，`-race` 通过
- [ ] 向后兼容，破坏性变更需明确标注
~~~