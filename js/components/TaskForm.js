class TaskForm {
    constructor(containerId, storage, onSubmit) {
        this.container = document.getElementById(containerId);
        this.storage = storage;
        this.onSubmit = onSubmit;
        this.isEditing = false;
        this.currentTask = null;
    }

    show(task = null) {
        this.isEditing = !!task;
        this.currentTask = task;
        this.container.classList.remove('hidden');
        this.render();
    }

    hide() {
        this.container.classList.add('hidden');
        this.container.innerHTML = '';
        this.currentTask = null;
    }

    render() {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" id="taskTitle" class="form-input" 
                   value="${this.currentTask?.title || ''}" 
                   placeholder="Task title" required>
            
            <div class="form-row">
                <select id="taskCategory" class="form-select">
                    ${Object.entries(CATEGORIES).map(([value, { label }]) => `
                        <option value="${value}" ${this.currentTask?.category === value ? 'selected' : ''}>
                            ${label}
                        </option>
                    `).join('')}
                </select>

                <input type="text" id="taskAssignee" class="form-input"
                       value="${this.currentTask?.assignee || ''}" 
                       placeholder="Assignee">
            </div>

            <div class="tag-input-container">
                <input type="text" id="tagInput" class="form-input" 
                       placeholder="Add tag and press Enter">
                <div id="tagsList" class="tags-list">
                    ${(this.currentTask?.tags || []).map(tag => this.createTagElement(tag)).join('')}
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-check"></i> ${this.isEditing ? 'Update' : 'Add'} Task
                </button>
                <button type="button" class="btn btn-secondary" id="cancelForm">
                    Cancel
                </button>
            </div>
        `;

        this.container.innerHTML = '';
        this.container.appendChild(form);
        this.attachEventListeners();
    }

    createTagElement(tag) {
        return `
            <span class="tag">
                ${tag}
                <button type="button" class="remove-tag" data-tag="${tag}">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `;
    }

    attachEventListeners() {
        const form = this.container.querySelector('form');
        const tagInput = document.getElementById('tagInput');
        const tagsList = document.getElementById('tagsList');
        const cancelButton = document.getElementById('cancelForm');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelButton.addEventListener('click', () => this.hide());
        
        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = tagInput.value.trim();
                if (tag) {
                    tagsList.innerHTML += this.createTagElement(tag);
                    tagInput.value = '';
                }
            }
        });

        tagsList.addEventListener('click', (e) => {
            if (e.target.closest('.remove-tag')) {
                e.target.closest('.tag').remove();
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const formData = {
            title: document.getElementById('taskTitle').value.trim(),
            category: document.getElementById('taskCategory').value,
            assignee: document.getElementById('taskAssignee').value.trim(),
            tags: Array.from(document.querySelectorAll('.tag'))
                .map(tag => tag.textContent.trim()),
            status: this.currentTask?.status || 'todo',
            id: this.currentTask?.id || Date.now()
        };

        if (!formData.title) return;

        this.onSubmit(formData, this.isEditing);
        this.hide();
    }
}