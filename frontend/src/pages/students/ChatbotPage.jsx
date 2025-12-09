import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

// Format text with markdown-style formatting
const formatText = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) return <br key={lineIndex} />;
    
    const parts = [];
    let currentIndex = 0;
    
    // Match **bold** text
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > currentIndex) {
        parts.push(line.substring(currentIndex, match.index));
      }
      parts.push(<strong key={`bold-${lineIndex}-${match.index}`} className="font-bold">{match[1]}</strong>);
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < line.length) {
      parts.push(line.substring(currentIndex));
    }
    
    return (
      <div key={lineIndex} className="mb-1">
        {parts.length > 0 ? parts : line}
      </div>
    );
  });
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [whatsappNumber] = useState('1234567890');

  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Connection error. Please check if the server is running.');
    });

    newSocket.on('chat-response', (response) => {
      // Clear fallback timeout
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      setIsLoading(false);
      
      if (response.error) {
        setMessages((prev) => [...prev, { 
          role: "model", 
          content: response.message,
          isError: true
        }]);
        // Show WhatsApp popup on error
        setShowWhatsAppPopup(true);
      } else {
        setMessages((prev) => [...prev, { 
          role: "model", 
          content: response.message,
          detectedLanguage: response.detectedLanguage,
          originalMessage: response.originalMessage
        }]);
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate unique chat ID
  const generateChatId = () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !socket) return;

    const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
    
    if (!token) {
      setError('Please login to use the chatbot');
      return;
    }

    // Create chat ID if not exists
    let chatId = currentChatId;
    if (!chatId) {
      chatId = generateChatId();
      setCurrentChatId(chatId);
      
      // Add to chats list with first message as title
      const newChat = {
        _id: chatId,
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        createdAt: new Date()
      };
      setChats((prev) => [newChat, ...prev]);
    }

    // Add user message to UI
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Prepare message payload
    const messagePayload = {
      content: input,
      chat: chatId,
      token: token,
    };

    // Send to backend via Socket.IO
    setIsLoading(true);
    setError(null);
    socket.emit('student-message', messagePayload);

    // Set fallback timeout (15 seconds)
    fallbackTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setMessages((prev) => [...prev, { 
        role: "model", 
        content: "I'm having trouble responding right now. Would you like to chat with us on WhatsApp?",
        isError: true
      }]);
      setShowWhatsAppPopup(true);
    }, 15000);

    // Clear input
    setInput("");
  };

  // Create a new chat
  const handleNewChat = () => {
    const newChatId = generateChatId();
    const newChat = {
      _id: newChatId,
      title: `New Chat`,
      createdAt: new Date()
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  // Toggle sidebar (mobile only)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Switch to a different chat
  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    setMessages([]); // Clear messages for demo
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Delete a chat
  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    if (chatId === currentChatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  // Open WhatsApp
  const openWhatsApp = () => {
    const message = encodeURIComponent('Hi, I need help with the Askaksha chatbot.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    setShowWhatsAppPopup(false);
  };

  return (
    <div className="w-screen bg-[#E8FDFF] h-[90vh]  mt-20 lg:w-full">
      <div className="h-[98%] w-full flex flex-col bg-[#CAECFF] lg:rounded-2xl relative">
        {/* Error Banner */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}

        {/* Welcome Text */}
        {!currentChatId && messages.length === 0 && (
          <div className="absolute w-full px-14 py-28 text-center lg:flex lg:flex-col lg:items-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Welcome to <span className="bg-[#FF993A] text-white px-4 py-1 rounded-xl">Askaksha</span>
            </h2>
            <p className="text-xs lg:text-sm ml-2 mt-2">
              The power of AI at your service - Tame the knowledge
            </p>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 w-full overflow-y-auto px-8 py-4 flex flex-col gap-2 mt-24">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] md:max-w-[85%] p-3 rounded-xl ${
                msg.role === "user"
                  ? "self-end bg-[#FF993A] text-white"
                  : msg.isError
                  ? "self-start bg-red-100 text-red-800 border border-red-300"
                  : "self-start bg-gray-200 text-black"
              }`}
            >
              <div className="break-words leading-relaxed">
                {msg.role === "user" ? msg.content : formatText(msg.content)}
              </div>
              {msg.detectedLanguage && msg.detectedLanguage !== 'en' && (
                <div className="text-xs mt-2 opacity-70">
                  Detected language: {msg.detectedLanguage}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="self-start p-4 bg-gray-200 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Form */}
        <div className="absolute bottom-[1%] w-full px-4">
          <form onSubmit={handleSend} className="w-full relative">
            <input
              type="text"
              placeholder={socket ? 'Example: "Explain Quantum Computing"' : 'Connecting to server...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || !socket}
              className="h-12 rounded-lg px-4 pr-16 w-full bg-[#D0E1E7] border border-black/30 disabled:bg-gray-300 disabled:text-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading || !socket || !input.trim()}
              className={`absolute h-8 w-8 ${
                isLoading || !socket || !input.trim()
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#FF993A] cursor-pointer hover:bg-[#e88a33]"
              } flex items-center justify-center right-6 top-2 rounded transition-colors`}
            >
              <i className="ri-send-plane-2-fill text-white"></i>
            </button>
          </form>
        </div>

        {/* WhatsApp Fallback Popup */}
        {showWhatsAppPopup && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 m-4 max-w-md w-full shadow-2xl animate-bounce-in">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <i className="ri-whatsapp-line text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Need Help?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our chatbot is having trouble responding. Would you like to chat with us directly on WhatsApp for instant support?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowWhatsAppPopup(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Continue Here
                  </button>
                  <button
                    onClick={openWhatsApp}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <i className="ri-whatsapp-line text-2xl"></i>
                    Open WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Sidebar - Chat List */}
        {/* <div
          className={`fixed top-20 lg:top-20 right-0 lg:right-4 h-[88vh] lg:h-[88.5vh] w-[40%] lg:w-[13%] bg-[#CAECFF] shadow-lg lg:rounded-2xl transition-transform duration-300 ease-in-out flex flex-col p-4 z-9999 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
        >
         
          <div
            onClick={toggleSidebar}
            className="lg:hidden absolute -left-9 top-5 bg-[#FF993A] text-white w-9 h-9 rounded flex items-center justify-center cursor-pointer font-bold shadow-md z-10000"
          >
            {sidebarOpen ? (
              <i className="ri-arrow-right-s-line"></i>
            ) : (
              <i className="ri-arrow-left-s-fill"></i>
            )}
          </div>

      
          <div className="flex flex-col gap-4 h-full">
            <p
              onClick={handleNewChat}
              className="bg-[#FF993A] text-white px-3 py-3 rounded-lg cursor-pointer text-center font-medium hover:bg-[#e88a33] transition-colors"
            >
              + Start a new chat
            </p>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(88vh-60px)]">
              {chats.length === 0 && <p className="text-center">No chats yet</p>}
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => switchChat(chat._id)}
                  className={`p-3 bg-[#D0E1E7] rounded-lg cursor-pointer flex items-center gap-2 relative hover:bg-[#b0d4e7] transition-colors ${
                    currentChatId === chat._id ? "bg-[#b0d4e7] border-l-[3px] border-[#FF993A]" : ""
                  }`}
                >
                  <i className="ri-chat-4-line"></i>
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                    {chat.title}
                  </span>
                  <i
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="ri-delete-bin-line text-gray-600 hover:text-red-500 transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
                  ></i>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ChatbotPage;