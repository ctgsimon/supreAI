// ==================== 编辑器模块 ====================
import * as config from './config.js';
import { runCode } from './code-execution.js';
import { clearOutput } from './ui.js';

/**
 * 初始化 Monaco Editor
 */
export function initMonaco() {
    require.config({ 
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } 
    });
    
    require(['vs/editor/editor.main'], function() {
        // 自定义主题
        monaco.editor.defineTheme('agent-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6a9955' },
                { token: 'string', foreground: 'ce9178' },
                { token: 'keyword', foreground: 'c586c0' },
                { token: 'number', foreground: 'b5cea8' },
            ],
            colors: {
                'editor.background': '#0d1117',
                'editor.foreground': '#e6edf3',
                'editorLineNumber.foreground': '#6e7681',
                'editorCursor.foreground': '#58a6ff',
                'editor.selectionBackground': '#264f78',
            }
        });
        
        window.editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: config.templates[0].code,
            language: 'python',
            theme: 'agent-dark',
            fontSize: 14,
            fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            suggest: {
                showKeywords: true,
                showSnippets: true,
            }
        });
        
        // 快捷键
        window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
        window.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL, clearOutput);
        
        // 光标位置
        window.editor.onDidChangeCursorPosition((e) => {
            document.getElementById('cursorPos').textContent = 
                window.t('editor.cursorPos', { line: e.position.lineNumber, col: e.position.column });
        });
        
        // 注册自动补全
        registerCompletions();
    });
}

/**
 * 注册自动补全功能
 */
export function registerCompletions() {
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: () => {
            const suggestions = [
                {
                    label: 'from agent_sdk import',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'from agent_sdk import LLM, Agent, Tool',
                    documentation: '导入 Agent SDK 核心组件'
                },
                {
                    label: 'LLM',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'LLM(model="${1:gpt-4o-mini}")',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: '创建 LLM 客户端'
                },
                {
                    label: 'llm.chat',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'llm.chat("${1:message}")',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: '发送消息获取回复'
                },
                {
                    label: 'llm.stream',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'for chunk in llm.stream("${1:message}"):\n    print(chunk, end="")',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: '流式获取回复'
                },
                {
                    label: 'Agent',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'Agent(model="${1:gpt-4o-mini}")',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: '创建智能代理'
                },
                {
                    label: 'Tool',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'Tool("${1:name}", ${2:func}, "${3:description}")',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: '定义工具'
                },
                {
                    label: 'Conversation',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'Conversation(model="${1:gpt-4o-mini}")',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: '创建多轮对话'
                },
            ];
            return { suggestions };
        }
    });
}