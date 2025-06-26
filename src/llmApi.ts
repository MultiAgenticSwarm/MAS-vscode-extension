import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export async function getAIResponse(prompt: string, code: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is not set in your .env file.');
    return '⚠️ Error: Missing OpenAI API Key.';
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an AI code assistant.' },
          { role: 'user', content: `Here is some code:\n${code}\n\n${prompt}` }
        ]
      })
    });

    const json = await res.json() as {
  choices: {
    message: {
      content: string;
    };
  }[];
};

    return json.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Error calling OpenAI API:', error);
    return 'Failed to fetch response from OpenAI.';
  }
}
