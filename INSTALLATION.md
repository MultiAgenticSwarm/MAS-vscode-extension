# Installation Guide

## Method 1: Install from .vsix file (Recommended for testing)

1. **Download the Extension**:
   - Download `multiagent-swarm-1.0.0.vsix` from the releases

2. **Install in VS Code**:
   ```bash
   # Option A: Command line
   code --install-extension multiagent-swarm-1.0.0.vsix
   
   # Option B: VS Code UI
   # 1. Open VS Code
   # 2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   # 3. Type "Extensions: Install from VSIX"
   # 4. Select the downloaded .vsix file
   ```

3. **Verify Installation**:
   - Look for the robot icon 🤖 in the Activity Bar (left sidebar)
   - Or press `Ctrl+Shift+P` and type "MultiAgent Swarm"

## Method 2: Development Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/MultiAgenticSwarm/MAS-vscode-extension.git
   cd MAS-vscode-extension
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
   - Press `F5` to launch Extension Development Host
   - Test the extension in the new VS Code window

## Method 3: VS Code Marketplace (Coming Soon)

1. **Install from Marketplace**:
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "MultiAgent Swarm"
   - Click "Install"

## Usage

1. **Open the Extension**:
   - Click the robot icon 🤖 in Activity Bar
   - Or use `Ctrl+Shift+A` keyboard shortcut

2. **Select a Swarm**:
   - Choose from WebDev, Flutter, Mobile, AI, or Data swarms
   - Each swarm has specialized agents for different tasks

3. **Start Collaborating**:
   - Chat with agents in real-time
   - Configure agent settings and tools
   - Monitor agent collaboration in the activity panel

## Keyboard Shortcuts

- `Ctrl+Shift+A` (`Cmd+Shift+A` on Mac) - Open MultiAgent Swarm
- `Ctrl+Alt+A` (`Cmd+Alt+A` on Mac) - Toggle MultiAgent Swarm Panel

## Troubleshooting

### Extension Not Visible
- Ensure VS Code version is 1.74.0 or higher
- Restart VS Code after installation
- Check Extensions panel for any error messages

### Installation Issues
- Try installing with `--force` flag: `code --install-extension multiagent-swarm-1.0.0.vsix --force`
- Verify the .vsix file is not corrupted
- Check VS Code permissions

### Performance Issues
- Close and reopen the MultiAgent Swarm panel
- Restart VS Code
- Check system resources

## Uninstallation

1. **From VS Code**:
   - Go to Extensions (`Ctrl+Shift+X`)
   - Find "MultiAgent Swarm"
   - Click the gear icon → "Uninstall"

2. **Command Line**:
   ```bash
   code --uninstall-extension MultiAgenticSwarm.multiagent-swarm
   ```

## Support

- 📚 [Documentation](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/wiki)
- 🐛 [Report Issues](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/issues)
- 💬 [Discussions](https://github.com/MultiAgenticSwarm/MAS-vscode-extension/discussions)
