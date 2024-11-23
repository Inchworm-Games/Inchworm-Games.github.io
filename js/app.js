class TaskManager {
    constructor() {
        this.storage = new StorageManager(STORAGE_KEY);
        this.dragAndDrop = new DragAndDropManager(this.storage, (reorderedTasks) => {
            this.storage.reorderTasks(reorderedTasks);
            this.render();
        });
        this.initializeComponents();
        this.attachGlobalEventListeners();
        this.render();
    }

    initializeComponents() {
        // Initialize TaskForm
        this.taskForm = new TaskForm('taskForm', this.storage, (formData, isEditing) => {
            if (isEditing) {
                this.storage.updateTask(formData.id, formData);
            } else {
                this.storage.addTask(formData);
            }
            this.render();
        });

        // Initialize FilterPanel
        this.filterPanel = new FilterPanel('filterPanel', this.storage, (filters) => {
            this.currentFilters = filters;
            this.render();
        });

        // Initialize state
        this.currentFilter = 'all';
        this.currentFilters = {
            search: '',
            category: '',
            assignee: '',
            tag: ''
        };
    }

    attachGlobalEventListeners() {
        // Add Task button
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.taskForm.show();
        });

        // Toggle Filters button
        document.getElementById('toggleFilters').addEventListener('click', () => {
            this.filterPanel.toggle();
        });

        // Status filter buttons
        document.querySelector('.status-filters').addEventListener('click', (e) => {
            const button = e.target.closest('.filter-button');
            if (!button) return;

            document.querySelectorAll('.filter-button').forEach(btn => 
                btn.classList.remove('active'));
            button.classList.add('active');
            
            this.currentFilter = button.dataset.filter;
            this.render();
        });
    }

    filterTasks(tasks) {
        return tasks.filter(task => {
            if (this.currentFilter !== 'all' && task.status !== this.currentFilter) return false;
            if (this.currentFilters.search && 
                !task.title.toLowerCase().includes(this.currentFilters.search.toLowerCase())) return false;
            if (this.currentFilters.category && task.category !== this.currentFilters.category) return false;
            if (this.currentFilters.assignee && 
                !task.assignee.toLowerCase().includes(this.currentFilters.assignee.toLowerCase())) return false;
            if (this.currentFilters.tag && 
                !task.tags.some(tag => tag.toLowerCase().includes(this.currentFilters.tag.toLowerCase()))) return false;
            return true;
        });
    }

    render() {
        const taskList = document.getElementById('taskList');
        const tasks = this.storage.getTasks();
        const filteredTasks = this.filterTasks(tasks);

        taskList.innerHTML = filteredTasks.map(task => new TaskItem(task).render()).join('');
        this.attachTaskEventListeners();
    }

    attachTaskEventListeners() {
        document.querySelectorAll('.task-item').forEach(taskElement => {
            const taskId = parseInt(taskElement.dataset.taskId);
            const task = this.storage.getTasks().find(t => t.id === taskId);

            // Add drag and drop event listeners
            taskElement.addEventListener('dragstart', () => {
                this.dragAndDrop.handleDragStart(task, taskElement);
            });

            taskElement.addEventListener('dragover', (e) => {
                this.dragAndDrop.handleDragOver(e, task, this.storage.getTasks());
            });

            taskElement.addEventListener('dragend', () => {
                this.dragAndDrop.handleDragEnd(taskElement);
            });

            // Edit button
            taskElement.querySelector('.edit-task')?.addEventListener('click', () => {
                this.taskForm.show(task);
            });

            // Delete button
            taskElement.querySelector('.delete-task')?.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    this.storage.deleteTask(taskId);
                    this.render();
                }
            });

            // Toggle status button
            taskElement.querySelector('.toggle-status')?.addEventListener('click', () => {
                const statusMap = { 
                    'todo': 'in-progress', 
                    'in-progress': 'done', 
                    'done': 'todo' 
                };
                this.storage.updateTask(taskId, { ...task, status: statusMap[task.status] });
                this.render();
            });
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});