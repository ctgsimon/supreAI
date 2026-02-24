// ==================== UI 模块 ====================

/**
 * 更新状态指示器
 * @param {string} type - 状态类型：loading, ready, running, error
 * @param {string} text - 状态文本
 */
export function updateStatus(type, text) {
    const dot = document.getElementById('statusDot');
    const textEl = document.getElementById('statusText');
    
    dot.className = 'status-dot ' + type;
    textEl.textContent = text;
}

/**
 * 在输出区域添加日志消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型：success, info, warn, error
 */
export function log(message, type = '') {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.className = 'output-line' + (type ? ' output-' + type : '');
    div.textContent = message;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

/**
 * 清空输出区域
 */
export function clearOutput() {
    document.getElementById('output').innerHTML = '';
}

/**
 * 切换输出面板的标签页
 * @param {string} tabName - 标签页名称：output, config, stats
 */
export function switchTab(tabName) {
    document.querySelectorAll('.output-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === 'tab-' + tabName);
    });
}

/**
 * 显示 API 配置面板
 */
export function showApiConfig() {
    switchTab('config');
}
