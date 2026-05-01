import React, { useEffect, useState } from "react";
import { collegeAPI } from "../../services/api";

const AdminBulletboardPage = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const normalizeNotice = (notice) => ({
    id: notice._id || notice.id || Date.now(),
    title: notice.title || "Untitled Notice",
    description: notice.description || "",
    expanded: false,
  });

  const normalizeNotices = (items = []) => items.map(normalizeNotice);

  const saveNotices = async (nextNotices) => {
    setIsSaving(true);
    setError("");

    try {
      await collegeAPI.update({
        notices: nextNotices.map(({ id, expanded, ...notice }) => notice),
      });
      setNotices(nextNotices);
    } catch (err) {
      console.error("Failed to save bulletins:", err);
      setError(err.message || "Failed to save bulletins");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setIsLoading(true);
        const data = await collegeAPI.getMy();
        setNotices(normalizeNotices(data?.notices || []));
      } catch (err) {
        console.error("Failed to load bulletins:", err);
        setError(err.message || "Failed to load bulletins");
      } finally {
        setIsLoading(false);
      }
    };

    loadCollege();
  }, []);

  const toggleReadMore = (id) => {
    setNotices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleDelete = async (id) => {
    const nextNotices = notices.filter((item) => item.id !== id);
    await saveNotices(nextNotices);
  };

  const handleAddNotice = async (e) => {
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

    await saveNotices([newNotice, ...notices]);
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

          {error && (
            <div className="mb-6 rounded-xl bg-red-100 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Notices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
            {isLoading && (
              <div className="col-span-full rounded-2xl bg-white/70 px-6 py-10 text-center text-gray-600">
                Loading notices...
              </div>
            )}

            {!isLoading && notices.length === 0 && (
              <div className="col-span-full rounded-2xl bg-white/70 px-6 py-10 text-center text-gray-600">
                No notices yet. Add the first bulletin below.
              </div>
            )}

            {notices.map((notice) => (
              <div
                key={notice.id}
                className="relative bg-[#CAECFF] rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3"
              >
                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(notice.id)}
                  disabled={isSaving}
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
            disabled={isSaving}
            className="w-full lg:w-[20%] bg-[#3B7DDD] hover:bg-[#5A97E4] text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            {isSaving ? "Saving..." : "Add Notice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBulletboardPage;
