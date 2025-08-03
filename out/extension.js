"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const llmApi_1 = require("./llmApi");
let panel;
let isVisible = false;
function activate(context) {
    console.log("MultiAgent Swarm extension is now active!");
    // Set initial context
    vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", false);
    // Register commands
    const openPanelCommand = vscode.commands.registerCommand("multiagentSwarm.openPanel", () => {
        createOrShowPanel(context);
    });
    const togglePanelCommand = vscode.commands.registerCommand("multiagentSwarm.togglePanel", () => {
        if (panel && panel.visible) {
            panel.dispose();
            panel = undefined;
            isVisible = false;
            vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", false);
        }
        else {
            createOrShowPanel(context);
            isVisible = true;
            vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", true);
        }
    });
    // Register view provider for the activity bar
    const provider = new MultiAgentSwarmViewProvider(context);
    vscode.window.registerWebviewViewProvider("multiagentSwarm.mainView", provider);
    context.subscriptions.push(openPanelCommand, togglePanelCommand);
}
exports.activate = activate;
function createOrShowPanel(context) {
    const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    if (panel) {
        panel.reveal(columnToShowIn);
        isVisible = true;
        vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", true);
        return;
    }
    // Create the webview panel
    panel = vscode.window.createWebviewPanel("multiagentSwarm", "MultiAgent Swarm", vscode.ViewColumn.Beside, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")],
    });
    // Set the icon
    panel.iconPath = {
        light: vscode.Uri.joinPath(context.extensionUri, "media", "icon.svg"),
        dark: vscode.Uri.joinPath(context.extensionUri, "media", "icon.svg"),
    };
    // Set visibility context
    isVisible = true;
    vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", true);
    // Set the HTML content
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
    // Handle panel disposal
    panel.onDidDispose(() => {
        panel = undefined;
        isVisible = false;
        vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", false);
    }, null, context.subscriptions);
    // Handle visibility changes
    panel.onDidChangeViewState((e) => {
        isVisible = e.webviewPanel.visible;
        vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", isVisible);
    });
    // Handle messages from the webview
    panel.webview.onDidReceiveMessage((message) => {
        console.log('DEBUG: Extension received message:', message);
        switch (message.command) {
            case "alert":
                vscode.window.showInformationMessage(message.text);
                return;
            case "error":
                vscode.window.showErrorMessage(message.text);
                return;
            case "saveConfig":
                vscode.window.showInformationMessage("Configuration saved successfully!");
                return;
            case "createAgent":
                vscode.window.showInformationMessage(`Agent "${message.data.name}" created successfully!`);
                return;
            case "sendMessage":
                console.log("Message sent:", message.data);
                // Handle demo Python app creation with more flexible patterns
                const messageText = message.data.message ? message.data.message.toLowerCase() : '';
                console.log('DEBUG: Checking message for demo trigger:', messageText);
                if (messageText &&
                    ((messageText.includes('python') && (messageText.includes('flask') || messageText.includes('sqlite'))) ||
                        (messageText.includes('todo') || messageText.includes('task')))) {
                    console.log('DEBUG: Demo trigger detected in sendMessage, calling handlePythonTodoDemoCreation');
                    handlePythonTodoDemoCreation(panel, message.data);
                }
                return;
            case "pythonTodoDemo":
                console.log('DEBUG: pythonTodoDemo command received:', message.data);
                handlePythonTodoDemoCreation(panel, message.data);
                return;
            case "saveGlobalCollaboration":
                console.log('DEBUG: Global collaboration rules saved:', message.data);
                vscode.window.showInformationMessage('✅ Global collaboration rules saved successfully!');
                return;
            case "saveSwarmCollaboration":
                console.log('DEBUG: Swarm collaboration rules saved for', message.data.swarm, ':', message.data.rules);
                vscode.window.showInformationMessage(`✅ ${message.data.swarm} collaboration rules saved successfully!`);
                return;
            case "updateAgent":
                console.log("Agent updated:", message.data);
                return;
            case "toggleTool":
                console.log("Tool toggled:", message.data);
                return;
            case "generateSwarmWithAI":
                handleGenerateSwarmWithAI(panel, message.data);
                return;
            case "generateToolWithAI":
                handleGenerateToolWithAI(panel, message.data);
                return;
            case "generateAgentWithAI":
                handleGenerateAgentWithAI(panel, message.data);
                return;
            case "generateAISuggestions":
                handleGenerateAISuggestions(panel, message.data);
                return;
            case "addCustomTool":
                vscode.window.showInformationMessage(`Custom tool "${message.data.name}" added to ${message.data.agentId}`);
                return;
            case "deleteCustomTool":
                vscode.window.showInformationMessage(`Custom tool "${message.data.toolName}" removed`);
                return;
            case "createCustomSwarm":
                vscode.window.showInformationMessage(`Custom swarm "${message.data.name}" created successfully!`);
                return;
            case "getCodeContext":
                handleGetCodeContext(panel);
                return;
            case "sendEnhancedMessage":
                handleEnhancedMessage(panel, message.data);
                return;
        }
    }, undefined, context.subscriptions);
    isVisible = true;
    vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", true);
}
class MultiAgentSwarmViewProvider {
    constructor(context) {
        this.context = context;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "media")],
        };
        // Simple HTML for the activity bar view with toggle button
        webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MultiAgent Swarm</title>
          <style>
              body {
                  font-family: var(--vscode-font-family);
                  color: var(--vscode-foreground);
                  background: var(--vscode-sideBar-background);
                  margin: 0;
                  padding: 16px;
              }
              .toggle-button {
                  width: 100%;
                  padding: 12px;
                  background: var(--vscode-button-background);
                  border: none;
                  border-radius: 6px;
                  color: var(--vscode-button-foreground);
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 12px;
              }
              .toggle-button:hover {
                  background: var(--vscode-button-hoverBackground);
              }
              .description {
                  font-size: 12px;
                  color: var(--vscode-descriptionForeground);
                  line-height: 1.4;
              }
              .icon {
                  font-size: 24px;
                  text-align: center;
                  margin-bottom: 12px;
              }
          </style>
      </head>
      <body>
          <div class="icon">🤖</div>
          <button class="toggle-button" onclick="togglePanel()">Open MultiAgent Swarm</button>
          <div class="description">
              Click to open the Multi-Agent Collaboration Hub and start working with your AI agents.
          </div>
          
          <script>
              const vscode = acquireVsCodeApi();
              
              function togglePanel() {
                  vscode.postMessage({
                      command: 'togglePanel'
                  });
              }
          </script>
      </body>
      </html>
    `;
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "togglePanel":
                    vscode.commands.executeCommand("multiagentSwarm.togglePanel");
                    return;
                case "openFullPanel":
                    createOrShowPanel(this.context);
                    return;
            }
        });
    }
}
function getWebviewContent(webview, extensionUri) {
    // Read the HTML file
    const htmlPath = path.join(extensionUri.fsPath, "media", "webview.html");
    let html = fs.readFileSync(htmlPath, "utf8");
    // Get the local path to the icon
    const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "icon.svg"));
    // Replace placeholder with actual icon URI
    html = html.replace("{{ICON_URI}}", iconUri.toString());
    return html;
}
// AI Handler Functions
async function handleGenerateSwarmWithAI(panel, data) {
    if (!panel)
        return;
    try {
        vscode.window.showInformationMessage('🤖 Generating swarm with AI...');
        const swarmData = await (0, llmApi_1.generateSwarmWithAI)(data.prompt);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'swarmGenerated',
            data: { swarm: swarmData }
        });
    }
    catch (error) {
        console.error('Error generating swarm:', error);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'swarmGenerated',
            data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
    }
}
async function handleGenerateToolWithAI(panel, data) {
    if (!panel)
        return;
    try {
        vscode.window.showInformationMessage('🤖 Generating tool with AI...');
        const toolData = await (0, llmApi_1.generateToolWithAI)(data.prompt);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'toolGenerated',
            data: { tool: toolData }
        });
    }
    catch (error) {
        console.error('Error generating tool:', error);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'toolGenerated',
            data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
    }
}
async function handleGenerateAgentWithAI(panel, data) {
    if (!panel)
        return;
    try {
        vscode.window.showInformationMessage('🤖 Generating agent with AI...');
        const agentData = await (0, llmApi_1.generateAgentWithAI)(data.prompt);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'agentGenerated',
            data: { agent: agentData }
        });
    }
    catch (error) {
        console.error('Error generating agent:', error);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'agentGenerated',
            data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
    }
}
async function handleGenerateAISuggestions(panel, data) {
    if (!panel)
        return;
    try {
        const suggestions = await (0, llmApi_1.generateSuggestions)(data.context, data.currentSwarm);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'suggestionsGenerated',
            data: { suggestions }
        });
    }
    catch (error) {
        console.error('Error generating suggestions:', error);
        panel.webview.postMessage({
            command: 'aiResponse',
            type: 'suggestionsGenerated',
            data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
    }
}
async function handleGetCodeContext(panel) {
    if (!panel)
        return;
    try {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const document = activeEditor.document;
            const codeContext = {
                fileName: path.basename(document.fileName),
                language: document.languageId,
                content: document.getText(),
                lineCount: document.lineCount,
                selection: activeEditor.selection.isEmpty ? null : {
                    start: activeEditor.selection.start.line,
                    end: activeEditor.selection.end.line,
                    text: document.getText(activeEditor.selection)
                }
            };
            panel.webview.postMessage({
                command: 'codeContextReceived',
                data: { context: codeContext }
            });
        }
        else {
            panel.webview.postMessage({
                command: 'codeContextReceived',
                data: { context: null, message: 'No active file found' }
            });
        }
    }
    catch (error) {
        console.error('Error getting code context:', error);
    }
}
async function handleEnhancedMessage(panel, data) {
    if (!panel)
        return;
    try {
        let prompt = data.message;
        // Handle demo Python app creation with more flexible patterns  
        const messageText = data.message ? data.message.toLowerCase() : '';
        if (messageText &&
            ((messageText.includes('python') && (messageText.includes('flask') || messageText.includes('sqlite'))) ||
                (messageText.includes('todo') || messageText.includes('task')))) {
            // Let the webview handle the demo responses instead of trying to call API
            return;
        }
        if (data.includeContext) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                const document = activeEditor.document;
                const fileName = path.basename(document.fileName);
                const language = document.languageId;
                const code = document.getText();
                prompt = `Context: Working on file "${fileName}" (${language})\n\nCode:\n${code}\n\nUser question: ${data.message}`;
            }
        }
        // Use existing AI response function or create a mock response
        const response = await generateAIResponseForChat(prompt);
        panel.webview.postMessage({
            command: 'aiChatResponse',
            data: {
                response: response,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error handling enhanced message:', error);
    }
}
async function generateAIResponseForChat(prompt) {
    // For demo purposes, return a hardcoded response instead of calling LLM API
    return 'This is a demo response. The MultiAgent Swarm is working on your request!';
}
async function handlePythonTodoDemoCreation(panel, data) {
    if (!panel)
        return;
    try {
        console.log('DEBUG: handlePythonTodoDemoCreation called with:', data);
        // Get the current workspace folder or use home directory
        let workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        let basePath;
        if (!workspaceFolder) {
            // If no workspace is open, create in user's home directory or desktop
            const os = require('os');
            basePath = require('path').join(os.homedir(), 'Desktop', 'python-todo-demo');
            console.log('DEBUG: No workspace folder, using:', basePath);
            vscode.window.showWarningMessage('No workspace folder open. Creating demo in Desktop folder.');
        }
        else {
            basePath = require('path').join(workspaceFolder.uri.fsPath, 'python-todo-demo');
            console.log('DEBUG: Using workspace folder:', basePath);
        }
        // Create the demo files
        console.log('DEBUG: Creating Python todo files at:', basePath);
        await createPythonTodoFiles(basePath);
        // Send success message back to webview
        panel.webview.postMessage({
            command: 'pythonTodoCreated',
            data: {
                path: basePath,
                message: 'Python todo app files created successfully!'
            }
        });
        vscode.window.showInformationMessage(`🐍 Python Todo App created at: ${basePath}`);
        // Also try to open the created folder
        if (!workspaceFolder) {
            const uri = vscode.Uri.file(basePath);
            await vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: false });
        }
    }
    catch (error) {
        console.error('Error creating Python todo demo:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to create Python todo app demo: ${errorMessage}`);
    }
}
async function createPythonTodoFiles(basePath) {
    // Create directory structure
    await fs.promises.mkdir(basePath, { recursive: true });
    await fs.promises.mkdir(path.join(basePath, 'templates'), { recursive: true });
    await fs.promises.mkdir(path.join(basePath, 'static'), { recursive: true });
    // Flask app.py content
    const appPyContent = `from flask import Flask, render_template, request, jsonify
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
    app.run(debug=True, host='0.0.0.0', port=5000)`;
    await fs.promises.writeFile(path.join(basePath, 'app.py'), appPyContent, 'utf8');
    // HTML template content
    const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐍 Python Todo App - MultiAgent Swarm Demo</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>
    <div class="container">
        <header>
            <h1>🐍 Python Todo App</h1>
            <p>Created by MultiAgent Swarm - Flask + SQLite + Modern UI</p>
        </header>

        <main>
            <form id="todoForm" class="todo-form">
                <div class="input-group">
                    <input type="text" id="todoInput" placeholder="What needs to be done?" maxlength="200" required>
                    <button type="submit" id="addBtn">Add Task</button>
                </div>
            </form>

            <div class="filter-controls">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="active">Active</button>
                <button class="filter-btn" data-filter="completed">Completed</button>
            </div>

            <div class="todo-list-container">
                <ul id="todoList" class="todo-list"></ul>
                <div id="emptyState" class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No todos yet</h3>
                    <p>Add your first task to get started!</p>
                </div>
            </div>

            <div class="stats">
                <span id="totalCount">0 tasks total</span>
                <span id="activeCount">0 active</span>
                <span id="completedCount">0 completed</span>
            </div>
        </main>

        <footer>
            <p>🤖 Built by MultiAgent Swarm VS Code Extension</p>
        </footer>
    </div>

    <script src="{{ url_for('static', filename='script.js') }}"></script>
</body>
</html>`;
    await fs.promises.writeFile(path.join(basePath, 'templates', 'index.html'), indexHtmlContent, 'utf8');
    // Create other required files with content...
    const styleCssContent = `/* MultiAgent Swarm Demo - Python Todo App Styles */
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
    --primary: #3b82f6;
    --success: #10b981;
    --danger: #ef4444;
    --gray-100: #f3f4f6;
    --gray-800: #1f2937;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: var(--gray-800);
}

