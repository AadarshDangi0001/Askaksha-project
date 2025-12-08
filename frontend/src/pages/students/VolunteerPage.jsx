import React, { useState } from 'react'

const VolunteerPage = () => {
  const [message, setMessage] = useState("");

  // Sample posts data
  const posts = [
    {
      id: 1,
      user: {
        name: "John Kappa",
        avatar: "https://ui-avatars.com/api/?name=John+Kappa&background=FF9D5C&color=fff"
      },
      content: "Here's an idea ✌️ do something good for someone and don't post about it on social media.",
      timestamp: "12:30 PM · Apr 21, 2021"
    },
    {
      id: 2,
      user: {
        name: "John Kappa",
        avatar: "https://ui-avatars.com/api/?name=John+Kappa&background=FF9D5C&color=fff"
      },
      content: "Here's an idea ✌️ do something good for someone and don't post about it on social media.",
      timestamp: "12:30 PM · Apr 21, 2021"
    },
    {
      id: 3,
      user: {
        name: "John Kappa",
        avatar: "https://ui-avatars.com/api/?name=John+Kappa&background=FF9D5C&color=fff"
      },
      content: "Here's an idea ✌️ do something good for someone and don't post about it on social media.",
      timestamp: "12:30 PM · Apr 21, 2021"
    },
    {
      id: 4,
      user: {
        name: "John Kappa",
        avatar: "https://ui-avatars.com/api/?name=John+Kappa&background=FF9D5C&color=fff"
      },
      content: "Here's an idea ✌️ do something good for someone and don't post about it on social media.",
      timestamp: "12:30 PM · Apr 21, 2021"
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-24">
      {/* Main Container */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#FFE4C4] rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <h3 className="font-bold text-lg text-gray-900">{post.user.name}</h3>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 text-base leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Timestamp and See Replies */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{post.timestamp}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  See Replys
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 z-40 w-screen right-0 bg-[#E8FDFF] border-t border-gray-200 py-4 px-8 lg:px-16 lg:w-[82vw]">
        <form onSubmit={handleSendMessage} className="w-full max-w-5xl mx-auto relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send Your Doubt  And Get Direct Reply from Volonteers"
            className="w-full h-14 rounded-xl px-6 pr-16 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9D5C] text-gray-700 placeholder-gray-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FF9D5C] hover:bg-[#FF8A3D] text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          >
            <i className="ri-send-plane-2-fill text-lg"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default VolunteerPage
