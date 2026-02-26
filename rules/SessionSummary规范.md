~~~Markdown
# Session Summary 规范

> 将开发对话沉淀为团队共享上下文，确保知识可追溯、可搜索、可复用。

---

## 触发条件

满足以下**任一**条件时，必须生成 Session Summary：

- 对话产出了实际变更（代码 / 配置 / 架构决策）
- 踩了坑并找到了解决方案（其他人大概率会遇到同样问题）
- 做了重要的技术选型或方案取舍

**不需要生成的情况**：纯问答、简单格式调整、无结论的探索性讨论。

---

## 存储

- **路径**：`docs/team_context/sessions/YYYY-MM/`
- **文件名**：`YYYY-MM-DD_HHMMSS_{成员}_{主题}.md`
- **成员名**：从 `git config user.name` 获取，小写 + 下划线
- **示例**：`2025-01-04_142059_alice_chen_directory_organization.md`

---

## 内容模板

```markdown
# Session Summary - {主题}

- **时间**: {起止时间, UTC}
- **参与者**: {姓名} ({邮箱})
- **标签**: #{技术栈} #{问题类型}
- **价值等级**: 🟢高 / 🟡中 / 🔴低

## 问题
{一句话描述遇到了什么问题、要解决什么需求}

## 方案
{采取了什么方案，为什么选这个方案}
{如果有关键代码片段，最多贴 10 行核心逻辑}

## 关键结论
{可直接复用的经验、踩坑点、最佳实践}
{其他人遇到类似问题时需要知道的核心信息}

## 放弃的方案（可选）
{尝试过但放弃的方案及原因，避免团队重复踩坑}

## 关联
{相关的 ADR / 知识库条目 / Issue 链接}
```

---

## 写作标准

### 核心原则：写给下一个遇到同样问题的人

这个人不了解你的对话过程，只想快速知道：**问题是什么、怎么解决的、有什么注意事项**。

### 好的 Summary

> **问题**: 升级 Pydantic v2 后，`datetime` 字段的 JSON 序列化格式从 ISO 8601 变为带时区的格式，导致前端解析失败。
>
> **方案**: 在 model_config 中配置 `json_encoders` 保持原格式。选择全局配置而非逐字段修改，因为项目中有 40+ 个包含时间字段的 model。
>
> **关键结论**: Pydantic v2 迁移时必须检查所有序列化行为的变更，不能只关注 API 兼容性。官方迁移指南遗漏了这个 breaking change。

### 差的 Summary

> 今天处理了 Pydantic 升级问题。修改了 `models/user.py`、`models/order.py`、`models/product.py` 等 15 个文件。每个文件都添加了 `model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})`。运行了 342 个测试，全部通过，耗时 45 秒。

**区别**：好的 summary 写结论和判断依据；差的 summary 罗列操作过程和机械细节。

### 禁止

- ❌ 罗列所有修改的文件名、函数名
- ❌ 贴超过 10 行的代码块或完整配置
- ❌ 写 CI 日志、测试数量、执行时长
- ❌ 记录对话过程（"我先试了 A，然后又试了 B"）

---

## 提交

```bash
git add docs/team_context/sessions/
git commit -m "docs: add session summary - {主题}"
```
~~~