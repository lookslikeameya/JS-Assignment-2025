

const apiKey = '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';

fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'mistralai/mistral-small-3.2-24b-instruct:free',
    messages: [
      { role: 'user', content: 'What is the capital of France?' }
    ],
    max_tokens: 500
  }),
})
.then(res => {
  console.log('Raw Response Object:', res);
  return res.json(); // Continue parsing the JSON body
})
.then(data => {
  console.log('Parsed JSON:', data);
})
