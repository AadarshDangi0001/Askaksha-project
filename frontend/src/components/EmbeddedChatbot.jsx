import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const EmbeddedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatId] = useState(() => `chat_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && !socket) {
      const token = localStorage.getItem('studentToken') || localStorage.getItem('token');
      const newSocket = io('http://localhost:5050', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Chatbot connected');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Chatbot disconnected');
      });

      newSocket.on('chat-response', (data) => {
        if (data.error) {
          setMessages(prev => [...prev, { type: 'bot', text: `Error: ${data.message}` }]);
        } else {
          setMessages(prev => [...prev, { type: 'bot', text: data.message }]);
        }
        setIsAnalyzing(false);
        clearFile();
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const token = localStorage.getItem('studentToken') || localStorage.getItem('token');
    if (!token) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Please log in to use the chatbot' }]);
      return;
    }

    if (selectedFile) {
      handleFileUpload();
    } else if (input.trim()) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
      setIsAnalyzing(true);
      
      if (socket && isConnected) {
        socket.emit('student-message', { 
          content: userMessage,
          chat: chatId,
          token: token
        });
      }
      
      setInput('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image (JPEG, PNG) or PDF file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size should not exceed 10MB');
        return;
      }

      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile || !socket || !isConnected) return;

    const token = localStorage.getItem('studentToken') || localStorage.getItem('token');
    if (!token) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Please log in to use the chatbot' }]);
      clearFile();
      return;
    }

    setIsAnalyzing(true);
    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      
      setMessages(prev => [...prev, { 
        type: 'user', 
        text: input.trim() || 'Analyze this file',
        file: selectedFile.name 
      }]);

      socket.emit('student-message', {
        content: input.trim() || 'Please analyze this file',
        chat: chatId,
        token: token,
        fileData: base64Data,
        mimeType: selectedFile.type,
        fileName: selectedFile.name
      });

      setInput('');
    };

    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        {isOpen ? (
          <i className="ri-close-line text-2xl"></i>
        ) : (
          <i className="ri-chat-3-line text-2xl"></i>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
            AI
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-robot-line text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-90">
                  {isConnected ? '🟢 Online' : '🔴 Offline'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <i className="ri-subtract-line text-xl"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <i className="ri-chat-smile-2-line text-4xl mb-2"></i>
                <p className="text-sm">Ask me anything!</p>
                <p className="text-xs mt-1">You can also upload images or PDFs</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {msg.file && (
                    <div className="text-xs opacity-75 mb-1">
                      📎 {msg.file}
                    </div>
                  )}
                  <p
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="p-3 bg-blue-50 border-t border-blue-100">
              <div className="flex items-center justify-between bg-white rounded-lg p-2">
                <div className="flex items-center gap-2">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                      <i className="ri-file-pdf-line text-red-500"></i>
                    </div>
                  )}
                  <div className="text-xs">
                    <p className="font-medium text-gray-800 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title="Upload image or PDF"
              >
                <i className="ri-attachment-2 text-xl"></i>
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedFile ? "Add a message (optional)" : "Type your message..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={(!input.trim() && !selectedFile) || isAnalyzing}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-send-plane-fill text-xl"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmbeddedChatbot;
