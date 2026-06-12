// Chatbot Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Chatbot UI into the body
    const chatHTML = `
        <div class="chat-widget" id="chatWidget">
            <!-- Chat Window -->
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-header-icon">
                        <i class="ph-fill ph-robot"></i>
                    </div>
                    <div class="chat-header-info">
                        <h3>KARSAKAH AI</h3>
                        <p>Ask me about your farm!</p>
                    </div>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="chat-message bot">
                        Hello! I'm KARSAKAH AI. How can I help you and your farm today?
                    </div>
                    
                    <div class="typing-indicator" id="typingIndicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>

                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Type your question..." aria-label="Type message">
                    <button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
                        <i class="ph-bold ph-paper-plane-right"></i>
                    </button>
                </div>
            </div>

            <!-- Floating Toggle Button -->
            <button class="chat-toggle" id="chatToggleBtn" aria-label="Toggle Chat">
                <img src="assets/chatbot.png" alt="Chat" class="chat-icon-img">
                <i class="ph-bold ph-x"></i>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // 2. DOM Elements
    const chatWidget = document.getElementById('chatWidget');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');

    // Array to keep track of conversation history for the AI
    let conversationHistory = [];

    // 3. Event Listeners
    chatToggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
        }
    });

    chatSendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // 4. Main Chat Logic
    async function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // Clear input and disable
        chatInput.value = '';
        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        // Add User Message to UI and History
        addMessageToUI(messageText, 'user');
        conversationHistory.push({ role: 'user', content: messageText });

        // Show typing indicator
        showTyping(true);

        try {
            // Call the Flask Backend
            const response = await fetch('http://127.0.0.1:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            const data = await response.json();

            // Hide typing indicator
            showTyping(false);

            if (response.ok) {
                // Add AI Reply to UI and History
                addMessageToUI(data.reply, 'bot');
                conversationHistory.push({ role: 'assistant', content: data.reply });
            } else {
                addMessageToUI("Sorry, I'm having trouble connecting to the server. " + (data.error || ""), 'bot');
            }

        } catch (error) {
            console.error('Chat API Error:', error);
            showTyping(false);
            addMessageToUI("Network error: Could not connect to the remote server. Please try again later.", 'bot');
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();
        }
    }

    // 5. Utility Functions
    function addMessageToUI(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.textContent = text;
        
        // Insert before the typing indicator
        chatMessages.insertBefore(msgDiv, typingIndicator);
        scrollToBottom();
    }

    function showTyping(show) {
        if (show) {
            typingIndicator.style.display = 'block';
            scrollToBottom();
        } else {
            typingIndicator.style.display = 'none';
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
