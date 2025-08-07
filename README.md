# MultiAgent Swarm VS Code Extension

<p align="center">
  <img src="media/icon.png" alt="MultiAgent Swarm Logo" width="128" height="128">
</p>

<p align="center">
  <strong>🤖 AI-Powered Multi-Agent Development Assistant</strong>
</p>

<p align="center">
  Transform your VS Code development experience with intelligent AI agents that collaborate seamlessly to accelerate your coding workflow.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/VS%20Code-1.74.0+-blueviolet?style=for-the-badge&logo=visual-studio-code" alt="VS Code Version">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

---

## ✨ Features

### 🎯 **Multi-Agent System**
- **Specialized AI Agents**: Each agent is trained for specific development tasks
- **Seamless Collaboration**: Agents work together to solve complex problems  
- **Real-time Communication**: Chat with agents and get instant responses
- **Context-Aware Assistance**: Agents understand your project structure and codebase

### 🔄 **Dynamic Swarm Selection**
Choose from specialized swarms tailored to your development needs:

| Swarm | Agents | Use Case |
|-------|--------|----------|
| 🌐 **WebDevSwarm** | Frontend, Backend, Orchestrator | Web development projects |
| 📱 **FlutterSwarm** | CI/CD, Tests, Orchestrator | Flutter app development |
| 📱 **MobileSwarm** | Android, iOS, Orchestrator | Native mobile development |
| 🧠 **AISwarm** | ML, NLP, Orchestrator | AI/ML projects |
| 📊 **DataSwarm** | Data Analysis, Database, Orchestrator | Data science projects |

### 🎨 **Modern, Intuitive Interface**
- **Floating Sidebar**: Clean, collapsible panel with glass-morphism design
- **Agent Cards**: Visual representation of each agent with status indicators
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Tool Management**: Enable/disable tools for each agent
- **Configuration Panel**: Customize agents and system settings
- **Theme Support**: Light, Dark, and System theme options

### 🛠️ **Agent Capabilities**
Each agent comes with specialized tools:

- **Code Analysis**: Analyze code for best practices and potential issues
- **Task Delegation**: Intelligent task distribution between agents
- **Progress Tracking**: Monitor task completion across all agents
- **Testing Automation**: Generate and run automated tests
- **CI/CD Pipeline**: Set up continuous integration and deployment
- **Dependency Management**: Handle package dependencies and version conflicts

## 🚀 Quick Start

### 📦 Installation Options

#### Option 1: Install from .vsix File (Current)
```bash
# Download the extension package
# Then install using VS Code
code --install-extension multiagent-swarm-1.0.0.vsix

# Or install via VS Code UI:
# 1. Open VS Code
# 2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
# 3. Type "Extensions: Install from VSIX"
# 4. Select the downloaded .vsix file
```

#### Option 2: Development Installation
```bash
# Clone and setup for development
git clone https://github.com/MultiAgenticSwarm/MAS-vscode-extension.git
cd MAS-vscode-extension
npm install
npm run compile

# Test in VS Code
# 1. Open project in VS Code
# 2. Press F5 to launch Extension Development Host
# 3. Test in the new VS Code window
```

### 🎯 First Steps
1. **Launch Extension**: Click the robot icon 🤖 in the Activity Bar (left sidebar)
2. **Select Your Swarm**: Choose the appropriate swarm for your project type
3. **Configure Agents**: Customize agent settings and enable relevant tools
4. **Start Collaborating**: Chat with agents and delegate tasks
5. **Monitor Progress**: Watch agents work together in real-time

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+A` (`Cmd+Shift+A` on Mac) - Open MultiAgent Swarm
- `Ctrl+Alt+A` (`Cmd+Alt+A` on Mac) - Toggle MultiAgent Swarm Panel
- `Ctrl+/` (`Cmd+/` on Mac) - Focus chat input (when panel is open)

## 📖 Usage Examples

### Web Development
```
You: "Create a React component for user authentication"

Frontend Agent: "I'll create a modern login component with form validation..."
Backend Agent: "I'll set up the authentication API endpoints..."  
Orchestrator: "Coordinating the frontend and backend implementation..."
```

### Mobile Development
```
You: "Set up CI/CD pipeline for my Flutter app"

