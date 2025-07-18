

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
    ]
  }),
})
.then(res => {
  console.log('Raw Response Object:', res);
  return res.json(); // Continue parsing the JSON body
})
.then(data => {
  console.log( data);
})
