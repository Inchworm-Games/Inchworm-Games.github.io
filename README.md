import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, Clock, Plus, Tag, Trash2, UserCircle, Gamepad2, Sparkles, GripVertical, Search, Edit2, X, Filter } from 'lucide-react';

// Constants
const CATEGORIES = {
  gameplay: { icon: Gamepad2, color: 'text-purple-500', label: 'Gameplay' },
  art: { icon: Sparkles, color: 'text-pink-500', label: 'Art' },
  audio: { icon: Tag, color: 'text-green-500', label: 'Audio' },
  ui: { icon: Tag, color: 'text-blue-500', label: 'UI' },
  optimization: { icon: Tag, color: 'text-orange-500', label: 'Optimization' }
};

const STATUS_COLORS = {
  todo: 'bg-gray-50 hover:bg-gray-100',
  'in-progress': 'bg-blue-50 hover:bg-blue-100',
  done: 'bg-green-50 hover:bg-green-100'
};

// Components
const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || 'gameplay');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(task?.tags || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      ...(task || {}),
      title: title.trim(),
      category,
      assignee: assignee.trim(),
      tags
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full px-4 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(CATEGORIES).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assignee"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Add Tag
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Check size={16} />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const FilterPanel = ({ filters, onFilterChange }) => (
  <div className="mb-4 p-4 border rounded-lg bg-gray-50">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORIES).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
        <input
          type="text"
          value={filters.assignee}
          onChange={(e) => onFilterChange({ ...filters, assignee: e.target.value })}
          placeholder="Filter by assignee"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          type="text"
          value={filters.tag}
          onChange={(e) => onFilterChange({ ...filters, tag: e.target.value })}
          placeholder="Filter by tag"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
);

// Main Component
const TodoList = () => {
  const [todos, setTodos] = useState([/* ... existing initial state ... */]);
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    assignee: '',
    tag: ''
  });

  const handleAddTodo = useCallback(({ title, category, assignee, tags }) => {
    const newPriority = todos.length > 0 ? Math.min(...todos.map(t => t.priority)) - 1 : 1;
    
    const newTodo = {
      id: Date.now(),
      title,
      status: 'todo',
      category,
      priority: newPriority,
      assignee,
      tags,
      sprint: 'Sprint 3'
    };
    
    setTodos(prev => [newTodo, ...prev]);
    setIsAdding(false);
  }, [todos]);

  const handleEditTodo = useCallback((editedTodo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
    ));
    setEditingId(null);
  }, []);

  const filteredTodos = todos
    .filter(todo => {
      if (filter !== 'all' && todo.status !== filter) return false;
      if (filters.search && !todo.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && todo.category !== filters.category) return false;
      if (filters.assignee && !todo.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) return false;
      if (filters.tag && !todo.tags.some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => a.priority - b.priority);

  // ... rest of the existing handlers ...

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Game Dev Tasks</span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1 rounded hover:bg-gray-100 ${showFilters ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <Filter size={20} />
            </button>
          </div>
          <div className="flex gap-2 text-sm">
            {/* ... existing filter buttons ... */}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
          />
        )}

        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full p-4 border-2 border-dashed rounded-lg text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-colors mb-4 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Task (Adds to Top of Stack)
          </button>
        )}

        {isAdding && (
          <TaskForm
            onSave={handleAddTodo}
            onCancel={() => setIsAdding(false)}
          />
        )}

        <div className="space-y-2">
          {filteredTodos.map(todo => (
            editingId === todo.id ? (
              <TaskForm
                key={todo.id}
                task={todo}
                onSave={handleEditTodo}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={todo.id}
                draggable
                onDragStart={() => handleDragStart(todo)}
                onDragOver={(e) => handleDragOver(e, todo)}
                onDragEnd={() => setDraggedItem(null)}
                className={`p-4 rounded-lg border ${STATUS_COLORS[todo.status]} 
                  transition-all duration-200 transform hover:scale-[1.01]
                  ${draggedItem?.id === todo.id ? 'opacity-50' : ''}
                  cursor-grab active:cursor-grabbing`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="text-gray-400" size={16} />
                    <div className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-100 rounded">
                      {todo.priority}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(todo.id)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        {/* ... existing status button ... */}
                      </button>
                      <span className={todo.status === 'done' ? 'line-through text-gray-500' : ''}>
                        {todo.title}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CategoryIcon category={todo.category} />
                        {todo.category}
                      </div>
                      {todo.assignee && (
                        <div className="flex items-center gap-1">
                          <UserCircle size={14} />
                          {todo.assignee}
                        </div>
                      )}
                      {todo.tags.map(tag => (
                        <div key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(todo.id)}
                      className="p-1 hover:bg-white rounded text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-1 hover:bg-white rounded text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;