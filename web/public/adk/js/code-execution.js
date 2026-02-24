// ==================== 代码执行模块 ====================
import * as config from './config.js';
import { updateStatus } from './ui.js';
import { log } from './ui.js';
import { clearOutput } from './ui.js';
import { updateStats } from './stats.js';

/**
 * 运行编辑器中的代码
 */
export async function runCode() {
    if (!config.state.pyodide || !window.editor || config.state.isRunning) return;
    
    const code = window.editor.getValue();
    config.state.isRunning = true;
    
    document.getElementById('runBtn').disabled = true;
    document.getElementById('runBtn').innerHTML = window.t('execution.running');
    updateStatus('running', window.t('status.running'));
    clearOutput();
    
    const startTime = performance.now();
    
    try {
        // 自动加载依赖
        await config.state.pyodide.loadPackagesFromImports(code);
        
        // 保存原始输出
        const originalStdout = config.state.pyodide.globals.get('sys').stdout;
        const originalStderr = config.state.pyodide.globals.get('sys').stderr;
        
        // 初始化输出变量
        let stdout = '';
        let stderr = '';
        
        // 在JavaScript中定义输出回调函数
        const outputCallback = (text) => {
            // console.log(text,window.streamOut)
            // 实时显示输出
            if(window.streamOut === 'true') {
                doStreamOut(text);
            }else{
                log(text);
            }
        };
        
        // 直接将JavaScript函数暴露给Python全局命名空间
        // Pyodide v0.24.1会自动处理转换
        config.state.pyodide.globals.set('js_output_callback', outputCallback);
        
        // 创建自定义输出流类并设置输出重定向
        await config.state.pyodide.runPython(`
import sys
from io import StringIO

# 自定义输出流类
class OutputStream:
    def __init__(self):
        self.buffer = StringIO()
    
    def write(self, text):
        # 保存到缓冲区
        self.buffer.write(text)
        # 实时传递到JavaScript
        js_output_callback(text)
    
    def flush(self):
        self.buffer.flush()
    
    def getvalue(self):
        return self.buffer.getvalue()

# 创建输出流实例
stdout_stream = OutputStream()
stderr_stream = OutputStream()

# 设置重定向
sys.stdout = stdout_stream
sys.stderr = stderr_stream
`);
        
        try {
            // 执行代码
            await config.state.pyodide.runPythonAsync(code);
        } finally {
            // 获取完整输出（用于统计和其他处理）
            try {
                stdout = config.state.pyodide.globals.get('stdout_stream').getvalue();
                stderr = config.state.pyodide.globals.get('stderr_stream').getvalue();
            } catch (e) {
                // 如果获取输出失败，忽略错误
            }
            
            // 恢复原始输出
            config.state.pyodide.globals.get('sys').stdout = originalStdout;
            config.state.pyodide.globals.get('sys').stderr = originalStderr;
            
            // 清理Python中的全局变量
            try {
                config.state.pyodide.globals.delete('stdout_stream');
                config.state.pyodide.globals.delete('stderr_stream');
                config.state.pyodide.globals.delete('js_output_callback');
            } catch (e) {
                // 如果清理失败，忽略错误
            }
        }
        
        // 注意：实时输出已经在write方法中处理，这里不再重复显示
        // 只处理需要特殊处理的输出（如模拟流式输出）
        if (stdout) {
            // 检测是否有流式输出标记
            if (stdout.includes('🤖 AI:') || stdout.includes('chunk')) {
                // 清除之前的实时输出
                // clearOutput();
                // 模拟流式输出
                // simulateStreaming(stdout);
            }
        }
        
        // 更新统计
        config.stats.responseTime = Math.round(performance.now() - startTime);
        updateStats(stdout);
        
        updateStatus('ready', window.t('status.completed'));
        
    } catch (err) {
        log(window.t('execution.errorPrefix') + ': ' + err.message, 'error');
        updateStatus('error', window.t('status.error'));
    } finally {
        config.state.isRunning = false;
        document.getElementById('runBtn').disabled = false;
        document.getElementById('runBtn').innerHTML = window.t('execution.runBtn');
    }
}


function doStreamOut(value) {
    const output = document.getElementById('output');
    output.innerHTML += `<span class="output-llm">${value}</span>`;
}

/**
 * 模拟流式输出
 * @param {string} text - 要显示的文本
 */
function simulateStreaming(text) {
    const output = document.getElementById('output');
    output.innerHTML = '';
    
    const lines = text.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    
    function typeChar() {
        if (lineIndex >= lines.length) return;
        
        const line = lines[lineIndex];
        if (charIndex < line.length) {
            // 移除末尾的光标
            output.innerHTML = output.innerHTML.replace(/<span class="streaming-cursor"><\/span>$/, '');
            
            // 检测是否是 LLM 输出行
            let isLLMLine = line.includes('🤖') || (lineIndex > 0 && lines[lineIndex-1].includes('🤖'));
            const className = isLLMLine ? 'output-llm' : '';
            
            output.innerHTML += `<span class="${className}">${line[charIndex]}</span>`;
            output.innerHTML += '<span class="streaming-cursor"></span>';
            
            charIndex++;
            output.scrollTop = output.scrollHeight;
            
            // 调整速度
            const delay = Math.random() * 15 + 10;
            setTimeout(typeChar, delay);
        } else {
            // 移除末尾的光标
            output.innerHTML = output.innerHTML.replace(/<span class="streaming-cursor"><\/span>$/, '');
            output.innerHTML += '\n';
            lineIndex++;
            charIndex = 0;
            setTimeout(typeChar, 25);
        }
    }
    
    typeChar();
}

/**
 * 停止代码执行
 */
export function stopCode() {
    if (config.state.abortController) {
        config.state.abortController.abort();
        config.state.abortController = null;
    }
    
    config.state.isRunning = false;
    document.getElementById('runBtn').disabled = false;
    document.getElementById('runBtn').innerHTML = window.t('execution.runBtn');
    updateStatus('ready', window.t('execution.stopped'));
    log(window.t('execution.stopMsg'), 'info');
}

/**
 * 初始化代码执行环境
 */
export async function initCodeExecution() {
    // 初始化时加载Agent SDK模拟代码
    if (config.state.pyodide) {
        await config.state.pyodide.runPythonAsync(config.agentSDKCode);
    }
}