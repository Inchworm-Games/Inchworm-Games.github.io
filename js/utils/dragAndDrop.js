class DragAndDropManager {
    constructor(storage, onReorder) {
        this.storage = storage;
        this.onReorder = onReorder;
        this.draggedItem = null;
    }

    handleDragStart(task, element) {
        this.draggedItem = task;
        element.classList.add('dragging');
        element.style.opacity = '0.5';
    }

    handleDragOver(e, targetTask, tasks) {
        e.preventDefault();
        if (!this.draggedItem || targetTask.id === this.draggedItem.id) return;

        const draggedIndex = tasks.findIndex(t => t.id === this.draggedItem.id);
        const targetIndex = tasks.findIndex(t => t.id === targetTask.id);
        
        if (draggedIndex === targetIndex) return;

        // Calculate new priorities
        const reorderedTasks = [...tasks];
        const [removed] = reorderedTasks.splice(draggedIndex, 1);
        reorderedTasks.splice(targetIndex, 0, removed);

        // Update priorities
        reorderedTasks.forEach((task, index) => {
            task.priority = index * 10;
        });

        this.onReorder(reorderedTasks);
    }

    handleDragEnd(element) {
        this.draggedItem = null;
        element.classList.remove('dragging');
        element.style.opacity = '1';
    }
}