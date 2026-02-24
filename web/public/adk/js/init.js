// ==================== 初始化模块 ====================
import * as config from './config.js';
import { renderTemplates } from './templates.js';
import { initMonaco } from './editor.js';
import { initPyodide } from './pyodide.js';
import { loadApiKeys } from './api-keys.js';

/**
 * 初始化应用程序
 */
export async function init() {
    // 先加载 Agent SDK 代码
    await config.loadAgentSDKCode();
    
    renderTemplates();
    initMonaco();
    await initPyodide();
    loadApiKeys();
}