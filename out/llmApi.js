"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestions = exports.generateAgentWithAI = exports.generateToolWithAI = exports.generateSwarmWithAI = exports.getAIResponse = void 0;
const vscode = require("vscode");
const https = require("https");
async function getAIResponse(prompt, code = '') {
    const config = vscode.workspace.getConfiguration('multiagentSwarm');
    const apiKey = config.get('openaiApiKey') || process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ OpenAI API Key is not configured.');
        return '⚠️ Error: Missing OpenAI API Key. Please configure it in settings.';
    }
    try {
        const requestBody = JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are an AI assistant specialized in software development and multi-agent systems.' },
                { role: 'user', content: code ? `Here is some code:\n${code}\n\n${prompt}` : prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });
        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.choices && json.choices.length > 0) {
                            resolve(json.choices[0].message.content.trim());
                        }
                        else {
                            reject(new Error('No response from OpenAI'));
                        }
                    }
                    catch (error) {
                        reject(new Error('Failed to parse OpenAI response'));
                    }
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(requestBody);
            req.end();
        });
    }
    catch (error) {
        console.error('❌ Error calling OpenAI API:', error);
        return 'Failed to fetch response from OpenAI. Please check your API key and connection.';
    }
}
exports.getAIResponse = getAIResponse;
async function generateSwarmWithAI(prompt) {
    try {
        const response = await getAIResponse(prompt);
        // Try to parse JSON response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
        }
        // If JSON parsing fails, return error
        throw new Error('AI response was not in expected JSON format');
    }
    catch (error) {
        console.error('Error generating swarm with AI:', error);
        throw error;
    }
}
exports.generateSwarmWithAI = generateSwarmWithAI;
async function generateToolWithAI(prompt) {
    try {
        const response = await getAIResponse(prompt);
        // Try to parse JSON response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
        }
        // If JSON parsing fails, return error
        throw new Error('AI response was not in expected JSON format');
    }
    catch (error) {
        console.error('Error generating tool with AI:', error);
        throw error;
    }
}
exports.generateToolWithAI = generateToolWithAI;
async function generateAgentWithAI(prompt) {
    try {
        const response = await getAIResponse(prompt);
        // Try to parse JSON response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (parseError) {
            console.error('Failed to parse AI response as JSON:', parseError);
        }
        // If JSON parsing fails, return error
        throw new Error('AI response was not in expected JSON format');
    }
    catch (error) {
        console.error('Error generating agent with AI:', error);
        throw error;
    }
}
exports.generateAgentWithAI = generateAgentWithAI;
async function generateSuggestions(context, currentSwarm) {
    try {
        const prompt = `Based on the current context (${context}) and active swarm (${currentSwarm}), 
    generate 4-6 practical suggestions for tasks that would be helpful for a development team.
    
    Focus on:
    - Code analysis and improvement
    - Testing and quality assurance  
    - Performance optimization
    - Security review
    - Documentation
    - Deployment and DevOps tasks
    
    Return only a JSON array of strings, each being a concise suggestion (4-8 words max).
    Example: ["Analyze code complexity", "Generate API documentation", "Review security vulnerabilities"]`;
        const response = await getAIResponse(prompt);
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (parseError) {
            console.error('Failed to parse suggestions as JSON:', parseError);
        }
        // Fallback suggestions if AI fails
        return [
            'Analyze current code structure',
            'Generate unit tests',
            'Review security issues',
            'Optimize performance',
            'Update documentation',
            'Check dependency updates'
        ];
    }
    catch (error) {
        console.error('Error generating suggestions:', error);
        // Return fallback suggestions
        return [
            'Analyze current code structure',
            'Generate unit tests',
            'Review security issues',
            'Optimize performance'
        ];
    }
}
exports.generateSuggestions = generateSuggestions;
//# sourceMappingURL=llmApi.js.map