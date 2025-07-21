
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');
const newChatBtn = document.getElementById('new-chat-btn');

function markdown(markdown) {
  return markdown
  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h1>$1</h1>')
    .replace(/^### (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/\n/g, '<br>');

  
}

loadChatHistory();

sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    const model = modelSelect.value;

    

    appendMessage('User', message);
    userInput.value = '';

    sendMessage(message, model);
});

function appendMessage(role, content) {
    const msg = document.createElement('div');
    if (role === 'AI') {
        msg.innerHTML = `<strong>${role}:</strong><div>${markdown(content)}</div>`;
    } else {
        msg.innerHTML = `<strong>${role}:</strong> ${content}`;
    }
    chatHistory.appendChild(msg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    saveChatHistory();
}


function saveChatHistory() {
    localStorage.setItem('chatHistory', chatHistory.innerHTML);
}

function loadChatHistory() {
    chatHistory.innerHTML = localStorage.getItem('chatHistory') || '';
}

async function sendMessage(prompt, model) {
   

    const apiKey='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';
   

    let aiMessage = document.createElement('div');
    aiMessage.innerHTML = `<strong>AI:</strong><div class="ai-message"></div>`;
    chatHistory.appendChild(aiMessage);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({
            model: "mistralai/mistral-small-3.2-24b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            stream: true
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let reply = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (let line of lines) {
            if (line.startsWith('data: ')) {
                const json = line.replace('data: ', '').trim();
                if (json === '[DONE]') break;

                try {
                    const content = JSON.parse(json).choices[0]?.delta?.content;
                    if (content) {
                        reply += content;
                        aiMessage.querySelector('.ai-message').innerHTML = markdown(reply);
                        chatHistory.scrollTop = chatHistory.scrollHeight;
                    }
                } catch (e) {
                    console.error("Parse error:", e);
                }
            }
        }
    }

    saveChatHistory();
}
