~~~Markdown
# Go 代码风格规范

---

## 错误处理（最易犯错）

```go
// ❌ 忽略 error / 裸返回 / 无上下文包装
result, _ := doSomething()

if err != nil {
    return err  // 丢失上下文
}

// ✅ 必查 + 包装上下文
result, err := doSomething()
if err != nil {
    return fmt.Errorf("do something for user %d: %w", userID, err)
}

// ✅ 自定义错误 + 判断用 errors.Is/As
type NotFoundError struct {
    Entity string
    ID     int64
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s %d not found", e.Entity, e.ID)
}

var target *NotFoundError
if errors.As(err, &target) {
    // 处理 not found
}
```

**规则**：`%w` 包装保留错误链；`errors.Is` 判值，`errors.As` 判类型；禁止字符串匹配错误。

---

## 接口设计

```go
// ❌ 大而全的接口
type UserManager interface {
    Create(ctx context.Context, u User) error
    Update(ctx context.Context, u User) error
    Delete(ctx context.Context, id int64) error
    Find(ctx context.Context, id int64) (*User, error)
    List(ctx context.Context, filter Filter) ([]User, error)
    Export(ctx context.Context, w io.Writer) error
}

// ✅ 小接口，按消费方需求定义
type UserReader interface {
    Find(ctx context.Context, id int64) (*User, error)
}

type UserWriter interface {
    Create(ctx context.Context, u User) error
}
```

**规则**：接口在消费方定义，不在实现方；≤3 个方法；命名以 `er` 结尾。

---

## 并发（第二易错）

```go
// ❌ 裸启 goroutine + 闭包变量陷阱
for _, item := range items {
    go func() {
        process(item)  // 闭包捕获循环变量（Go <1.22）
    }()
}

// ✅ errgroup 管理 + 显式传参
g, ctx := errgroup.WithContext(ctx)
for _, item := range items {
    item := item  // Go <1.22 需要 shadow
    g.Go(func() error {
        return process(ctx, item)
    })
}
if err := g.Wait(); err != nil {
    return fmt.Errorf("batch process: %w", err)
}

// ✅ channel 明确方向，生产者负责 close
func produce(ctx context.Context) <-chan Event {
    ch := make(chan Event, 64)
    go func() {
        defer close(ch)  // 生产者关闭
        for {
            select {
            case <-ctx.Done():
                return
            case ch <- nextEvent():
            }
        }
    }()
    return ch
}
```

**规则**：goroutine 必须可取消（context）、可等待（errgroup/WaitGroup）、有 panic recovery。

---

## 函数签名模式

```go
// ✅ 标准签名：ctx 首参，error 末返回
func GetUser(ctx context.Context, id int64) (*User, error)

// ✅ Functional Options：配置复杂时
type ServerOption func(*Server)

func WithTimeout(d time.Duration) ServerOption {
    return func(s *Server) { s.timeout = d }
}

func WithLogger(l *slog.Logger) ServerOption {
    return func(s *Server) { s.logger = l }
}

func NewServer(addr string, opts ...ServerOption) *Server {
    s := &Server{addr: addr, timeout: 30 * time.Second}
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// ❌ 配置结构体字段全导出（无法区分零值和未设置）
type Config struct {
    Timeout  int    // 0 是超时还是未设置？
    LogLevel string // "" 是默认还是未设置？
}
```

---

## 结构体与方法

```go
// ✅ 字段按语义分组，tag 对齐
type User struct {
    ID        int64  `json:"id"        db:"id"`
    Name      string `json:"name"      db:"name"`
    Email     string `json:"email"     db:"email"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`

    // 内部状态不导出
    passwordHash string
}

// ✅ 值接收者：小结构体、无修改
func (u User) FullName() string { return u.FirstName + " " + u.LastName }

// ✅ 指针接收者：需要修改、大结构体
func (u *User) SetEmail(email string) { u.Email = email }

// ❌ 同一类型混用值/指针接收者（除非有明确理由）
```

---

## 性能惯用法

```go
// ✅ 切片预分配
users := make([]User, 0, len(ids))

// ✅ 字符串拼接用 Builder
var b strings.Builder
b.Grow(estimatedSize)
for _, s := range parts {
    b.WriteString(s)
}
result := b.String()

// ✅ 高频临时对象用 sync.Pool
var bufPool = sync.Pool{
    New: func() any { return new(bytes.Buffer) },
}

buf := bufPool.Get().(*bytes.Buffer)
buf.Reset()
defer bufPool.Put(buf)
```

---

## 自检清单

- [ ] 所有 error 已处理，用 `%w` 包装并携带上下文
- [ ] 接口 ≤3 方法，在消费方定义
- [ ] goroutine 有 context 取消 + errgroup 等待 + panic recovery
- [ ] channel 有方向标注，生产者负责 close
- [ ] 函数签名 ctx 首参 error 末返回，复杂配置用 Options 模式
- [ ] 同一类型不混用值/指针接收者
- [ ] 切片预分配，字符串用 Builder，高频对象用 Pool
- [ ] 闭包无循环变量捕获陷阱（Go <1.22）
~~~