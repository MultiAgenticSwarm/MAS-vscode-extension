# MultiAgent Swarm VS Code Extension

🤖 **AI-Powered Multi-Agent Development Assistant**

> **🎭 Demo Branch (ycdemo)**: This branch contains a fully functional demonstration with simulated AI responses and interactive features. Perfect for showcasing multi-agent collaboration without requiring actual LLM API connections.

Transform your VS Code development experience with intelligent AI agents that collaborate seamlessly to accelerate your coding workflow. MultiAgent Swarm brings specialized AI assistants directly into your editor, each optimized for different aspects of software development.

## ✨ Features

### � **Demo Features (ycdemo Branch)**
This demonstration branch showcases:

- **🎯 Live Multi-Agent Collaboration**: Watch 4 specialized agents work together on real projects
- **✨ Interactive Prompt Engineering**: Edit system prompts and see instant behavioral changes
- **📝 Writer Agent Showcase**: Specialized agent with 4 tool categories demonstrating prompt editing workflow
- **🔄 Dynamic Project Workflows**: Request "make me a basic notes app" and watch agents coordinate in real-time
- **📊 Activity Logging**: Real-time activity feeds showing what each agent is working on
- **💬 Contextual Responses**: Agents provide realistic, context-aware responses without requiring API connections
- **⚡ Realistic Timing**: Simulated processing delays (1-3 seconds) for believable agent interactions

### 🤖 **Demo Agents**
**Current Demo Configuration:**
1. **🎯 Orchestrator Agent** - Coordinates tasks and delegates work between agents
2. **🚀 CI/CD Agent** - Handles deployment pipelines, automation, and infrastructure
3. **🧪 Tests Agent** - Manages test creation, quality assurance, and validation
4. **✍️ Writer Agent** ⭐ - **Star Feature**: Demonstrates live prompt editing with immediate behavioral changes

### �🎯 **Multi-Agent System**
- **Specialized AI Agents**: Each agent is trained for specific development tasks
- **Seamless Collaboration**: Agents work together to solve complex problems
- **Real-time Communication**: Chat with agents and get instant responses
- **Context-Aware Assistance**: Agents understand your project structure and codebase

### 🔄 **Dynamic Swarm Selection**
Choose from specialized swarms tailored to your development needs:

- **🌐 WebDevSwarm**: Frontend, Backend, and Orchestrator agents for web development
- **📱 FlutterSwarm**: CI/CD, Tests, and Orchestrator agents for Flutter development
- **📱 MobileSwarm**: Android, iOS, and Orchestrator agents for mobile development
- **🧠 AISwarm**: ML, NLP, and Orchestrator agents for AI/ML projects
- **📊 DataSwarm**: Data Analysis, Database, and Orchestrator agents for data projects

### 🎨 **Modern, Intuitive Interface**
- **Floating Sidebar**: Clean, collapsible panel with glass-morphism design
- **Agent Cards**: Visual representation of each agent with status indicators
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Tool Management**: Enable/disable tools for each agent
- **Configuration Panel**: Customize agents and system settings

### 🛠️ **Agent Capabilities**
Each agent comes with specialized tools:

- **Code Analysis**: Analyze code for best practices and potential issues
- **Task Delegation**: Intelligent task distribution between agents
- **Progress Tracking**: Monitor task completion across all agents
- **Testing Automation**: Generate and run automated tests
- **CI/CD Pipeline**: Set up continuous integration and deployment
- **Dependency Management**: Handle package dependencies and version conflicts

## 🚀 Getting Started (Demo)

### 🎭 **Demo Experience**
1. **Install the Extension**: Load the extension in VS Code development mode
2. **Open the Panel**: Click the robot icon in the Activity Bar or use `Ctrl+Shift+P` → "Open MultiAgent Swarm"
3. **Try the Demo Features**:
   - **Chat with agents**: Ask questions and get contextual responses
   - **Request a project**: Try "make me a basic notes app" to see multi-agent coordination
   - **Edit prompts**: Select Writer Agent → Config → Edit system prompt → See instant changes
   - **Watch activity logs**: Observe real-time agent collaboration

### 🎪 **Demo Scenarios to Try**
- **"Create a basic notes app"** - Watch all 4 agents collaborate on project creation
- **"Help me with testing"** - See Tests Agent provide specialized responses
- **Edit Writer Agent prompt** - Add keywords like "casual", "technical", or "creative" to see behavioral changes
- **Switch between agents** - Notice how each agent has specialized knowledge and responses

## 🚀 Getting Started

1. **Install the Extension**: Search for "MultiAgent Swarm" in VS Code Extensions
2. **Open the Panel**: Click the robot icon in the Activity Bar or use `Ctrl+Shift+P` → "Open MultiAgent Swarm"
3. **Select Your Swarm**: Choose the appropriate swarm for your project type
4. **Start Chatting**: Interact with your AI agents in real-time

## 🏃 How to Run

### 🎭 For Demo (ycdemo Branch)
This demo branch runs without requiring API keys or external services:

1. **Clone Demo Branch**:
   ```bash
   git clone <repository-url>
   git checkout ycdemo
   cd MAS-vscode-extension
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Compile Extension**:
   ```bash
   npm run compile
   ```

4. **Run Demo**:
   - Open the project in VS Code
   - Press `F5` to launch extension in debug mode
   - A new VS Code window opens with the demo extension loaded
   - Click the robot icon 🤖 in the Activity Bar to start

### For Users (Published Extension)
1. **Install from VS Code Marketplace**:
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "MultiAgent Swarm"
   - Click "Install"

2. **Access the Extension**:
   - Click the robot icon 🤖 in the Activity Bar (left sidebar)
   - Or use Command Palette (`Ctrl+Shift+P`) → "Open MultiAgent Swarm"

### For Developers (Running from Source)

#### Prerequisites
- **Node.js**: Version 16.x or higher
- **VS Code**: Version 1.74.0 or higher
- **Git**: For cloning the repository

#### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd MAS-vscode-extension-development
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run compile
   ```

