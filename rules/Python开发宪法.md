~~~Markdown
# Python 开发宪法

---

## 🧭 核心原则

> **冲突裁决优先级**：类型安全 > 安全 > 模块化 > 可读性 > 微优化

1. **模块化优先**：单一职责，单模块≤300行，核心逻辑与平台调用严格隔离
2. **Pythonic**：遵循 PEP 8，简洁可读，"There should be one obvious way to do it"
3. **类型安全（不可协商）**：全量 Type Hints，`mypy --strict` 必须通过，禁止 `Any`（需注释理由除外）
4. **测试驱动**：pytest 为主，核心模块覆盖率≥90%，整体≥80%
5. **文档即代码**：公共 API 必有 docstring（Google 风格），参数/返回/异常全标注

---

## 📁 项目结构

```
src/
├── core/              # 100% 纯 Python 复用：业务逻辑/算法/数据模型
├── platform/          # 平台适配层（依赖注入实现）
│   ├── interface.py   # 抽象基类定义（ABC）
│   ├── desktop/       # PyQt / Tkinter / Flet
│   └── mobile/        # Kivy / BeeWare
├── services/          # 外部服务封装（API/数据库/缓存）
├── config/            # 配置加载（按环境/平台差异化）
└── tests/
    ├── core/          # 核心逻辑测试（全平台通用）
    └── platform/      # 平台适配层测试（按环境隔离）
```

---

## ⚙️ 技术要求

### 基础
- Python 3.11+，开发时启用 `python -X dev`
- 依赖管理：Poetry（`poetry.lock` 提交），禁止全局包污染
- 格式化：`black` + `ruff`（CI 强制），行宽 88
- 类型检查：`mypy --strict` 全量通过

### 平台隔离（核心规则）

```python
# ❌ 禁止：核心逻辑耦合平台判断
def save_data(data):
    if sys.platform == 'android':
        path = "/sdcard/data.json"
    else:
        path = os.path.expanduser("~/data.json")
    with open(path, 'w') as f:
        json.dump(data, f)

# ✅ 要求：抽象接口 + 依赖注入
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def save(self, key: str, data: dict[str, Any]) -> None: ...
    @abstractmethod
    def load(self, key: str) -> dict[str, Any] | None: ...

class AndroidStorage(Storage):
    def save(self, key: str, data: dict[str, Any]) -> None:
        # Android 特定实现
        ...

# 核心逻辑只依赖接口，不知道平台存在
def process_and_save(storage: Storage, data: dict[str, Any]) -> None:
    result = transform(data)  # 纯业务逻辑
    storage.save("result", result)
```

### 资源与性能

```python
# ❌ 禁止：一次性加载全部（移动端内存爆炸）
def load_all_images() -> list[Image]:
    return [load_image(p) for p in all_paths]

# ✅ 要求：生成器 + 分批处理
def load_images(
    paths: Sequence[Path], batch_size: int = 10
) -> Iterator[list[Image]]:
    for i in range(0, len(paths), batch_size):
        yield [load_image(p) for p in paths[i : i + batch_size]]
```

| 约束项 | 移动端 | 桌面端 |
|--------|--------|--------|
| 冷启动 | ≤3s | ≤2s |
| 内存上限 | ≤150MB | ≤500MB |
| 包体积 | ≤50MB | 无硬性限制 |

### 异常处理

```python
# ❌ 禁止：裸 except / 吞异常
try:
    do_something()
except:        # 捕获一切，包括 KeyboardInterrupt
    pass       # 静默吞掉

# ✅ 要求：精确捕获 + 上下文管理
try:
    result = parse_config(path)
except FileNotFoundError:
    logger.warning("配置文件不存在，使用默认值", extra={"path": str(path)})
    result = DEFAULT_CONFIG
except ValidationError as e:
    logger.error("配置校验失败", exc_info=e)
    raise AppConfigError(f"无效配置: {path}") from e
```

### 安全
- 禁止硬编码密钥/密码/路径，从环境变量或安全存储读取
- 外部输入一律校验（Pydantic model 验证）
- 资源操作必须 `with` 上下文管理器，禁止手动 open/close
- 生产环境禁止 `print()`，使用结构化日志（`structlog` / `logging`）
- 日志必须包含 `trace_id` + `platform` 字段，敏感信息脱敏

### 日志规范

```python
# ❌ 禁止
print(f"用户 {user.password} 登录")  # print + 敏感信息

# ✅ 要求
logger.info(
    "用户登录",
    extra={"user_id": user.id, "platform": platform.name}  # 脱敏 + 结构化
)
```

---

## 🚫 更多反模式

```python
# ❌ 可变默认参数（经典陷阱）
def add_item(item: str, items: list[str] = []) -> list[str]:
    items.append(item)
    return items

# ✅ 不可变默认值
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items

# ❌ 手动拼接 SQL / 命令
query = f"SELECT * FROM users WHERE name = '{name}'"

# ✅ 参数化查询
cursor.execute("SELECT * FROM users WHERE name = ?", (name,))

# ❌ 忽略返回值类型
def get_user(user_id):  # 无类型注解
    ...

# ✅ 完整类型签名
def get_user(user_id: int) -> User | None:
    """根据 ID 获取用户。

    Args:
        user_id: 用户唯一标识。

    Returns:
        对应的用户对象，不存在时返回 None。

    Raises:
        DatabaseError: 数据库连接失败时抛出。
    """
    ...
```

---

## 🧪 测试要求

```bash
# 核心逻辑：全平台通用
pytest tests/core/ --cov=src/core --cov-fail-under=90

# 平台适配：按环境标记
pytest tests/platform/desktop/ -m desktop
pytest tests/platform/mobile/ -m mobile
```

- **测行为不测实现**：验证输入→输出，不测内部调用顺序
- **每个 Bug 修复附带回归测试**
- **Mock 最小化**：只 mock 外部依赖（网络/文件系统/数据库），不 mock 内部模块
- **fixtures 复用**：通过 `conftest.py` 共享，禁止测试间复制粘贴

---

## ✅ 生成代码自检清单

每次输出代码前，逐项确认：

- [ ] 核心逻辑无 `sys.platform` / `os.name` 判断，平台差异通过 ABC + 依赖注入隔离
- [ ] 全量类型注解，`mypy --strict` 可通过，无 `Any`
- [ ] 公共函数/类有 Google 风格 docstring（Args/Returns/Raises）
- [ ] 异常精确捕获，无裸 `except`，无静默 `pass`
- [ ] 资源操作用 `with`，无文件/连接泄漏
- [ ] 无硬编码路径/密钥/配置，敏感信息从安全存储读取
- [ ] 无 `print()`，使用结构化日志，敏感数据已脱敏
- [ ] 大数据集用生成器/分批处理，符合平台内存约束
- [ ] 外部输入已校验（Pydantic），SQL/命令参数化，无注入风险
- [ ] 默认参数不可变（无 `list` / `dict` / `set` 默认值）
- [ ] 附带对应测试，核心逻辑覆盖率≥90%
- [ ] 向后兼容，破坏性变更需明确标注
~~~