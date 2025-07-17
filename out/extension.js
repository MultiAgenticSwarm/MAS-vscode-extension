"use strict";
<<<<<<< HEAD
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('multiagent-swarm-ui.open', () => {
        const panel = vscode.window.createWebviewPanel('multiagentSwarm', 'MultiAgenticSwarm', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
        });
        const htmlPath = path.join(context.extensionPath, 'media', 'multiagent-swarm-ui.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        panel.webview.html = htmlContent;
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
=======
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
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
        }
        else {
            createOrShowPanel(context);
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
                return;
            case "updateAgent":
                console.log("Agent updated:", message.data);
                return;
            case "toggleTool":
                console.log("Tool toggled:", message.data);
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
        webviewView.webview.html = getWebviewContent(webviewView.webview, this.context.extensionUri);
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
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
function deactivate() { }
exports.deactivate = deactivate;
>>>>>>> temp-work
//# sourceMappingURL=extension.js.map