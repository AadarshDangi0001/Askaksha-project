import React, { useState, useRef, useEffect } from "react";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([
    { _id: 1, title: "Chat 1 this is" },
    { _id: 2, title: "Web accessibility" },
    { _id: 3, title: "Design inspiration" },
    { _id: 4, title: "What is machine" },
  ]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "This is a simulated AI response." },
      ]);
      setIsLoading(false);
    }, 1000);

    // Clear input
    setInput("");
  };

  // Create a new chat
  const handleNewChat = () => {
    const newChat = {
      _id: chats.length + 1,
      title: `New Chat ${chats.length + 1}`,
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat._id);
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

  return (
    <div className="w-screen bg-[#E8FDFF] h-[90vh]  mt-20 lg:w-full">
      <div className="h-[98%] w-full flex flex-col bg-[#CAECFF] lg:rounded-2xl relative">
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
              className={`max-w-[70%] md:max-w-[85%] p-3 rounded-xl wrap-break-word ${
                msg.role === "user"
                  ? "self-end bg-[#FF993A] text-white"
                  : "self-start bg-gray-200 text-black"
              }`}
            >
              {msg.content}
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
              placeholder='Example: "Explain Quantum Computing"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg px-4 w-full bg-[#D0E1E7] border border-black/30 disabled:bg-gray-300 disabled:text-gray-500"
            />
            <div
              onClick={isLoading ? null : handleSend}
              className={`absolute h-8 w-8 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF993A] cursor-pointer"
              } flex items-center justify-center right-4 top-2 rounded`}
            >
              <i className="ri-send-plane-2-fill text-white"></i>
            </div>
          </form>
        </div>

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