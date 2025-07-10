const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

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
        msg.innerHTML = `<strong>${role}:</strong><div class="ai-message">${marked.parse(content)}</div>`;
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

function sendMessage(prompt, model) {
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model })
    })
        .then(res => res.json())
        .then(data => {
            const reply = data.choices[0].message.content || "No response from AI.";
            appendMessage('AI', reply);
        })
        
}