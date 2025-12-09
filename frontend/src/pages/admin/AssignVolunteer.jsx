import React, { useState } from 'react'

const AssignVolunteer = () => {
  const [message, setMessage] = useState("");

  // Volunteers in state (so we can add / delete / update)
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: "John Kappa",
      avatar: "https://ui-avatars.com/api/?name=John+Kappa&background=3B7DDD&color=ffffff",
      assigned: false,
    },
    {
      id: 2,
      name: "Alex Paul",
      avatar: "https://ui-avatars.com/api/?name=Alex+Paul&background=3B7DDD&color=ffffff",
      assigned: false,
    },
    {
      id: 3,
      name: "Sara Smith",
      avatar: "https://ui-avatars.com/api/?name=Sara+Smith&background=3B7DDD&color=ffffff",
      assigned: false,
    },
    {
      id: 4,
      name: "David Lee",
      avatar: "https://ui-avatars.com/api/?name=David+Lee&background=3B7DDD&color=ffffff",
      assigned: false,
    },
  ]);

  // Add new volunteer from input
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    const newVolunteer = {
      id: Date.now(),
      name: trimmed,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        trimmed
      )}&background=3B7DDD&color=ffffff`,
      assigned: false,
    };

    setVolunteers((prev) => [...prev, newVolunteer]);
    setMessage("");
  };

  const handleAssignToggle = (id) => {
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, assigned: !v.assigned } : v
      )
    );
  };

  const handleDelete = (id) => {
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-24">
      {/* Main Container */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">

        {/* Volunteers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {volunteers.map((user) => (
            <div
              key={user.id}
              className="bg-[#CAECFF] rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Responsive Layout */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left: Photo + Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full bg-[#EFDEC2]"
                  />
                  <h3 className="font-bold text-lg text-gray-900">
                    {user.name}
                  </h3>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => handleAssignToggle(user.id)}
                    className={`w-full lg:w-auto font-medium rounded-lg px-4 py-3 text-sm transition-colors
                      ${
                        user.assigned
                          ? "bg-[#5A97E4] text-white"
                          : "bg-[#3B7DDD] hover:bg-[#5A97E4] text-white"
                      }`}
                  >
                    {user.assigned ? "Assigned" : "Assign"}
                  </button>

                  <button
  onClick={() => handleDelete(user.id)}
  className="w-10 h-10 flex items-center justify-center  rounded-lg hover:bg-red-50 transition-colors"
>
  <i className="ri-delete-bin-6-line text-black text-lg"></i>
</button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 z-40 w-screen right-0 bg-[#E8FDFF] border-t border-gray-200 py-4 px-8 lg:px-16 lg:w-[82vw]">
        <form
          onSubmit={handleSendMessage}
          className="w-full max-w-5xl mx-auto relative"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type student name to add as volunteer"
            className="w-full h-14 rounded-xl px-6 pr-16 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9D5C] text-gray-700 placeholder-gray-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#3B7DDD] hover:bg-[#3B7DDD] text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          >
            <i className="ri-send-plane-2-fill text-lg"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignVolunteer;
