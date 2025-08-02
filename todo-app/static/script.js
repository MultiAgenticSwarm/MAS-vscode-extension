// Todo App JavaScript - Modern ES6+ Implementation
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initElements();
        this.bindEvents();
        this.loadTodos();
    }

    initElements() {
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    bindEvents() {
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.todoInput.addEventListener('input', () => this.validateInput());
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
    }

    validateInput() {
        const value = this.todoInput.value.trim();
        this.addBtn.disabled = !value;
    }

    async handleAddTodo(e) {
        e.preventDefault();
        const task = this.todoInput.value.trim();
        
        if (!task) return;

        this.setLoading(true);
        
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task })
            });

            if (!response.ok) throw new Error('Failed to add todo');

            const newTodo = await response.json();
            this.todos.unshift(newTodo);
            this.todoInput.value = '';
            this.validateInput();
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Failed to add todo. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async loadTodos() {
        this.setLoading(true);
        
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) throw new Error('Failed to load todos');
            
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load todos');
        } finally {
            this.setLoading(false);
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const updatedTodo = { ...todo, completed: !todo.completed };
        
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: updatedTodo.completed })
            });

            if (!response.ok) throw new Error('Failed to update todo');

            const result = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = result;
            
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error toggling todo:', error);
            alert('Failed to update todo. Please try again.');
        }
    }

    async updateTodo(id, newTask) {
        if (!newTask.trim()) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTask })
            });

            if (!response.ok) throw new Error('Failed to update todo');

            const result = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = result;
            
            this.editingId = null;
            this.renderTodos();
            
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Failed to update todo. Please try again.');
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this todo?')) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete todo');

            this.todos = this.todos.filter(t => t.id !== id);
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Please try again.');
        }
    }

    startEdit(id) {
        this.editingId = id;
        this.renderTodos();
        
        // Focus on the edit input
        const editInput = document.querySelector(`[data-id="${id}"] .edit-input`);
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.renderTodos();
    }

    handleFilterChange(e) {
        const newFilter = e.target.dataset.filter;
        this.currentFilter = newFilter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.renderTodos();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');
        this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');
        
        // Bind events for todo items
        this.bindTodoEvents();
    }

    createTodoHTML(todo) {
        const isEditing = this.editingId === todo.id;
        
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="app.toggleTodo(${todo.id})">
                    ${todo.completed ? '✓' : ''}
                </div>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.task)}</span>
                ${isEditing ? `
                    <input type="text" class="edit-input" value="${this.escapeHtml(todo.task)}" 
                           onblur="app.handleEditSave(${todo.id}, this.value)"
                           onkeydown="app.handleEditKeydown(event, ${todo.id}, this.value)">
                ` : ''}
                <div class="todo-actions">
                    ${!isEditing ? `
                        <button class="action-btn edit-btn" onclick="app.startEdit(${todo.id})" title="Edit">
                            ✏️
                        </button>
                    ` : `
                        <button class="action-btn edit-btn" onclick="app.cancelEdit()" title="Cancel">
                            ✕
                        </button>
                    `}
                    <button class="action-btn delete-btn" onclick="app.deleteTodo(${todo.id})" title="Delete">
                        🗑️
                    </button>
                </div>
            </li>
        `;
    }

    bindTodoEvents() {
        // Events are bound via onclick in HTML for simplicity
    }

    handleEditSave(id, newValue) {
        if (this.editingId === id) {
            this.updateTodo(id, newValue);
        }
    }

    handleEditKeydown(event, id, value) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.updateTodo(id, value);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            this.cancelEdit();
        }
    }

    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(todo => !todo.completed).length;
        const completed = total - active;

        this.totalCount.textContent = `${total} task${total !== 1 ? 's' : ''} total`;
        this.activeCount.textContent = `${active} active`;
        this.completedCount.textContent = `${completed} completed`;
    }

    setLoading(loading) {
        const container = document.querySelector('.container');
        if (loading) {
            container.classList.add('loading');
        } else {
            container.classList.remove('loading');
        }
    }

    showError(message) {
        // Simple error display - in a real app you'd want a proper toast/notification system
        alert(message);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Handle visibility change to refresh todos when tab becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.app) {
        window.app.loadTodos();
    }
});
