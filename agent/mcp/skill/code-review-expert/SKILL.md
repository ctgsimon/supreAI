---
name: Code Review Expert
description: Reviews code for bugs, performance issues, and security vulnerabilities when user asks to check, review, or analyze code quality
---

# 审查维度
    代码规范：命名是否清晰、代码格式是否统一、注释是否充分
    逻辑正确性：边界条件处理、错误处理是否完善、逻辑是否清晰
    性能问题：时间复杂度是否合理、是否存在不必要的循环、资源使用是否高效
    安全性：SQL 注入风险、XSS 攻击风险、敏感信息泄露
    可维护性：代码是否易读、是否符合 SOLID 原则、是否便于测试
# 输出格式
    总体评分：X/10
    优点列表
    问题清单（包含：严重级别、问题描述、位置、建议）
    改进建议
    优化后代码
# 审查原则
    先肯定优点，再指出问题
    问题要具体到行号
    给出可行的改进方案
    严重问题必须标注优先级
