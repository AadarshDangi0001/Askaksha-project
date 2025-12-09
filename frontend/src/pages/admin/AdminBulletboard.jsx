import React, { useState } from "react";

const AdminBulletboardPage = () => {
  const [notices, setNotices] = useState([
    {
      id: 101,
      title: "Library Maintenance",
      description:
        "The college library will remain closed on 10 January 2026 due to urgent maintenance work. Students are advised to complete pending book returns and issue requirements before the mentioned date to avoid any inconvenience.",
      expanded: false,
    },
    {
      id: 102,
      title: "Exam Fee Reminder",
      description:
        "Last date for paying university exam fees without late fine is 25 January 2026. After this date, a late fine of ₹50 per day will be charged. Make sure to complete the payment through the official student portal only.",
      expanded: false,
    },
    {
      id: 103,
      title: "Placement Drive - Infosys",
      description:
        "Infosys campus placement drive is scheduled for March 2026. Eligible students from CSE, IT, and ECE branches must register on the placement portal before 28 February 2026. Further details regarding test pattern and eligibility will be shared soon.",
      expanded: false,
    },
    {
      id: 104,
      title: "Attendance Notice",
      description:
        "As per university guidelines, a minimum of 75% attendance is mandatory in both theory and practical classes. Students falling short of required attendance may not be allowed to appear in the semester examinations.",
      expanded: false,
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const toggleReadMore = (id) => {
    setNotices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleDelete = (id) => {
    setNotices((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddNotice = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    const desc = newDescription.trim();
    if (!title || !desc) return;

    const newNotice = {
      id: Date.now(),
      title,
      description: desc,
      expanded: false,
    };

    // Add new notice on top
    setNotices((prev) => [newNotice, ...prev]);
    setNewTitle("");
    setNewDescription("");
  };

  const getShortText = (text) => {
    const maxLength = 110;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="Dashboard mt-15 w-full min-h-screen bg-[#E8FDFF] pb-28 overflow-y-auto">
      <div className="px-4 sm:px-6 lg:px-12 xl:px-16 mt-24">
        <div className="max-w-6xl mx-auto">
          
          <p className="text-sm text-gray-700 mb-6">
            Create important college notices and show them on the bulletin
            board.
          </p>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="relative bg-[#CAECFF] rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3"
              >
                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors"
                >
                  <i className="ri-delete-bin-6-line text-black text-lg"></i>
                </button>

                <h3 className="text-lg font-bold text-gray-900 pr-6">
                  {notice.title}
                </h3>

                <p className="text-sm text-gray-800 leading-relaxed">
                  {notice.expanded
                    ? notice.description
                    : getShortText(notice.description)}
                </p>

                {notice.description.length > 110 && (
                  <button
                    onClick={() => toggleReadMore(notice.id)}
                    className="text-[#3B7DDD] hover:text-[#5A97E4] font-medium text-sm self-start"
                  >
                    {notice.expanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Notice Form - Fixed Bottom */}
      <form
        onSubmit={handleAddNotice}
        className="fixed bottom-0 right-0 w-full lg:w-[82vw] bg-[#E8FDFF] border-t border-gray-300 px-6 lg:px-16 py-4"
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-3">
          {/* Title Input - 20% on large screens */}
          <input
            type="text"
            placeholder="Title"
            className="w-full lg:w-[20%] bg-white border border-gray-300 px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#3B7DDD]"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          {/* Description Input - 60% on large screens */}
          <input
            type="text"
            placeholder="Description"
            className="w-full lg:w-[60%] bg-white border border-gray-300 px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#3B7DDD]"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          {/* Button - 20% on large screens */}
          <button
            type="submit"
            className="w-full lg:w-[20%] bg-[#3B7DDD] hover:bg-[#5A97E4] text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            Add Notice
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBulletboardPage;
