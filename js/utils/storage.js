class StorageManager {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    getTasks() {
        const tasks = localStorage.getItem(this.storageKey);
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks(tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    addTask(task) {
        const tasks = this.getTasks();
        tasks.unshift(task);
        this.saveTasks(tasks);
        return tasks;
    }

    updateTask(taskId, updatedTask) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedTask };
            this.saveTasks(tasks);
        }
        return tasks;
    }

    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        this.saveTasks(filteredTasks);
        return filteredTasks;
    }

    reorderTasks(tasks) {
        this.saveTasks(tasks);
    }
}