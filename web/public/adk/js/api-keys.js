// ==================== API Key 管理模块 ====================
import * as config from './config.js';

/**
 * 保存 API 密钥到 localStorage
 * @param {string} provider - 提供者名称：openai, anthropic, domestic
 */
export function saveApiKey(provider) {
    const inputId = provider === 'openai' ? 'openaiKey' : 
                   (provider === 'anthropic' ? 'anthropicKey' : 'domesticKey');
    const statusId = provider === 'openai' ? 'openaiStatus' : 
                    (provider === 'anthropic' ? 'anthropicStatus' : 'domesticStatus');
    
    const key = document.getElementById(inputId).value;
    
    if (key) {
        localStorage.setItem(provider + '_key', key);
        config.apiKeys[provider] = key;
        document.getElementById(statusId).textContent = '✓ 已配置';
        document.getElementById(statusId).style.color = 'var(--accent-green)';
    }
}

/**
 * 从 localStorage 加载 API 密钥
 */
export function loadApiKeys() {
    ['openai', 'anthropic', 'domestic'].forEach(provider => {
        const key = localStorage.getItem(provider + '_key');
        if (key) {
            config.apiKeys[provider] = key;
            const inputId = provider === 'openai' ? 'openaiKey' : 
                           (provider === 'anthropic' ? 'anthropicKey' : 'domesticKey');
            const statusId = provider === 'openai' ? 'openaiStatus' : 
                            (provider === 'anthropic' ? 'anthropicStatus' : 'domesticStatus');
            
            document.getElementById(inputId).value = key;
            document.getElementById(statusId).textContent = '✓ 已配置';
            document.getElementById(statusId).style.color = 'var(--accent-green)';
        }
    });
}