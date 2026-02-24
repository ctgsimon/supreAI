// ==================== 国际化 (i18n) 模块 ====================

// 从 URL 参数获取语言
function getLangFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang');
}

const i18n = {
    // 当前语言 - 优先从 URL 参数获取，默认中文
    currentLang: getLangFromUrl() || 'zh',

    // 翻译数据
    translations: {
        'zh': {
            // 页面标题
            'page.title': '🤖 CTG AIHub Agent SDK Playground',

            // 顶部导航
            'header.logo': 'CTG AIHub Agent SDK Playground',
            'header.model.openai': 'OpenAI',
            'header.model.anthropic': 'Anthropic',
            'header.model.domestic': '国产模型',
            'header.model.gpt4o': 'GPT-4o',
            'header.model.gpt4o-mini': 'GPT-4o-mini',
            'header.model.gpt35': 'GPT-3.5-turbo',
            'header.model.claude-sonnet': 'Claude 3.5 Sonnet',
            'header.model.claude-haiku': 'Claude 3 Haiku',
            'header.model.qwen': '通义千问 Plus',
            'header.model.glm': '智谱 GLM-4',
            'header.model.deepseek': 'DeepSeek Chat',
            'header.status.init': '初始化中...',
            'header.status.ready': '就绪',
            'header.status.error': '错误',
            'header.apiConfig': '🔑 API 设置',
            'header.run': '▶ 运行',
            'header.stop': '⏹ 停止',

            // 左侧边栏
            'sidebar.templates': '📚 代码模板',

            // 编辑器
            'editor.tab': 'main.py',
            'editor.cursorPos': '行 {line}, 列 {col}',

            // 右侧面板 Tab
            'tab.output': '📤 输出',
            'tab.config': '⚙️ 配置',
            'tab.stats': '📊 统计',

            // 输出面板
            'output.waiting': '等待运行代码...',
            'output.running': '运行中...',
            'output.success': '运行成功',
            'output.error': '运行出错',
            'shortcut.run': '运行代码',
            'shortcut.stop': '停止运行',
            'shortcut.clear': '清空输出',

            // 配置面板
            'config.openaiKey': 'OpenAI API Key',
            'config.anthropicKey': 'Anthropic API Key',
            'config.domesticKey': '国产模型 API Key',
            'config.status.configured': '已配置',
            'config.status.notConfigured': '未配置',
            'config.temperature': 'Temperature',
            'config.maxTokens': 'Max Tokens',
            'config.topP': 'Top P',
            'config.streamMode': '启用流式输出 (Streaming)',

            // 统计面板
            'stats.tokens.title': '本次对话 Token',
            'stats.tokens.input': '输入',
            'stats.tokens.output': '输出',
            'stats.cost.title': '预估费用',
            'stats.time.title': '响应时间',
            'stats.session.title': '累计使用',
            'stats.session.subtitle': '本次会话累计 Token',

            // Pyodide 模块
            'pyodide.loading': '加载 Python 环境...',
            'pyodide.ready': '✅ Python 环境已就绪',
            'pyodide.hint': '💡 选择左侧模板开始体验，或直接编写代码',
            'pyodide.shortcuts': '⌨️ 快捷键: Ctrl+Enter 运行 | Ctrl+L 清空输出',
            'pyodide.initError': '❌ 初始化失败',

            // 代码执行模块
            'execution.running': '⏳ 运行中...',
            'execution.runBtn': '▶️ 运行',
            'execution.complete': '(代码执行完成)',
            'execution.errorPrefix': '❌ 错误',
            'execution.stopped': '已停止',
            'execution.stopMsg': '⏹️ 代码执行已停止',
            'execution.warningPrefix': '⚠️',

            // 状态
            'status.loading': '加载中...',
            'status.ready': '就绪',
            'status.running': '运行中',
            'status.error': '错误',
            'status.completed': '完成',
            'status.stopped': '已停止',

            // 代码模板
            'template.basicChat.title': '💬 基础对话',
            'template.basicChat.desc': '最简单的 LLM 调用示例',
            'template.streamChat.title': '🌊 流式输出',
            'template.streamChat.desc': '实时流式获取 LLM 响应',
            'template.multiTurn.title': '🔄 多轮对话',
            'template.multiTurn.desc': '带上下文的连续对话',
            'template.systemPrompt.title': '📋 系统提示词',
            'template.systemPrompt.desc': '自定义 AI 角色和行为',
            'template.agentMCP.title': '🤖 智能体 MCP 调用',
            'template.agentMCP.desc': '使用智能体调用 MCP 服务',
            'template.agentSkill.title': '🤖 智能体技能',
            'template.agentSkill.desc': '使用智能体调用自定义技能',
            'template.functionCall.title': '🔧 函数调用',
            'template.functionCall.desc': 'LLM 调用自定义函数',
            'template.rag.title': '📚 RAG 检索增强',
            'template.rag.desc': '基于知识库的问答',
            'template.claude.title': '🎭 Claude 模型',
            'template.claude.desc': '使用 Anthropic Claude',
            'template.qwen.title': '🇨🇳 通义千问',
            'template.qwen.desc': '使用阿里云通义千问',
            'template.parallel.title': '⚡ 并行调用',
            'template.parallel.desc': '同时调用多个模型',
            'template.json.title': '📦 JSON 输出',
            'template.json.desc': '让 LLM 输出结构化 JSON',
            'template.http.title': '🌐 HTTP POST 请求',
            'template.http.desc': '使用 LLM 发送 HTTP POST 请求',
        },
        en: {
            // Page Title
            'page.title': '🤖 CTG AIHub Agent SDK Playground',

            // Header
            'header.logo': 'LLM Agent SDK Playground',
            'header.model.openai': 'OpenAI',
            'header.model.anthropic': 'Anthropic',
            'header.model.domestic': 'Domestic Models',
            'header.model.gpt4o': 'GPT-4o',
            'header.model.gpt4o-mini': 'GPT-4o-mini',
            'header.model.gpt35': 'GPT-3.5-turbo',
            'header.model.claude-sonnet': 'Claude 3.5 Sonnet',
            'header.model.claude-haiku': 'Claude 3 Haiku',
            'header.model.qwen': 'Qwen Plus',
            'header.model.glm': 'Zhipu GLM-4',
            'header.model.deepseek': 'DeepSeek Chat',
            'header.status.init': 'Initializing...',
            'header.status.ready': 'Ready',
            'header.status.error': 'Error',
            'header.apiConfig': '🔑 API Settings',
            'header.run': '▶ Run',
            'header.stop': '⏹ Stop',

            // Sidebar
            'sidebar.templates': '📚 Code Templates',

            // Editor
            'editor.tab': 'main.py',
            'editor.cursorPos': 'Line {line}, Col {col}',

            // Right Panel Tabs
            'tab.output': '📤 Output',
            'tab.config': '⚙️ Config',
            'tab.stats': '📊 Stats',

            // Output Panel
            'output.waiting': 'Waiting to run code...',
            'output.running': 'Running...',
            'output.success': 'Success',
            'output.error': 'Error',
            'shortcut.run': 'Run Code',
            'shortcut.stop': 'Stop',
            'shortcut.clear': 'Clear Output',

            // Config Panel
            'config.openaiKey': 'OpenAI API Key',
            'config.anthropicKey': 'Anthropic API Key',
            'config.domesticKey': 'Domestic Models API Key',
            'config.status.configured': 'Configured',
            'config.status.notConfigured': 'Not Configured',
            'config.temperature': 'Temperature',
            'config.maxTokens': 'Max Tokens',
            'config.topP': 'Top P',
            'config.streamMode': 'Enable Streaming Output',

            // Stats Panel
            'stats.tokens.title': 'Tokens This Conversation',
            'stats.tokens.input': 'Input',
            'stats.tokens.output': 'Output',
            'stats.cost.title': 'Estimated Cost',
            'stats.time.title': 'Response Time',
            'stats.session.title': 'Total Usage',
            'stats.session.subtitle': 'Session Total Tokens',

            // Pyodide Module
            'pyodide.loading': 'Loading Python environment...',
            'pyodide.ready': '✅ Python environment ready',
            'pyodide.hint': '💡 Select a template from the left or write code directly',
            'pyodide.shortcuts': '⌨️ Shortcuts: Ctrl+Enter to run | Ctrl+L to clear output',
            'pyodide.initError': '❌ Initialization failed',

            // Code Execution Module
            'execution.running': '⏳ Running...',
            'execution.runBtn': '▶️ Run',
            'execution.complete': '(Code execution completed)',
            'execution.errorPrefix': '❌ Error',
            'execution.stopped': 'Stopped',
            'execution.stopMsg': '⏹️ Code execution stopped',
            'execution.warningPrefix': '⚠️',

            // Status
            'status.loading': 'Loading...',
            'status.ready': 'Ready',
            'status.running': 'Running',
            'status.error': 'Error',
            'status.completed': 'Completed',
            'status.stopped': 'Stopped',

            // Code Templates
            'template.basicChat.title': '💬 Basic Chat',
            'template.basicChat.desc': 'Simplest LLM call example',
            'template.streamChat.title': '🌊 Streaming',
            'template.streamChat.desc': 'Real-time streaming LLM response',
            'template.multiTurn.title': '🔄 Multi-turn',
            'template.multiTurn.desc': 'Continuous conversation with context',
            'template.systemPrompt.title': '📋 System Prompt',
            'template.systemPrompt.desc': 'Customize AI role and behavior',
            'template.functionCall.title': '🔧 Function Call',
            'template.functionCall.desc': 'LLM calls custom functions',
            'template.rag.title': '📚 RAG',
            'template.rag.desc': 'Knowledge-based Q&A',
            'template.claude.title': '🎭 Claude Model',
            'template.claude.desc': 'Use Anthropic Claude',
            'template.qwen.title': '🇨🇳 Qwen',
            'template.qwen.desc': 'Use Alibaba Qwen',
            'template.parallel.title': '⚡ Parallel Calls',
            'template.parallel.desc': 'Call multiple models simultaneously',
            'template.json.title': '📦 JSON Output',
            'template.json.desc': 'Let LLM output structured JSON',
            'template.http.title': '🌐 HTTP POST Request',
            'template.http.desc': 'Use LLM to send HTTP POST request',
        }
    },

    // 获取翻译
    t(key, params = {}) {
        const translation = this.translations[this.currentLang]?.[key] || key;
        return translation.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
    },

    // 更新页面文本
    updatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                // 检查是否有动态参数
                const params = {};
                if (el.hasAttribute('data-i18n-line')) {
                    params.line = el.getAttribute('data-i18n-line');
                }
                if (el.hasAttribute('data-i18n-col')) {
                    params.col = el.getAttribute('data-i18n-col');
                }
                el.textContent = this.t(key, params);
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.placeholder = this.t(key);
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) {
                el.title = this.t(key);
            }
        });

        // 更新 optgroup 和 option 标签
        document.querySelectorAll('optgroup[data-i18n-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-label');
            if (key) {
                el.label = this.t(key);
            }
        });
    },

    // 初始化
    init() {
        this.updatePage();
    }
};

// 全局访问
window.i18n = i18n;
window.t = (key, params) => i18n.t(key, params);

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
