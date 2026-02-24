// ==================== 统计模块 ====================
import * as config from './config.js';

/**
 * 更新统计信息
 * @param {string} output - 输出文本
 */
export function updateStats(output) {
    // 简单的 token 估算（实际应该用 tokenizer）
    const words = output ? output.split(/\s+/).length : 0;
    const estimatedTokens = Math.round(words * 1.3);
    
    config.stats.outputTokens = estimatedTokens;
    config.stats.inputTokens = Math.round(window.editor.getValue().length / 4);
    config.stats.totalTokens = config.stats.inputTokens + config.stats.outputTokens;
    config.stats.sessionTokens += config.stats.totalTokens;
    
    // 费用估算（GPT-4o-mini 价格）
    const cost = (config.stats.inputTokens * 0.00015 + config.stats.outputTokens * 0.0006) / 1000;
    
    document.getElementById('inputTokens').textContent = config.stats.inputTokens;
    document.getElementById('outputTokens').textContent = config.stats.outputTokens;
    document.getElementById('totalTokens').textContent = config.stats.totalTokens;
    document.getElementById('sessionTokens').textContent = config.stats.sessionTokens;
    document.getElementById('estimatedCost').textContent = cost.toFixed(4);
    document.getElementById('responseTime').textContent = config.stats.responseTime;
}
