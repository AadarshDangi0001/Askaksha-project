import React, { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'

const AssignVolunteer = () => {
  const [message, setMessage] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getStudents();
      
      if (response.success && response.students) {
        // Map students to volunteers format
        const studentsData = response.students.map(student => ({
          id: student._id,
          name: student.name,
          email: student.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3B7DDD&color=ffffff`,
          assigned: false,
        }));
        setVolunteers(studentsData);
      } else {
        setVolunteers([]);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.message || "Failed to load students");
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new volunteer from input (removed - now showing only real students)
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    // Filter students by search
    const filtered = volunteers.filter(v => 
      v.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      v.email.toLowerCase().includes(trimmed.toLowerCase())
    );
    
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

  // Filter volunteers based on search
  const filteredVolunteers = message.trim() 
    ? volunteers.filter(v => 
        v.name.toLowerCase().includes(message.toLowerCase()) ||
        v.email.toLowerCase().includes(message.toLowerCase())
      )
    : volunteers;

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-24">
      {/* Main Container */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Assign Volunteers</h2>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "Loading students..." : `${volunteers.length} students in your college`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 rounded-2xl p-6 text-center mb-6">
            <p className="text-red-600 mb-3">{error}</p>
            <button
              onClick={fetchStudents}
              className="text-sm text-blue-600 hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && volunteers.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600">No students found in your college.</p>
            <p className="text-sm text-gray-500 mt-2">Students will appear here after they register.</p>
          </div>
        )}

        {/* Volunteers Grid */}
        {!loading && !error && filteredVolunteers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {filteredVolunteers.map((user) => (
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
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
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
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* No Results for Search */}
        {!loading && !error && message.trim() && filteredVolunteers.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-gray-600">No students found matching "{message}"</p>
          </div>
        )}
      </div>

      {/* Fixed Search Input at Bottom */}
      <div className="fixed bottom-0 z-40 w-screen right-0 bg-[#E8FDFF] border-t border-gray-200 py-4 px-8 lg:px-16 lg:w-[82vw]">
        <form
          onSubmit={handleSendMessage}
          className="w-full max-w-5xl mx-auto relative"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full h-14 rounded-xl px-6 pr-16 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9D5C] text-gray-700 placeholder-gray-500"
          />
          <button
            type="button"
            onClick={() => setMessage("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#3B7DDD] hover:bg-[#5A97E4] text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          >
            {message ? (
              <i className="ri-close-line text-lg"></i>
            ) : (
              <i className="ri-search-line text-lg"></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignVolunteer;