.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

header {
    text-align: center;
    margin-bottom: 2rem;
    color: white;
}

header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
header p { opacity: 0.9; }

main {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    flex: 1;
}

.input-group {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 2rem;
}

#todoInput {
    flex: 1;
    padding: 0.875rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
}

#todoInput:focus {
    outline: none;
    border-color: var(--primary);
}

#addBtn {
    padding: 0.875rem 1.5rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.filter-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.25rem;
    background: var(--gray-100);
    border-radius: 8px;
}

.filter-btn {
    flex: 1;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
}

.filter-btn.active {
    background: white;
    color: var(--primary);
}

.todo-list { list-style: none; }

.todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.todo-checkbox {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.todo-checkbox.checked {
    background: var(--success);
    border-color: var(--success);
    color: white;
}

.todo-text { flex: 1; }
.todo-text.completed { text-decoration: line-through; color: #6b7280; }

.stats {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #6b7280;
}

footer {
    text-align: center;
    margin-top: 2rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #9ca3af;
}

.empty-icon { font-size: 3rem; margin-bottom: 1rem; }`;
    await fs.promises.writeFile(path.join(basePath, 'static', 'style.css'), styleCssContent, 'utf8');
    const scriptJsContent = `// MultiAgent Swarm Demo - Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.initElements();
        this.bindEvents();
        this.loadTodos();
    }

    initElements() {
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    bindEvents() {
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
    }

    async handleAddTodo(e) {
        e.preventDefault();
        const task = this.todoInput.value.trim();
        if (!task) return;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task })
            });
            const newTodo = await response.json();
            this.todos.unshift(newTodo);
            this.todoInput.value = '';
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '';
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';
        this.todoList.innerHTML = filteredTodos.map(todo => 
            \`<li class="todo-item">
                <div class="todo-checkbox \${todo.completed ? 'checked' : ''}" 
                     onclick="app.toggleTodo(\${todo.id})">
                    \${todo.completed ? '✓' : ''}
                </div>
                <span class="todo-text \${todo.completed ? 'completed' : ''}">\${todo.task}</span>
            </li>\`
        ).join('');
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active': return this.todos.filter(todo => !todo.completed);
            case 'completed': return this.todos.filter(todo => todo.completed);
            default: return this.todos;
        }
    }

    handleFilterChange(e) {
        this.currentFilter = e.target.dataset.filter;
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.renderTodos();
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(\`/api/todos/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !todo.completed })
            });
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = updatedTodo;
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(todo => !todo.completed).length;
        const completed = total - active;

        this.totalCount.textContent = \`\${total} task\${total !== 1 ? 's' : ''} total\`;
        this.activeCount.textContent = \`\${active} active\`;
        this.completedCount.textContent = \`\${completed} completed\`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});`;
    await fs.promises.writeFile(path.join(basePath, 'static', 'script.js'), scriptJsContent, 'utf8');
    const requirementsContent = `Flask==2.3.3
Werkzeug==2.3.7`;
    await fs.promises.writeFile(path.join(basePath, 'requirements.txt'), requirementsContent, 'utf8');
    const readmeContent = `# 🐍 Python Todo App

Created by **MultiAgent Swarm VS Code Extension**

## 🚀 Quick Start

1. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. Run the application:
   \`\`\`bash
   python app.py
   \`\`\`

3. Open http://localhost:5000 in your browser

## 🤖 Created by AI Agents

- **🎯 Orchestrator Agent**: Project coordination and planning
- **🐍 Python Developer**: Flask backend with SQLite database
- **🎨 Frontend Developer**: Responsive UI with modern design
- **🧪 QA Tester**: Comprehensive testing and validation

Built with the power of collaborative AI development!`;
    await fs.promises.writeFile(path.join(basePath, 'README.md'), readmeContent, 'utf8');
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map