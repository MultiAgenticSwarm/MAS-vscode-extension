import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('multiAgentSwarm.openPanel', () => {
      const panel = vscode.window.createWebviewPanel(
        'multiAgentSwarm',
        'MultiAgenticSwarm',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
        }
      );

      const htmlPath = path.join(context.extensionPath, 'media', 'multiagent-swarm-ui.html');
      let html = fs.readFileSync(htmlPath, 'utf8');

      // Allow the HTML to talk back to VS Code
      html = html.replace('</head>', `
        <script>
          const vscode = acquireVsCodeApi();
        </script>
      </head>`);

      panel.webview.html = html;

      panel.webview.onDidReceiveMessage(
        async message => {
          if (message.command === 'sendToPython') {
            const result = await runPythonScript(message.payload);
            panel.webview.postMessage({ command: 'pythonResult', data: result });
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

function runPythonScript(input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`python3 my_script.py "${input}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject('Python error');
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

export function deactivate() {}
