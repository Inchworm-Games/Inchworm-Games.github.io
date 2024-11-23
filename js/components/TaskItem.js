class TaskItem {
    constructor(task, onStatusToggle, onEdit, onDelete) {
        this.task = task;
        this.onStatusToggle = onStatusToggle;
        this.onEdit = onEdit;
        this.onDelete = onDelete;
    }

    getStatusIcon() {
        const icons = {
            'todo': 'far fa-circle',
            'in-progress': 'fas fa-clock',
            'done': 'fas fa-check-circle'
        };
        return icons[this.task.status] || icons.todo;
    }

    render() {
        return `
            <div class="task-item ${this.task.status}" 
                 data-task-id="${this.task.id}"
                 draggable="true">
                <div class="task-content">
                    <div class="task-header">
                        <div class="task-grip">
                            <i class="fas fa-grip-vertical text-gray-400"></i>
                            <div class="priority-badge">
                                ${this.task.priority}
                            </div>
                        </div>
                        
                        <div class="task-main">
                            <div class="task-title-row">
                                <button class="status-toggle" data-action="toggle-status">
                                    <i class="${this.getStatusIcon()}"></i>
                                </button>
                                <span class="task-title ${this.task.status === 'done' ? 'completed' : ''}">
                                    ${this.task.title}
                                </span>
                            </div>
                            
                            <div class="task-details">
                                <div class="category-badge">
                                    ${CategoryIcon.render(this.task.category)}
                                    <span>${CATEGORIES[this.task.category].label}</span>
                                </div>
                                
                                ${this.task.assignee ? `
                                    <div class="assignee-badge">
                                        <i class="fas fa-user"></i>
                                        <span>${this.task.assignee}</span>
                                    </div>
                                ` : ''}
                                
                                <div class="tags-container">
                                    ${this.task.tags.map(tag => `
                                        <span class="tag">${tag}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="task-actions">
                            <button class="action-button edit-button" data-action="edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-button delete-button" data-action="delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static attachEventListeners(element, handlers) {
        // Status toggle
        element.querySelector('[data-action="toggle-status"]')?.addEventListener('click', handlers.onStatusToggle);
        
        // Edit button
        element.querySelector('[data-action="edit"]')?.addEventListener('click', handlers.onEdit);
        
        // Delete button
        element.querySelector('[data-action="delete"]')?.addEventListener('click', handlers.onDelete);
    }
}