CI/CD Agent: "Configuring GitHub Actions for Flutter..."
Tests Agent: "Setting up automated testing pipeline..."
Orchestrator: "Pipeline ready! Here's your complete setup..."
```

## ⚙️ Configuration

### Agent Settings
- **System Prompts**: Customize how agents behave
- **LLM Providers**: Choose your preferred AI model
- **Response Timeouts**: Control agent response times
- **Collaboration Rules**: Define inter-agent communication

### Tool Management
- **Development Tools**: Code analysis, dependency management
- **Testing Tools**: Quality assurance and validation
- **Management Tools**: Task coordination and tracking
- **Deployment Tools**: CI/CD and release management

## 🎯 Supported Project Types

- ✅ **Web Applications** (React, Vue, Angular, etc.)
- ✅ **Mobile Apps** (Flutter, React Native, iOS, Android)
- ✅ **Backend Services** (Node.js, Python, Java, etc.)
- ✅ **AI/ML Projects** (TensorFlow, PyTorch, etc.)
- ✅ **Data Science** (Pandas, NumPy, Jupyter, etc.)
- ✅ **DevOps & CI/CD** (Docker, Kubernetes, GitHub Actions)

## 🔧 Development & Testing

### 📋 Prerequisites
- **Node.js**: Version 16.x or higher
- **VS Code**: Version 1.74.0 or higher
- **Git**: For cloning and version control

### 🛠️ Development Setup
```bash
# Clone repository
git clone https://github.com/MultiAgenticSwarm/MAS-vscode-extension.git
cd MAS-vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile
```

### 🧪 Testing Methods

#### Method 1: Development Mode (Recommended)
```bash
1. npm run compile          # Compile changes
2. code .                   # Open project in VS Code
3. Press F5                 # Launch Extension Development Host
4. Test in new window       # Look for robot icon 🤖
```

#### Method 2: Watch Mode (For continuous development)
```bash
npm run watch              # Auto-compiles on file changes
# Then use F5 in VS Code for testing
```

#### Method 3: Package Installation (For final testing)
```bash
npm run compile            # Compile changes
vsce package              # Create new .vsix
code --install-extension multiagent-swarm-1.0.0.vsix --force
# Restart VS Code to see changes
```

### 📦 Building for Distribution
```bash
# Install VS Code Extension Manager
npm install -g @vscode/vsce

# Package the extension
vsce package

# Install local package
code --install-extension multiagent-swarm-1.0.0.vsix
```

### 🏗️ Project Structure
```
MAS-vscode-extension/
├── 📄 package.json                 # Extension manifest
├── 📄 README.md                   # Project documentation  
├── 📄 CHANGELOG.md               # Version history
├── 📄 LICENSE                    # MIT License
├── 📄 .vscodeignore             # Package exclusions
├── 📄 tsconfig.json             # TypeScript config
├── 📄 release.sh                # Release automation
├── 📁 src/
│   └── 📄 extension.ts          # Main extension code
├── 📁 media/
│   ├── 🖼️ icon.png              # Extension icon
│   ├── 🖼️ icon.svg              # Activity bar icon
│   └── 📄 webview.html          # UI implementation
├── 📁 out/                      # Compiled JavaScript
└── 📁 releases/                 # Distribution packages
```

## 📋 System Requirements

- **VS Code**: Version 1.74.0 or higher
- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 16.x or higher (for development only)
- **Memory**: 4GB RAM minimum (8GB recommended for optimal performance)
- **Storage**: 100MB free space for extension and dependencies

## 🎬 Demo & Screenshots

### Main Interface
The extension provides a sleek, modern interface with:
- **Floating Sidebar**: Collapsible agent management panel
- **Real-time Chat**: Interactive conversation with AI agents
- **Agent Cards**: Visual representation of each agent's status
- **Theme Support**: Adapts to your VS Code theme (Light/Dark/System)

### Available Commands
Access via Command Palette (`Ctrl+Shift+P`):
- `MultiAgent Swarm: Open Panel`
- `MultiAgent Swarm: Toggle Panel`
- `MultiAgent Swarm: Select Agent Swarm`
- `MultiAgent Swarm: Create New Agent`

## 🔍 Troubleshooting

### Common Issues

#### Extension Not Visible
- Ensure VS Code version is 1.74.0 or higher
- Restart VS Code after installation
- Check Extensions panel for any error messages

#### Installation Failed
```bash
# Try force installation
code --install-extension multiagent-swarm-1.0.0.vsix --force

