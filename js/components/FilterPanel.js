class FilterPanel {
    constructor(containerId, storage, onFilterChange) {
        this.container = document.getElementById(containerId);
        this.storage = storage;
        this.onFilterChange = onFilterChange;
        this.filters = {
            search: '',
            category: '',
            assignee: '',
            tag: ''
        };
    }

    render() {
        this.container.innerHTML = `
            <div class="filter-grid">
                <div class="filter-item">
                    <label class="filter-label">Search</label>
                    <div class="search-container">
                        <i class="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            id="searchFilter" 
                            class="filter-input" 
                            placeholder="Search tasks..."
                            value="${this.filters.search}"
                        >
                    </div>
                </div>

                <div class="filter-item">
                    <label class="filter-label">Category</label>
                    <select id="categoryFilter" class="filter-select">
                        <option value="">All Categories</option>
                        ${Object.entries(CATEGORIES).map(([value, { label }]) => `
                            <option value="${value}" ${this.filters.category === value ? 'selected' : ''}>
                                ${label}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="filter-item">
                    <label class="filter-label">Assignee</label>
                    <input 
                        type="text" 
                        id="assigneeFilter" 
                        class="filter-input" 
                        placeholder="Filter by assignee"
                        value="${this.filters.assignee}"
                    >
                </div>

                <div class="filter-item">
                    <label class="filter-label">Tags</label>
                    <input 
                        type="text" 
                        id="tagFilter" 
                        class="filter-input" 
                        placeholder="Filter by tag"
                        value="${this.filters.tag}"
                    >
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const inputs = ['search', 'category', 'assignee', 'tag'];
        
        inputs.forEach(filterType => {
            const element = document.getElementById(`${filterType}Filter`);
            element.addEventListener('input', (e) => {
                this.filters[filterType] = e.target.value;
                this.onFilterChange(this.filters);
            });
        });
    }

    toggle() {
        this.container.classList.toggle('hidden');
        if (!this.container.classList.contains('hidden')) {
            this.render();
        }
    }
}