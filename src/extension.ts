import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

let panel: vscode.WebviewPanel | undefined
let isVisible = false

export function activate(context: vscode.ExtensionContext) {
  console.log("MultiAgent Swarm extension is now active!")

  // Set initial context
  vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", false)

  // Register commands
  const openPanelCommand = vscode.commands.registerCommand("multiagentSwarm.openPanel", () => {
    createOrShowPanel(context)
  })

  const togglePanelCommand = vscode.commands.registerCommand("multiagentSwarm.togglePanel", () => {
    if (panel && panel.visible) {
      panel.dispose()
    } else {
      createOrShowPanel(context)
    }
  })

  // Register view provider for the activity bar
  const provider = new MultiAgentSwarmViewProvider(context)
  vscode.window.registerWebviewViewProvider("multiagentSwarm.mainView", provider)

  context.subscriptions.push(openPanelCommand, togglePanelCommand)
}

function createOrShowPanel(context: vscode.ExtensionContext) {
  const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

  if (panel) {
    panel.reveal(columnToShowIn)
    return
  }

  // Create the webview panel
  panel = vscode.window.createWebviewPanel("multiagentSwarm", "MultiAgent Swarm", vscode.ViewColumn.Beside, {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")],
  })

  // Set the icon
  panel.iconPath = {
    light: vscode.Uri.joinPath(context.extensionUri, "media", "icon.svg"),
    dark: vscode.Uri.joinPath(context.extensionUri, "media", "icon.svg"),
  }

  // Set the HTML content
  panel.webview.html = getWebviewContent(panel.webview, context.extensionUri)

  // Handle panel disposal
  panel.onDidDispose(
    () => {
      panel = undefined
      isVisible = false
      vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", false)
    },
    null,
    context.subscriptions,
  )

  // Handle visibility changes
  panel.onDidChangeViewState((e) => {
    isVisible = e.webviewPanel.visible
    vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", isVisible)
  })

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    (message) => {
      switch (message.command) {
        case "alert":
          vscode.window.showInformationMessage(message.text)
          return
        case "error":
          vscode.window.showErrorMessage(message.text)
          return
        case "saveConfig":
          vscode.window.showInformationMessage("Configuration saved successfully!")
          return
        case "createAgent":
          vscode.window.showInformationMessage(`Agent "${message.data.name}" created successfully!`)
          return
        case "sendMessage":
          console.log("Message sent:", message.data)
          return
        case "updateAgent":
          console.log("Agent updated:", message.data)
          return
        case "toggleTool":
          console.log("Tool toggled:", message.data)
          return
      }
    },
    undefined,
    context.subscriptions,
  )

  isVisible = true
  vscode.commands.executeCommand("setContext", "multiagentSwarm:panelVisible", true)
}

class MultiAgentSwarmViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "media")],
    }

    webviewView.webview.html = getWebviewContent(webviewView.webview, this.context.extensionUri)

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "openFullPanel":
          createOrShowPanel(this.context)
          return
      }
    })
  }
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  // Read the HTML file
  const htmlPath = path.join(extensionUri.fsPath, "media", "webview.html")
  let html = fs.readFileSync(htmlPath, "utf8")

  // Get the local path to the icon
  const iconUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "icon.svg"))

  // Replace placeholder with actual icon URI
  html = html.replace("{{ICON_URI}}", iconUri.toString())

  return html
}

export function deactivate() {}
