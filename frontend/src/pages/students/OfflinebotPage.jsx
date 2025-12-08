import React, { useState, useRef, useEffect } from "react";

const OfflinebotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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

  return (
    <div className="w-full bg-[#E8FDFF] h-[90vh] mt-20">
      <div className="h-[98%] w-screen ml-0 lg:w-[80vw] lg:ml-5 flex flex-col bg-[#CAECFF] rounded-2xl relative ">
        {/* Welcome Text */}
        {messages.length === 0 && (
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

        
      </div>
    </div>
  )
}

export default OfflinebotPage
