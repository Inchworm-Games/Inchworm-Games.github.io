const CATEGORIES = {
    gameplay: { icon: 'gamepad', color: '#9333ea', label: 'Gameplay' },
    art: { icon: 'palette', color: '#ec4899', label: 'Art' },
    audio: { icon: 'music', color: '#22c55e', label: 'Audio' },
    ui: { icon: 'window-maximize', color: '#3b82f6', label: 'UI' },
    optimization: { icon: 'gauge-high', color: '#f97316', label: 'Optimization' }
};

const STATUS_COLORS = {
    todo: { bg: '#f9fafb', hover: '#f3f4f6' },
    'in-progress': { bg: '#dbeafe', hover: '#bfdbfe' },
    done: { bg: '#dcfce7', hover: '#bbf7d0' }
};

const STORAGE_KEY = 'gameDevTasks';