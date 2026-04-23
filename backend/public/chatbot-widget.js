// Chatbot Widget - Embeddable Version
(function() {
  'use strict';
  
  console.log('🤖 Chatbot Widget Loading...');

  function resolveServerOrigin() {
    const explicitUrl = window.AskakshaConfig?.serverUrl || window.CHATBOT_SERVER_URL;
    if (explicitUrl) {
      return explicitUrl.replace(/\/+$/, '');
    }

    if (document.currentScript?.src) {
      try {
        return new URL(document.currentScript.src, window.location.href).origin;
      } catch (error) {
        console.warn('Could not parse script URL origin:', error);
      }
    }

    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5050';
    }

    return 'https://askaksha-project.onrender.com';
  }

  // Configuration
  const serverOrigin = resolveServerOrigin();
  const CONFIG = {
    API_URL: serverOrigin,
    SOCKET_URL: serverOrigin,
    collegeCode: window.CHATBOT_COLLEGE_CODE || 'GUEST',
  };

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('📦 Initializing widget...');
    injectStyles();
    createWidgetHTML();
    attachEventListeners();
    loadSocketIO();
    console.log('✅ Widget initialized successfully');
  }

  // Inject CSS styles
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #chatbot-widget-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      #chatbot-widget-container * { box-sizing: border-box; }
      
      #chatbot-widget-button {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 60px !important;
        height: 60px !important;
        border-radius: 50% !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: transform 0.3s ease !important;
        z-index: 999999 !important;
      }
      #chatbot-widget-button:hover { transform: scale(1.1) !important; }
      #chatbot-widget-button svg { width: 28px; height: 28px; fill: white; }
      
      #chatbot-widget-window {
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        width: 380px !important;
        height: 550px !important;
        background: white !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
        display: none !important;
        flex-direction: column !important;
        z-index: 999999 !important;
      }
      #chatbot-widget-window.open { display: flex !important; }
      
      #chatbot-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        border-radius: 16px 16px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #chatbot-header h3 { font-size: 16px; font-weight: 600; margin: 0; }
      #chatbot-header p { font-size: 12px; opacity: 0.9; margin: 4px 0 0 0; }
      
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
        font-size: 18px;
      }
      #chatbot-close:hover { background: rgba(255,255,255,0.3); }
      
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
      
      .chatbot-message.user { justify-content: flex-end; }
      .chatbot-message.bot { justify-content: flex-start; }
      
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
      .chatbot-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .chatbot-typing-dot:nth-child(3) { animation-delay: 0.4s; }
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
      
      #chatbot-input-form { display: flex; gap: 8px; }
      
      #chatbot-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
      }
      #chatbot-input:focus { border-color: #667eea; }
      
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
      }
      #chatbot-send:hover { transform: scale(1.05); }
      #chatbot-send:disabled { opacity: 0.5; cursor: not-allowed; }
      #chatbot-send svg { width: 18px; height: 18px; fill: white; }
      
      @media (max-width: 480px) {
        #chatbot-widget-window {
          bottom: 0 !important;
          right: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
        }
        #chatbot-header { border-radius: 0; }
        #chatbot-input-container { border-radius: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Create widget HTML
  function createWidgetHTML() {
    const container = document.createElement('div');
    container.id = 'chatbot-widget-container';
    container.innerHTML = `
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
            <p style="font-size: 48px; margin-bottom: 16px;">👋</p>
            <p><strong>Hi! I'm your college assistant.</strong></p>
            <p style="margin-top: 8px; font-size: 13px;">Ask me about courses, fees, facilities, or anything else!</p>
          </div>
        </div>
        
        <div id="chatbot-input-container">
          <form id="chatbot-input-form">
            <input type="text" id="chatbot-input" placeholder="Type your message..." autocomplete="off" />
            <button type="submit" id="chatbot-send" aria-label="Send message">
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    console.log('✅ Widget HTML created');
  }

  // State variables
  let isOpen = false;
  let isLoading = false;
  let guestToken = null;
  let chatId = null;
  let socket = null;
  let messages = [];

  // Attach event listeners
  function attachEventListeners() {
    const button = document.getElementById('chatbot-widget-button');
    const windowEl = document.getElementById('chatbot-widget-window');
    const closeBtn = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-input-form');
    const input = document.getElementById('chatbot-input');

    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    form.addEventListener('submit', handleSubmit);

    console.log('✅ Event listeners attached');
  }

  function toggleChat() {
    isOpen = !isOpen;
    const windowEl = document.getElementById('chatbot-widget-window');
    windowEl.classList.toggle('open');
    
    if (isOpen && !guestToken) {
      initGuestUser();
    }
    
    if (isOpen) {
      document.getElementById('chatbot-input').focus();
    }
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('chatbot-widget-window').classList.remove('open');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    sendMessage(input.value);
  }

  // Initialize guest user
  async function initGuestUser() {
    try {
      const storedToken = localStorage.getItem('chatbot_guest_token');
      const storedChatId = localStorage.getItem('chatbot_chat_id');
      
      if (storedToken && storedChatId) {
        guestToken = storedToken;
        chatId = storedChatId;
        await loadChatHistory();
        initSocket();
        return;
      }

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
        console.log('✅ Guest user created');
      }
    } catch (error) {
      console.error('❌ Error creating guest user:', error);
    }
  }

  // Initialize Socket.IO
  function initSocket() {
    if (!window.io) {
      console.log('⏳ Waiting for Socket.IO...');
      setTimeout(initSocket, 100);
      return;
    }

    socket = window.io(CONFIG.SOCKET_URL);

    socket.on('connect', () => {
      console.log('✅ Connected to chat server');
    });

    socket.on('chat-response', (data) => {
      isLoading = false;
      removeTyping();
      addMessage('bot', data.message);
    });

    socket.on('disconnect', () => {
      console.log('⚠️ Disconnected from chat server');
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
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = '';
        data.messages.forEach(msg => {
          addMessage(msg.role === 'user' ? 'user' : 'bot', msg.content, false);
        });
      }
    } catch (error) {
      console.error('❌ Error loading history:', error);
    }
  }

  // Add message
  function addMessage(role, content, save = true) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    
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

  // Show typing
  function showTyping() {
    const messagesContainer = document.getElementById('chatbot-messages');
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

  // Remove typing
  function removeTyping() {
    const typingDiv = document.getElementById('chatbot-typing');
    if (typingDiv) typingDiv.remove();
  }

  // Send message
  function sendMessage(message) {
    if (!message.trim() || isLoading || !socket || !guestToken) return;

    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    
    addMessage('user', message);
    input.value = '';
    isLoading = true;
    sendBtn.disabled = true;
    
    showTyping();

    socket.emit('student-message', {
      content: message,
      chat: chatId,
      token: guestToken
    });

    setTimeout(() => {
      sendBtn.disabled = false;
    }, 1000);
  }

  // Load Socket.IO
  function loadSocketIO() {
    if (window.io) {
      console.log('✅ Socket.IO already loaded');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
    script.onload = () => {
      console.log('✅ Socket.IO loaded from CDN');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Socket.IO from CDN');
    };
    document.head.appendChild(script);
  }
})();
