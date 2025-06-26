declare function acquireVsCodeApi(): {
  postMessage: (message: any) => void;
};

const vscode = typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : {
  postMessage: () => {}
};
function send() {
  const input = document.getElementById('input') as HTMLInputElement;
  vscode.postMessage({ type: 'ask', prompt: input.value });
  appendMessage(`🧑‍💻 You: ${input.value}`);
  input.value = '';
}

window.addEventListener('message', event => {
  const message = event.data;
  if (message.type === 'reply') {
    appendMessage(`🤖 AI: ${message.answer}`);
  }
});

function appendMessage(content: string) {
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = content;
  container?.appendChild(div);
  container?.scrollTo(0, container.scrollHeight);
} 