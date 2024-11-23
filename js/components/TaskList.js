class TaskList {
    constructor(containerId, storage) {
        this.container = document.getElementById(containerId);
        this.storage = storage;
        this.currentFilter = 'all';
        this.searchFilters = {
            search: '',
            category: '',
            assignee: '',
            tag: ''
        };
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    updateSearchFilters(filters) {
        this.searchFilters = { ...this.searchFilters, ...filters };
        this.render();
    }

    filterTasks(tasks) {
        return tasks.filter(task => {
            if (this.currentFilter !== 'all' && task.status !== this.currentFilter) return false;
            if (this.searchFilters.search && 
                !task.title.toLowerCase().includes(this.searchFilters.search.toLowerCase())) return false;
            if (this.searchFilters.category && task.category !== this.searchFilters.category) return false;
            if (this.searchFilters.assignee && 
                !task.assignee.toLowerCase().includes(this.searchFilters.assignee.toLowerCase())) return false;
            if (this.searchFilters.tag && 
                !task.tags.some(tag => tag.toLowerCase().includes(this.searchFilters.tag.toLowerCase()))) return false;
            return true;
        });
    }

    render() {
        const tasks = this.storage.getTasks();
        const filteredTasks = this.filterTasks(tasks);
        
        this.container.innerHTML = filteredTasks.map(task => 
            new TaskItem(task).render()
        ).join('');
    }

    attachEventListeners() {
        this.container.addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task-item');
            if (!taskElement) return;

            const taskId = parseInt(taskElement.dataset.taskId);
            const task = this.storage.getTasks().find(t => t.id === taskId);

            if (e.target.closest('.delete-task')) {
                this.storage.deleteTask(taskId);
                this.render();
            } else if (e.target.closest('.edit-task')) {
                window.taskForm.show(task);
            } else if (e.target.closest('.toggle-status')) {
                const statusMap = { 
                    'todo': 'in-progress', 
                    'in-progress': 'done', 
                    'done': 'todo' 
                };
                const updatedTask = { 
                    ...task, 
                    status: statusMap[task.status] 
                };
                this.storage.updateTask(taskId, updatedTask);
                this.render();
            }
        });
    }
}
