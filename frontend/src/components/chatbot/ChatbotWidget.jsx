import { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../../services/api';
import './ChatbotWidget.css';

const ChatbotWidget = ({ collegeCode, externalToken = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      authenticateChatbot();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const authenticateChatbot = async () => {
    try {
      setIsLoading(true);
      const data = await chatbotAPI.authenticate(collegeCode, externalToken);

      if (data.success) {
        setAuthToken(data.data.token);
        setStudentInfo(data.data.student);
        setIsAuthenticated(true);

        const welcomeMessage = {
          id: Date.now(),
          text: `Welcome ${data.data.student.name}! ${
            data.data.isGuest ? 'You are in guest mode.' : ''
          } How can I help you today?`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } else {
        const errorMessage = {
          id: Date.now(),
          text: 'Authentication failed. Please check your college code.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([errorMessage]);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = {
        id: Date.now(),
        text: 'Failed to connect. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isAuthenticated) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: 'This is a demo response. Connect your AI service here.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={toggleChatbot}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <h3>College Assistant</h3>
              {studentInfo && (
                <span className="student-status">
                  {studentInfo.isGuest ? '👤 Guest' : `👋 ${studentInfo.name}`}
                </span>
              )}
            </div>
            <button className="chatbot-close-btn" onClick={toggleChatbot}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isAuthenticated ? 'Type your message...' : 'Authenticating...'}
              disabled={!isAuthenticated || isLoading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={!isAuthenticated || !inputMessage.trim() || isLoading}
              className="chatbot-send-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
