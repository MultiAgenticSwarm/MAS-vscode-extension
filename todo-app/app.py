from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# Database setup
DATABASE = 'todos.db'

def get_database_path():
    """Get the database path, using config if available."""
    return app.config.get('DATABASE', DATABASE)

def init_db():
    """Initialize the SQLite database."""
    db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection."""
    db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    """Serve the main todo app page."""
    return render_template('index.html')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Get all todos."""
    conn = get_db_connection()
    todos = conn.execute('SELECT * FROM todos ORDER BY created_at DESC').fetchall()
    conn.close()
    
    return jsonify([{
        'id': todo['id'],
        'task': todo['task'],
        'completed': bool(todo['completed']),
        'created_at': todo['created_at']
    } for todo in todos])

@app.route('/api/todos', methods=['POST'])
def add_todo():
    """Add a new todo."""
    data = request.get_json()
    task = data.get('task', '').strip()
    
    if not task:
        return jsonify({'error': 'Task cannot be empty'}), 400
    
    conn = get_db_connection()
    cursor = conn.execute('INSERT INTO todos (task) VALUES (?)', (task,))
    todo_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': todo_id,
        'task': task,
        'completed': False,
        'created_at': datetime.now().isoformat()
    }), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """Update a todo."""
    data = request.get_json()
    
    conn = get_db_connection()
    todo = conn.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
    
    if not todo:
        conn.close()
        return jsonify({'error': 'Todo not found'}), 404
    
    task = data.get('task', todo['task'])
    completed = data.get('completed', bool(todo['completed']))
    
    conn.execute(
        'UPDATE todos SET task = ?, completed = ? WHERE id = ?',
        (task, completed, todo_id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': todo_id,
        'task': task,
        'completed': completed,
        'created_at': todo['created_at']
    })

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo."""
    conn = get_db_connection()
    todo = conn.execute('SELECT * FROM todos WHERE id = ?', (todo_id,)).fetchone()
    
    if not todo:
        conn.close()
        return jsonify({'error': 'Todo not found'}), 404
    
    conn.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Todo deleted successfully'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
