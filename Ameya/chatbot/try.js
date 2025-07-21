

const apiKey = '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';

const question = 'How would you build the tallest building ever?';
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'mistralai/mistral-small-3.2-24b-instruct:free',
    messages: [{ role: 'user', content: question }],
    stream: true,
  }),
});

const reader = response.body?.getReader();
if (!reader) {
  throw new Error('Response body is not readable');
}

const decoder = new TextDecoder();
let buffer = '';

try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Append new chunk to buffer
    buffer += decoder.decode(value, { stream: true });

    // Process complete lines from buffer
    while (true) {
      const lineEnd = buffer.indexOf('\n');
      if (lineEnd === -1) break;

      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);

      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0].delta.content;
          if (content) {
            console.log(content);
          }
        } catch (e) {
          // Ignore invalid JSON
        }
      }
    }
  }
} finally {
  reader.cancel();
}

