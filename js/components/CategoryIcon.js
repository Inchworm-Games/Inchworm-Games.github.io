class CategoryIcon {
    static render(category) {
        const categoryConfig = CATEGORIES[category];
        if (!categoryConfig) return '';
        
        return `<i class="fas fa-${categoryConfig.icon}" style="color: ${categoryConfig.color}"></i>`;
    }
}
