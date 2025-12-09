(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  function initWidget() {
    // Configuration
    const CONFIG = {
    API_URL: window.location.hostname === 'localhost' ? 'http://localhost:5050' : 'https://askaksha-project.onrender.com',
    SOCKET_URL: window.location.hostname === 'localhost' ? 'http://localhost:5050' : 'https://askaksha-project.onrender.com',
    collegeCode: window.CHATBOT_COLLEGE_CODE || 'GUEST',
  };

  // Create widget styles
  const styles = `
    #chatbot-widget-container * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    #chatbot-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      z-index: 999999;
    }
    
    #chatbot-widget-button:hover {
      transform: scale(1.1);
    }
    
    #chatbot-widget-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    
    #chatbot-widget-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 550px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    
    #chatbot-widget-window.open {
      display: flex;
    }
    
    #chatbot-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 16px 16px 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    #chatbot-header h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
    
    #chatbot-header p {
      font-size: 12px;
      opacity: 0.9;
      margin: 4px 0 0 0;
    }
    
    #chatbot-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    
    #chatbot-close:hover {
      background: rgba(255,255,255,0.3);
    }
    
    #chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f7f9fc;
    }
    
    .chatbot-message {
      margin-bottom: 12px;
      display: flex;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .chatbot-message.user {
      justify-content: flex-end;
    }
    
    .chatbot-message.bot {
      justify-content: flex-start;
    }
    
    .chatbot-message-content {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    
    .chatbot-message.user .chatbot-message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .chatbot-message.bot .chatbot-message-content {
      background: white;
      color: #333;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .chatbot-welcome {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }
    
    .chatbot-welcome svg {
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
      opacity: 0.3;
    }
    
    .chatbot-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: white;
      border-radius: 16px;
      width: fit-content;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .chatbot-typing-dot {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }
    
    .chatbot-typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .chatbot-typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
    
    #chatbot-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
      border-radius: 0 0 16px 16px;
    }
    
    #chatbot-input-form {
      display: flex;
      gap: 8px;
    }
    
    #chatbot-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    
    #chatbot-input:focus {
      border-color: #667eea;
    }
    
    #chatbot-send {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    #chatbot-send:hover {
      transform: scale(1.05);
    }
    
    #chatbot-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    #chatbot-send svg {
      width: 18px;
      height: 18px;
      fill: white;
    }
    
    @media (max-width: 480px) {
      #chatbot-widget-window {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
      
      #chatbot-header {
        border-radius: 0;
      }
      
      #chatbot-input-container {
        border-radius: 0;
      }
    }
  `;

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create widget HTML
  const widgetHTML = `
    <div id="chatbot-widget-container">
      <button id="chatbot-widget-button" aria-label="Open chat">
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>
      
      <div id="chatbot-widget-window">
        <div id="chatbot-header">
          <div>
            <h3>🤖 College Assistant</h3>
            <p>Ask me anything!</p>
          </div>
          <button id="chatbot-close" aria-label="Close chat">✕</button>
        </div>
        
        <div id="chatbot-messages">
          <div class="chatbot-welcome">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            <p>👋 Hi! I'm your college assistant.</p>
            <p style="margin-top: 8px; font-size: 13px;">Ask me about courses, fees, facilities, or anything else!</p>
          </div>
        </div>
        
        <div id="chatbot-input-container">
          <form id="chatbot-input-form">
            <input 
              type="text" 
              id="chatbot-input" 
              placeholder="Type your message..." 
              autocomplete="off"
            />
            <button type="submit" id="chatbot-send" aria-label="Send message">
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Inject widget into page
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = widgetHTML;
  document.body.appendChild(widgetContainer);

  // Widget state
  let isOpen = false;
  let isLoading = false;
  let guestToken = null;
  let chatId = null;
  let socket = null;
  let messages = [];

  // DOM elements
  const button = document.getElementById('chatbot-widget-button');
  const window = document.getElementById('chatbot-widget-window');
  const closeBtn = document.getElementById('chatbot-close');
  const messagesContainer = document.getElementById('chatbot-messages');
  const inputForm = document.getElementById('chatbot-input-form');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');

  // Initialize guest user
  async function initGuestUser() {
    try {
      // Check if guest token exists in localStorage
      const storedToken = localStorage.getItem('chatbot_guest_token');
      const storedChatId = localStorage.getItem('chatbot_chat_id');
      
      if (storedToken && storedChatId) {
        guestToken = storedToken;
        chatId = storedChatId;
        await loadChatHistory();
        initSocket();
        return;
      }

      // Create new guest user
      const response = await fetch(`${CONFIG.API_URL}/api/guest/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeCode: CONFIG.collegeCode })
      });

      const data = await response.json();
      
      if (data.success) {
        guestToken = data.token;
        chatId = data.chatId;
        localStorage.setItem('chatbot_guest_token', guestToken);
        localStorage.setItem('chatbot_chat_id', chatId);
        initSocket();
      } else {
        console.error('Failed to create guest user');
      }
    } catch (error) {
      console.error('Error initializing guest user:', error);
    }
  }

  // Initialize Socket.IO
  function initSocket() {
    if (!window.io) {
      console.error('Socket.IO not loaded yet, waiting...');
      setTimeout(initSocket, 100);
      return;
    }

    socket = window.io(CONFIG.SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('chat-response', (data) => {
      isLoading = false;
      removeTypingIndicator();
      addMessage('bot', data.message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }

  // Load chat history
  async function loadChatHistory() {
    try {
      const response = await fetch(`${CONFIG.API_URL}/api/chat/history?chat=${chatId}`, {
        headers: { 'x-auth-token': guestToken }
      });

      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        messagesContainer.innerHTML = '';
        data.messages.forEach(msg => {
          addMessage(msg.role === 'user' ? 'user' : 'bot', msg.content, false);
        });
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  // Add message to UI
  function addMessage(role, content, save = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    
    // Format message (support basic markdown-like formatting)
    let formatted = content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    contentDiv.innerHTML = formatted;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (save) {
      messages.push({ role, content });
    }
  }

  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.id = 'chatbot-typing';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'chatbot-typing';
    typingContent.innerHTML = `
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
      <div class="chatbot-typing-dot"></div>
    `;
    
    typingDiv.appendChild(typingContent);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingDiv = document.getElementById('chatbot-typing');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  // Send message
  async function sendMessage(message) {
    if (!message.trim() || isLoading || !socket || !guestToken) return;

    addMessage('user', message);
    input.value = '';
    isLoading = true;
    sendBtn.disabled = true;
    
    showTypingIndicator();

    // Send via Socket.IO
    socket.emit('student-message', {
      content: message,
      chat: chatId,
      token: guestToken
    });

    setTimeout(() => {
      sendBtn.disabled = false;
    }, 1000);
  }

  // Event listeners
  button.addEventListener('click', () => {
    isOpen = !isOpen;
    window.classList.toggle('open');
    
    if (isOpen && !guestToken) {
      initGuestUser();
    }
    
    if (isOpen) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    window.classList.remove('open');
  });

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  // Load Socket.IO dynamically
  if (!window.io) {
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
    script.onload = () => {
      console.log('Socket.IO loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Socket.IO');
    };
    document.head.appendChild(script);
  }
  
  } // End of initWidget function
})();