# Or uninstall first, then reinstall
code --uninstall-extension MultiAgenticSwarm.multiagent-swarm
code --install-extension multiagent-swarm-1.0.0.vsix
```

#### Performance Issues
- Close and reopen the MultiAgent Swarm panel
- Restart VS Code
- Check system resources and close unnecessary applications

### Getting Help
- 📚 [Documentation](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/wiki)
- 🐛 [Report Issues](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/issues)
- 💬 [Discussions](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/discussions)

## 🐛 Known Issues & Limitations

### Current Version (1.0.0)
- ⚠️ **Demo Mode**: AI responses are currently simulated for demonstration purposes
- ⚠️ **Mock Interactions**: Agent collaboration is showcased with predefined responses
- ⚠️ **No Live AI**: Real AI integration planned for future releases
- ⚠️ **Limited Persistence**: Some settings may reset between VS Code sessions

### Planned Improvements
- 🔮 **Real AI Integration**: Connect to OpenAI, Claude, and other LLM providers
- 🔮 **Persistent Storage**: Save agent configurations and chat history
- 🔮 **Cloud Sync**: Synchronize settings across devices
- 🔮 **Plugin System**: Allow third-party agent extensions

See [GitHub Issues](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/issues) for the complete list and to report new issues.

## 🚀 Roadmap & Future Features

### Version 1.1.0 (Coming Soon)
- [ ] Real AI provider integration (OpenAI, Anthropic)
- [ ] Persistent agent configurations
- [ ] Enhanced collaboration workflows
- [ ] Performance optimizations

### Version 1.2.0
- [ ] Voice interface for agent communication
- [ ] Visual workflow designer
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

### Version 2.0.0
- [ ] Agent marketplace and sharing
- [ ] Custom agent training
- [ ] Enterprise features
- [ ] API integrations

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🔄 Ways to Contribute
- 🐛 **Report Bugs**: Use GitHub Issues to report problems
- 💡 **Suggest Features**: Share your ideas for new functionality
- 📝 **Improve Documentation**: Help make our docs clearer
- 🔧 **Submit Code**: Fix bugs or implement new features
- 🎨 **Design Improvements**: Enhance UI/UX design

### 📋 Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📏 Guidelines
- Follow TypeScript best practices
- Maintain code formatting with ESLint
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📊 Project Stats

- **Total Lines of Code**: ~3,500+ lines
- **Main Technologies**: TypeScript, HTML, CSS, VS Code API
- **Package Size**: ~59KB optimized
- **Supported Platforms**: Windows, macOS, Linux
- **Development Time**: Ongoing since 2025

## 🏆 Acknowledgments

### 🙏 Special Thanks
- **VS Code Team**: For the excellent extension API
- **TypeScript Community**: For robust typing and tooling
- **Open Source Contributors**: For inspiration and best practices
- **Beta Testers**: For valuable feedback and bug reports

### 🔧 Built With
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [VS Code Extension API](https://code.visualstudio.com/api) - Editor integration
- [ESLint](https://eslint.org/) - Code quality and consistency
- [Node.js](https://nodejs.org/) - Runtime environment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links & Resources

### 📖 Documentation
- [Installation Guide](INSTALLATION.md) - Detailed setup instructions
- [Feature Documentation](FEATURES.md) - Complete feature overview
- [Changelog](CHANGELOG.md) - Version history and updates
- [GitHub Wiki](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/wiki) - Comprehensive guides

### 🌐 Community & Support
- [GitHub Repository](https://github.com/MultiAgenticSwarm/MAS-vscode-extension) - Source code and development
- [Issues Tracker](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/issues) - Bug reports and feature requests
- [Discussions](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/discussions) - Community Q&A
- [Releases](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/releases) - Download latest versions

### 📄 Legal & Licensing
- [MIT License](LICENSE) - Open source licensing terms
- [Code of Conduct](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/blob/main/CODE_OF_CONDUCT.md) - Community guidelines
- [Contributing Guidelines](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/blob/main/CONTRIBUTING.md) - How to contribute

---

<p align="center">
  <strong>🎉 Ready to supercharge your development workflow?</strong>
</p>

<p align="center">
  <em>Download the extension and start collaborating with AI agents today!</em>
</p>

<p align="center">
  Made with ❤️ by the <strong>MultiAgenticSwarm</strong> team
</p>

<p align="center">
  <img src="https://img.shields.io/badge/⭐-Star%20us%20on%20GitHub-yellow?style=for-the-badge" alt="Star on GitHub">
</p>
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
MAS-vscode-extension-development/
├── src/
│   └── extension.ts          # Main extension code
├── media/
│   ├── webview.html         # Main UI interface
│   ├── multiagent-swarm-ui.html  # Alternative UI
│   └── icon.svg             # Extension icon
├── package.json             # Extension manifest
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

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
