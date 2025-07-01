"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// FILE: extension.ts (in src/)
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('multiAgentSwarm.openPanel', () => {
        const panel = vscode.window.createWebviewPanel('multiAgentSwarm', 'MultiAgenticSwarm', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
        });
        const htmlPath = path.join(context.extensionPath, 'media', 'multiagent-swarm-ui.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        // Allow the HTML to talk back to VS Code
        html = html.replace('</head>', `
        <script>
          const vscode = acquireVsCodeApi();
        </script>
      </head>`);
        panel.webview.html = html;
        panel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            if (message.command === 'sendToPython') {
                const result = yield runPythonScript(message.payload);
                panel.webview.postMessage({ command: 'pythonResult', data: result });
            }
        }), undefined, context.subscriptions);
    }));
}
function runPythonScript(input) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`python3 my_script.py "${input}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                reject('Python error');
            }
            else {
                resolve(stdout.trim());
            }
        });
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map