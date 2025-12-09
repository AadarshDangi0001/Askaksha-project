// Askaksha AI Chatbot - Embeddable Widget
// Usage: <script src="https://your-domain.com/embed-chatbot.js"></script>
//        <script>AskakshaChat.init({ collegeCode: 'YOUR_COLLEGE_CODE' });</script>

(function(window) {
  'use strict';

  const AskakshaChat = {
    config: {
      serverUrl: 'http://localhost:5050',
      collegeCode: '',
      initialized: false
    },

    init: function(options) {
      if (this.config.initialized) {
        console.warn('Askaksha Chatbot already initialized');
        return;
      }

      this.config.collegeCode = options.collegeCode || 'GUEST';
      this.config.serverUrl = options.serverUrl || this.config.serverUrl;
      this.config.initialized = true;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.render());
      } else {
        this.render();
      }
    },

    render: function() {
      this.injectStyles();
      this.createWidget();
      this.loadSocketIO();
    },

    injectStyles: function() {
      const style = document.createElement('style');
      style.id = 'askaksha-chatbot-styles';
      style.textContent = `
        .askaksha-chat-widget * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .askaksha-chat-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .askaksha-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
        }

        .askaksha-chat-button svg {
          width: 32px;
          height: 32px;
          fill: white;
        }

        .askaksha-chat-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 10px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .askaksha-chat-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: none;
          flex-direction: column;
          z-index: 999998;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .askaksha-chat-window.open {
          display: flex;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .askaksha-chat-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .askaksha-chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .askaksha-chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .askaksha-chat-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .askaksha-chat-status {
          font-size: 12px;
          opacity: 0.9;
        }

        .askaksha-chat-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .askaksha-chat-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .askaksha-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f9fafb;
        }

        .askaksha-chat-message {
          display: flex;
          margin-bottom: 16px;
          animation: messageSlide 0.3s ease;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .askaksha-chat-message.user {
          justify-content: flex-end;
        }

        .askaksha-chat-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .askaksha-chat-message.bot .askaksha-chat-bubble {
          background: white;
          color: #1f2937;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border-bottom-left-radius: 4px;
        }

        .askaksha-chat-message.user .askaksha-chat-bubble {
          background: #3b82f6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .askaksha-chat-file-info {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .askaksha-chat-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }

        .askaksha-chat-typing span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .askaksha-chat-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .askaksha-chat-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .askaksha-chat-empty {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .askaksha-chat-empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .askaksha-chat-preview {
          padding: 12px;
          background: #eff6ff;
          border-top: 1px solid #dbeafe;
        }

        .askaksha-chat-preview-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 8px;
          border-radius: 8px;
        }

        .askaksha-chat-preview-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .askaksha-chat-preview-thumb {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
        }

        .askaksha-chat-preview-icon {
          width: 40px;
          height: 40px;
          background: #fee2e2;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .askaksha-chat-preview-text {
          font-size: 12px;
        }

        .askaksha-chat-preview-name {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .askaksha-chat-preview-size {
          color: #6b7280;
        }

        .askaksha-chat-preview-remove {
          background: #fee2e2;
          border: none;
          color: #dc2626;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }

        .askaksha-chat-preview-remove:hover {
          background: #fecaca;
        }

        .askaksha-chat-input-area {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .askaksha-chat-input-form {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .askaksha-chat-file-input {
          display: none;
        }

        .askaksha-chat-attach-btn {
          background: #f3f4f6;
          border: none;
          color: #6b7280;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 20px;
        }

        .askaksha-chat-attach-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .askaksha-chat-input {
          flex: 1;
          border: 1px solid #e5e7eb;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .askaksha-chat-input:focus {
          border-color: #3b82f6;
        }

        .askaksha-chat-input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .askaksha-chat-send-btn {
          background: #3b82f6;
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          font-size: 18px;
        }

        .askaksha-chat-send-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .askaksha-chat-send-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .askaksha-chat-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 140px);
            right: 16px;
            bottom: 100px;
          }
        }
      `;
      document.head.appendChild(style);
    },

    createWidget: function() {
      const container = document.createElement('div');
      container.className = 'askaksha-chat-widget';
      container.innerHTML = `
        <button class="askaksha-chat-button" id="askaksha-chat-toggle">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span class="askaksha-chat-badge">AI</span>
        </button>

        <div class="askaksha-chat-window" id="askaksha-chat-window">
          <div class="askaksha-chat-header">
            <div class="askaksha-chat-header-info">
              <div class="askaksha-chat-avatar">🤖</div>
              <div>
                <div class="askaksha-chat-title">Askaksha AI Assistant</div>
                <div class="askaksha-chat-status" id="askaksha-chat-status">🔴 Connecting...</div>
              </div>
            </div>
            <button class="askaksha-chat-close" id="askaksha-chat-close">✕</button>
          </div>

          <div class="askaksha-chat-messages" id="askaksha-chat-messages">
            <div class="askaksha-chat-empty">
              <div class="askaksha-chat-empty-icon">💬</div>
              <div>Hi! I'm your AI assistant.</div>
              <div style="font-size: 12px; margin-top: 4px;">Ask me anything!</div>
            </div>
          </div>

          <div id="askaksha-chat-preview"></div>

          <div class="askaksha-chat-input-area">
            <form class="askaksha-chat-input-form" id="askaksha-chat-form">
              <input type="file" class="askaksha-chat-file-input" id="askaksha-chat-file" accept="image/*,.pdf">
              <button type="button" class="askaksha-chat-attach-btn" id="askaksha-chat-attach-trigger" title="Upload file">
                📎
              </button>
              <input 
                type="text" 
                class="askaksha-chat-input" 
                id="askaksha-chat-input" 
                placeholder="Type your message..."
                autocomplete="off"
              >
              <button type="submit" class="askaksha-chat-send-btn" id="askaksha-chat-send">
                ➤
              </button>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      this.attachEvents();
    },

    attachEvents: function() {
      const toggle = document.getElementById('askaksha-chat-toggle');
      const close = document.getElementById('askaksha-chat-close');
      const chatWindow = document.getElementById('askaksha-chat-window');
      const form = document.getElementById('askaksha-chat-form');
      const input = document.getElementById('askaksha-chat-input');
      const fileInput = document.getElementById('askaksha-chat-file');
      const attachTrigger = document.getElementById('askaksha-chat-attach-trigger');

      toggle.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
          input.focus();
        }
      });

      close.addEventListener('click', () => {
        chatWindow.classList.remove('open');
      });

      attachTrigger.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        this.handleFileSelect(e.target.files[0]);
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    },

    state: {
      socket: null,
      isConnected: false,
      selectedFile: null,
      previewUrl: null,
      chatId: `chat_${Date.now()}`,
      messages: []
    },

    loadSocketIO: function() {
      const script = document.createElement('script');
      script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
      script.onload = () => {
        this.connectSocket();
      };
      document.head.appendChild(script);
    },

    connectSocket: function() {
      const socket = io(this.config.serverUrl, {
        auth: { 
          collegeCode: this.config.collegeCode,
          guestMode: true 
        }
      });

      socket.on('connect', () => {
        this.state.isConnected = true;
        this.state.socket = socket;
        document.getElementById('askaksha-chat-status').innerHTML = '🟢 Online';
        console.log('✅ Askaksha Chatbot connected');
      });

      socket.on('disconnect', () => {
        this.state.isConnected = false;
        document.getElementById('askaksha-chat-status').innerHTML = '🔴 Offline';
        console.log('❌ Askaksha Chatbot disconnected');
      });

      socket.on('chat-response', (data) => {
        this.handleBotResponse(data);
      });
    },

    sendMessage: function() {
      const input = document.getElementById('askaksha-chat-input');
      const message = input.value.trim();

      if (!message && !this.state.selectedFile) return;

      if (this.state.selectedFile) {
        this.sendFileMessage(message);
      } else {
        this.sendTextMessage(message);
      }

      input.value = '';
    },

    sendTextMessage: function(message) {
      this.addMessage('user', message);
      this.showTyping();

      if (this.state.socket && this.state.isConnected) {
        this.state.socket.emit('guest-message', {
          content: message,
          chat: this.state.chatId,
          collegeCode: this.config.collegeCode
        });
      }
    },

    sendFileMessage: function(message) {
      const file = this.state.selectedFile;
      this.addMessage('user', message || 'Analyze this file', file.name);
      this.showTyping();

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        
        if (this.state.socket && this.state.isConnected) {
          this.state.socket.emit('guest-message', {
            content: message || 'Please analyze this file',
            chat: this.state.chatId,
            collegeCode: this.config.collegeCode,
            fileData: base64Data,
            mimeType: file.type,
            fileName: file.name
          });
        }

        this.clearFile();
      };
      reader.readAsDataURL(file);
    },

    handleBotResponse: function(data) {
      this.hideTyping();
      if (data.error) {
        this.addMessage('bot', `Error: ${data.message}`);
      } else {
        this.addMessage('bot', data.message);
      }
    },

    addMessage: function(type, text, fileName = null) {
      const messagesDiv = document.getElementById('askaksha-chat-messages');
      
      // Remove empty state
      const empty = messagesDiv.querySelector('.askaksha-chat-empty');
      if (empty) empty.remove();

      const messageDiv = document.createElement('div');
      messageDiv.className = `askaksha-chat-message ${type}`;
      
      let content = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      messageDiv.innerHTML = `
        <div class="askaksha-chat-bubble">
          ${fileName ? `<div class="askaksha-chat-file-info">📎 ${fileName}</div>` : ''}
          ${content}
        </div>
      `;

      messagesDiv.appendChild(messageDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    showTyping: function() {
      const messagesDiv = document.getElementById('askaksha-chat-messages');
      const typing = document.createElement('div');
      typing.id = 'askaksha-typing-indicator';
      typing.className = 'askaksha-chat-message bot';
      typing.innerHTML = `
        <div class="askaksha-chat-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      messagesDiv.appendChild(typing);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    hideTyping: function() {
      const typing = document.getElementById('askaksha-typing-indicator');
      if (typing) typing.remove();
    },

    handleFileSelect: function(file) {
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image (JPEG, PNG) or PDF file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size should not exceed 10MB');
        return;
      }

      this.state.selectedFile = file;
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.state.previewUrl = e.target.result;
          this.showFilePreview();
        };
        reader.readAsDataURL(file);
      } else {
        this.state.previewUrl = null;
        this.showFilePreview();
      }
    },

    showFilePreview: function() {
      const previewDiv = document.getElementById('askaksha-chat-preview');
      const file = this.state.selectedFile;
      
      previewDiv.innerHTML = `
        <div class="askaksha-chat-preview-content">
          <div class="askaksha-chat-preview-info">
            ${this.state.previewUrl 
              ? `<img src="${this.state.previewUrl}" class="askaksha-chat-preview-thumb">` 
              : '<div class="askaksha-chat-preview-icon">📄</div>'
            }
            <div class="askaksha-chat-preview-text">
              <div class="askaksha-chat-preview-name">${file.name}</div>
              <div class="askaksha-chat-preview-size">${(file.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <button type="button" class="askaksha-chat-preview-remove" onclick="AskakshaChat.clearFile()">✕</button>
        </div>
      `;
    },

    clearFile: function() {
      this.state.selectedFile = null;
      this.state.previewUrl = null;
      document.getElementById('askaksha-chat-file').value = '';
      document.getElementById('askaksha-chat-preview').innerHTML = '';
    }
  };

  // Expose globally
  window.AskakshaChat = AskakshaChat;

})(window);
