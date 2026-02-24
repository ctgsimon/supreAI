// ==================== Pyodide 模块 ====================
import * as config from './config.js';
import { updateStatus } from './ui.js';
import { log } from './ui.js';

/**
 * 初始化 Pyodide 环境
 */
export async function initPyodide() {
    updateStatus('loading', window.t('pyodide.loading'));
    
    try {
        config.state.pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        
        // 加载 Agent SDK
        await config.state.pyodide.runPython(config.agentSDKCode);
        
        updateStatus('ready', window.t('status.ready'));
        document.getElementById('runBtn').disabled = false;
        log(window.t('pyodide.ready'), 'success');
        log(window.t('pyodide.hint'), 'info');
        log(window.t('pyodide.shortcuts') + '\n', 'info');
        
    } catch (err) {
        updateStatus('error', window.t('status.error'));
        log(window.t('pyodide.initError') + ': ' + err.message, 'error');
    }
}
