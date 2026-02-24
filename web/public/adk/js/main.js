// ==================== 主入口模块 ====================
import { init } from './init.js';
import { loadTemplate } from './templates.js';
import { runCode } from './code-execution.js';
import { clearOutput } from './ui.js';
import { switchTab, showApiConfig } from './ui.js';
import { saveApiKey } from './api-keys.js';

// 将函数暴露到全局，供HTML事件处理使用
window.loadTemplate = loadTemplate;
window.runCode = runCode;
window.clearOutput = clearOutput;
window.switchTab = switchTab;
window.showApiConfig = showApiConfig;
window.saveApiKey = saveApiKey;

// 启动应用
document.addEventListener('DOMContentLoaded', init);
