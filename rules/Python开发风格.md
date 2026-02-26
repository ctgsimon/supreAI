~~~Markdown
# Python 代码风格规范

---

## 类型注解

全量显式标注，`mypy --strict` 必须通过。

```python
# ❌
def get_user(user_id): ...
def process(data: Any) -> Any: ...

# ✅
def get_user(user_id: int) -> User | None: ...

# 泛型必须加约束
T = TypeVar("T", bound="BaseEntity")

# 回调/复杂类型提取别名
Handler: TypeAlias = Callable[[Request], Response]
```

---

## 数据结构选型

这是 AI 最常选错的地方。

| 场景 | 选择 | 关键点 |
|------|------|--------|
| 内部数据结构 | `@dataclass(frozen=True, slots=True)` | 默认不可变 |
| 轻量不可变记录 | `NamedTuple` | 可解包、可哈希 |
| JSON/dict 类型提示 | `TypedDict` | 不改变运行时行为 |
| 外部输入校验 | Pydantic `BaseModel` | 运行时校验 + 序列化 |

```python
# ❌ 内部数据用 Pydantic（过重）/ 外部输入用 dataclass（无校验）
class Point(BaseModel):  # 过重
    x: float
    y: float

@dataclass
class ApiInput:  # 无运行时校验
    email: str

# ✅
@dataclass(frozen=True, slots=True)
class Point:
    x: float
    y: float

class ApiInput(BaseModel):
    email: EmailStr = Field(min_length=1)
```

---

## 接口抽象：Protocol vs ABC

```python
# ✅ Protocol：鸭子类型，不需要继承关系
class Serializable(Protocol):
    def to_dict(self) -> dict[str, object]: ...

# ✅ ABC：强制契约 + 需要默认实现
class BaseRepository(ABC):
    @abstractmethod
    def find_by_id(self, entity_id: int) -> object | None: ...

    def exists(self, entity_id: int) -> bool:  # 默认实现
        return self.find_by_id(entity_id) is not None
```

**选型规则**：第三方代码/鸭子类型 → Protocol；强制继承 + 有默认实现 → ABC。

---

## 函数设计（易错点）

```python
# ❌ 可变默认参数（经典陷阱）
def add_item(item: str, items: list[str] = []) -> list[str]: ...

# ✅
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items

# ✅ ≥3 参数用 * 强制关键字
def create_user(*, name: str, email: str, role: UserRole = UserRole.MEMBER) -> User: ...
```

---

## Pythonic 惯用法

```python
# 推导式 ≤2 层，超过改用函数
names = [u.name for u in users if u.is_active]

# 大数据用生成器，不用列表
def parse_lines(path: Path) -> Iterator[Record]:
    with open(path) as f:
        for line in f:
            yield parse_line(line)

# 多行字符串用括号续行
query = (
    "SELECT id, name "
    "FROM users "
    "WHERE active = true"
)

# 上下文管理器（简单场景）
@contextmanager
def managed_connection(url: str) -> Iterator[Connection]:
    conn = Connection(url)
    try:
        yield conn
    finally:
        conn.close()
```

---

## 装饰器（必须保留类型签名）

```python
from functools import wraps
from typing import Callable, ParamSpec, TypeVar

P = ParamSpec("P")
R = TypeVar("R")

def retry(max_attempts: int = 3) -> Callable[[Callable[P, R]], Callable[P, R]]:
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
            raise RuntimeError("unreachable")
        return wrapper
    return decorator
```

---

## 异步代码

```python
# ✅ 并发必须限制并发度
async def fetch_all(user_ids: list[int]) -> list[User]:
    sem = asyncio.Semaphore(10)
    async def _fetch(uid: int) -> User:
        async with sem:
            return await fetch_user(client, uid)
    return await asyncio.gather(*[_fetch(uid) for uid in user_ids])

# ❌ 禁止在异步上下文中嵌套 asyncio.run()
```

---

## 自检清单

- [ ] 全量类型注解，无 `Any`，`mypy --strict` 通过
- [ ] 数据结构选型正确（内部 dataclass / 外部 Pydantic）
- [ ] 接口用 Protocol 或 ABC，选型有依据
- [ ] 无可变默认参数，≥3 参数强制关键字
- [ ] 装饰器保留 `@wraps` + `ParamSpec` 类型
- [ ] 大数据用生成器，推导式 ≤2 层
- [ ] 异步并发有 Semaphore 限制，不混用 sync/async
- [ ] 公共模块定义 `__all__`
~~~