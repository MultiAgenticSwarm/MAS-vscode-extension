import * as vscode from 'vscode';
import { getAIResponse } from './llmApi';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    view: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    this._view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')]
    };

    const scriptUri = view.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.js')
    );

    view.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chat</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 0; }
    #messages { padding: 1rem; overflow-y: auto; height: 85vh; }
    #inputArea { display: flex; padding: 1rem; }
    input { flex: 1; padding: 0.5rem; }
    button { padding: 0.5rem 1rem; }
  </style>
</head>
<body>
  <div id="messages"></div>
  <div id="inputArea">
    <input id="input" placeholder="Ask something..." />
    <button onclick="send()">Send</button>
  </div>
  <script src="${scriptUri}"></script>
</body>
</html>`;

    view.webview.onDidReceiveMessage(async msg => {
      if (msg.type === 'ask') {
        const editor = vscode.window.activeTextEditor;
        const code = editor?.document.getText() || '';
        const answer = await getAIResponse(msg.prompt, code);
        view.webview.postMessage({ type: 'reply', answer });
      }
    });
  }
}