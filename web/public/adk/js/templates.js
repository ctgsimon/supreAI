// ==================== 模板管理模块 ====================
import { templates } from './config.js';

/**
 * 渲染模板列表到页面
 */
export function renderTemplates() {
    const container = document.getElementById('templateList');
    container.innerHTML = templates.map((t, index) => `
        <div class="template-item ${index === 0 ? 'active' : ''}" 
             onclick="loadTemplate('${t.id}')" data-id="${t.id}">
            <div class="title">${window.t(t.titleKey)}</div>
            <div class="desc">${window.t(t.descKey)}</div>
            <span class="tag tag-${t.tag}">${t.tag}</span>
        </div>
    `).join('');
}

/**
 * 加载指定ID的模板到编辑器
 * @param {string} id - 模板ID
 */
export function loadTemplate(id) {
    const template = templates.find(t => t.id === id);
    if (template && window.editor) {
        window.editor.setValue(template.code);
        
        // 更新选中状态
        document.querySelectorAll('.template-item').forEach(el => {
            el.classList.toggle('active', el.dataset.id === id);
        });
    }
}