4. **Run in Development Mode**:
   - Open the project in VS Code
   - Press `F5` or go to `Run > Start Debugging`
   - This opens a new VS Code window with the extension loaded

5. **Watch Mode (for development)**:
   ```bash
   npm run watch
   ```
   - Automatically recompiles on file changes
   - Useful during development

#### Development Workflow

1. **Make Changes**: Edit source files in `src/` directory
2. **Compile**: Run `npm run compile` or use watch mode
3. **Test**: Press `F5` to launch extension in debug mode
4. **Debug**: Use VS Code's debugging tools to inspect extension behavior

#### Building for Distribution

1. **Install vsce** (VS Code Extension Manager):
   ```bash
   npm install -g vsce
   ```

2. **Package the Extension**:
   ```bash
   vsce package
   ```
   - Creates a `.vsix` file for distribution

3. **Install Local Package**:
   ```bash
   code --install-extension multiagent-swarm-1.0.0.vsix
   ```

#### File Structure
```
MAS-vscode-extension/
├── src/
│   └── extension.ts          # Main extension code
├── media/
│   ├── webview.html         # Main UI interface (unused in demo)
│   ├── multiagent-swarm-ui.html  # Demo interface with full functionality
│   └── icon.svg             # Extension icon
├── package.json             # Extension manifest
├── tsconfig.json           # TypeScript configuration
├── DEMO_FEATURES.md        # Demo features documentation
├── PROMPT_EDITING_GUIDE.md # Guide for prompt editing demo
└── README.md               # This file
```

## 🎭 Demo Documentation

### Additional Demo Resources
- **📋 DEMO_FEATURES.md** - Comprehensive overview of all demo features
- **📝 PROMPT_EDITING_GUIDE.md** - Step-by-step guide for the prompt editing demonstration
- **🎯 Interactive Examples** - Built-in examples for testing agent responses

## 💻 Commands

- `MultiAgent Swarm: Open Panel` - Open the main agent interface
- `MultiAgent Swarm: Toggle Panel` - Toggle the agent panel visibility

## ⚙️ Configuration

### Agent Settings
- **Agent Name**: Customize individual agent names
- **System Prompt**: Define agent behavior and capabilities
- **LLM Provider**: Choose between OpenAI GPT-4, GPT-3.5, Claude, or local LLMs
- **Collaboration Rules**: Set up how agents interact with each other

### Tool Configuration
Enable or disable tools for each agent:
- Code Analysis
- Task Delegation
- Progress Tracking
- Dependency Resolution
- Testing Automation
- CI/CD Pipeline

## 🎯 Use Cases

### **Web Development**
- Frontend agent handles UI/UX development
- Backend agent manages server and API development
- Orchestrator coordinates between agents

### **Mobile Development**
- Android agent specializes in Android development
- iOS agent focuses on iOS development
- Orchestrator manages cross-platform coordination

### **AI/ML Projects**
- ML agent handles machine learning tasks
- NLP agent specializes in natural language processing
- Orchestrator coordinates AI workflow

## 🔧 Technical Requirements

- **VS Code Version**: 1.74.0 or higher
- **Node.js**: Version 16.x or higher
- **TypeScript**: 4.9.4 or higher

## 📱 Interface Overview

### Sidebar Features
- **Collapsible Design**: Expandable/collapsible sidebar with smooth animations
- **Swarm Selector**: Dropdown to switch between different agent swarms
- **Agent Cards**: Visual cards showing agent status and capabilities
- **Status Footer**: Live status of active swarm and system health

### Chat Interface
- **Real-time Messaging**: Instant communication with AI agents
- **Message History**: Persistent chat history across sessions
- **Typing Indicators**: Visual feedback when agents are responding
- **Multi-agent Responses**: Coordinated responses from multiple agents

## 🐛 Known Issues

- Large codebases may require longer initial analysis time
- Some LLM providers may have rate limits that affect response times
- Complex multi-agent coordination may occasionally require manual intervention

## 📝 Release Notes

### ycdemo Branch (Demo Version)
- **🎭 Full Demo Implementation**: Complete simulation of multi-agent collaboration
- **✨ Interactive Prompt Engineering**: Live demonstration of how prompt changes affect behavior
- **📝 Writer Agent Showcase**: Specialized agent with 4 tool categories
- **🔄 Multi-Agent Project Workflows**: Coordinated responses for complex requests
- **📊 Real-Time Activity Logging**: Live updates showing agent coordination
- **💬 Contextual Response System**: Intelligent responses without API dependencies
- **🎨 Professional UI**: Glass-morphism design with smooth animations
- **⚡ Realistic Timing**: Simulated processing delays for believable interactions

### 1.0.0
- Initial release of MultiAgent Swarm
- Core multi-agent system with 5 specialized swarms
- Real-time chat interface with AI agents
- Collapsible sidebar with modern glass-morphism design
- Tool management and configuration system
- Agent collaboration and task delegation

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

This extension is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check our wiki for detailed guides
- **Community**: Join our Discord server for support and discussions

---

**Enjoy building with AI agents! 🚀**
>>>>>>> temp-work
