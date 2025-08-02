import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"
import { generateSwarmWithAI, generateToolWithAI, generateAgentWithAI, generateSuggestions } from './llmApi'

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
        case "generateSwarmWithAI":
          handleGenerateSwarmWithAI(panel, message.data)
          return
        case "generateToolWithAI":
          handleGenerateToolWithAI(panel, message.data)
          return
        case "generateAgentWithAI":
          handleGenerateAgentWithAI(panel, message.data)
          return
        case "generateAISuggestions":
          handleGenerateAISuggestions(panel, message.data)
          return
        case "addCustomTool":
          vscode.window.showInformationMessage(`Custom tool "${message.data.name}" added to ${message.data.agentId}`)
          return
        case "deleteCustomTool":
          vscode.window.showInformationMessage(`Custom tool "${message.data.toolName}" removed`)
          return
        case "createCustomSwarm":
          vscode.window.showInformationMessage(`Custom swarm "${message.data.name}" created successfully!`)
          return
        case "getCodeContext":
          handleGetCodeContext(panel)
          return
        case "sendEnhancedMessage":
          handleEnhancedMessage(panel, message.data)
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

// AI Handler Functions
async function handleGenerateSwarmWithAI(panel: vscode.WebviewPanel | undefined, data: any) {
  if (!panel) return
  
  try {
    vscode.window.showInformationMessage('🤖 Generating swarm with AI...')
    
    const swarmData = await generateSwarmWithAI(data.prompt)
    
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'swarmGenerated',
      data: { swarm: swarmData }
    })
  } catch (error) {
    console.error('Error generating swarm:', error)
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'swarmGenerated',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
}

async function handleGenerateToolWithAI(panel: vscode.WebviewPanel | undefined, data: any) {
  if (!panel) return
  
  try {
    vscode.window.showInformationMessage('🤖 Generating tool with AI...')
    
    const toolData = await generateToolWithAI(data.prompt)
    
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'toolGenerated',
      data: { tool: toolData }
    })
  } catch (error) {
    console.error('Error generating tool:', error)
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'toolGenerated',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
}

async function handleGenerateAgentWithAI(panel: vscode.WebviewPanel | undefined, data: any) {
  if (!panel) return
  
  try {
    vscode.window.showInformationMessage('🤖 Generating agent with AI...')
    
    const agentData = await generateAgentWithAI(data.prompt)
    
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'agentGenerated',
      data: { agent: agentData }
    })
  } catch (error) {
    console.error('Error generating agent:', error)
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'agentGenerated',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
}

async function handleGenerateAISuggestions(panel: vscode.WebviewPanel | undefined, data: any) {
  if (!panel) return
  
  try {
    const suggestions = await generateSuggestions(data.context, data.currentSwarm)
    
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'suggestionsGenerated',
      data: { suggestions }
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    panel.webview.postMessage({
      command: 'aiResponse',
      type: 'suggestionsGenerated',
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    })
  }
}

async function handleGetCodeContext(panel: vscode.WebviewPanel | undefined) {
  if (!panel) return

  try {
    const activeEditor = vscode.window.activeTextEditor
    if (activeEditor) {
      const document = activeEditor.document
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
      }

      panel.webview.postMessage({
        command: 'codeContextReceived',
        data: { context: codeContext }
      })
    } else {
      panel.webview.postMessage({
        command: 'codeContextReceived',
        data: { context: null, message: 'No active file found' }
      })
    }
  } catch (error) {
    console.error('Error getting code context:', error)
  }
}

async function handleEnhancedMessage(panel: vscode.WebviewPanel | undefined, data: any) {
  if (!panel) return

  try {
    let prompt = data.message
    
    if (data.includeContext) {
      const activeEditor = vscode.window.activeTextEditor
      if (activeEditor) {
        const document = activeEditor.document
        const fileName = path.basename(document.fileName)
        const language = document.languageId
        const code = document.getText()
        
        prompt = `Context: Working on file "${fileName}" (${language})\n\nCode:\n${code}\n\nUser question: ${data.message}`
      }
    }

    // Use existing AI response function or create a mock response
    const response = await generateAIResponseForChat(prompt)
    
    panel.webview.postMessage({
      command: 'aiChatResponse',
      data: { 
        response: response,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error handling enhanced message:', error)
  }
}

async function generateAIResponseForChat(prompt: string): Promise<string> {
  try {
    const { getAIResponse } = await import('./llmApi')
    return await getAIResponse(prompt)
  } catch (error) {
    console.error('Error generating AI chat response:', error)
    return 'I apologize, but I encountered an error processing your request. Please make sure your OpenAI API key is configured correctly.'
  }
}

export function deactivate() {}