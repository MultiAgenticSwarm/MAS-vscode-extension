import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('multiagent-swarm-ui.open', () => {
    const panel = vscode.window.createWebviewPanel(
      'multiagentSwarm',
      'MultiAgenticSwarm',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
      }
    );

    const htmlPath = path.join(context.extensionPath, 'media', 'multiagent-swarm-ui.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    panel.webview.html = htmlContent;
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
