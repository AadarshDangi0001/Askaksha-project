import React, { useState, useMemo, useEffect } from "react";
import { adminAPI } from "../../services/api";

const StudentLogs = () => {
  const [activeFilter, setActiveFilter] = useState("1h");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("logs"); // 'logs' | 'faq'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const FILTERS = [
    { id: "1h", label: "Last 1 hour" },
    { id: "12h", label: "Last 12 hours" },
    { id: "24h", label: "Last 24 hours" },
    { id: "7d", label: "Last 7 days" },
    { id: "1m", label: "Last 1 month" },
    { id: "3m", label: "Last 3 months" },
    { id: "6m", label: "Last 6 months" },
    { id: "all", label: "All" },
  ];

  // Load student logs from backend
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getLogs();
      
      if (response.success && response.messages) {
        // Filter only user messages (student queries), not bot responses
        const userMessages = response.messages
          .filter(msg => msg.role === 'user')
          .map(msg => ({
            query: msg.content,
            createdAt: new Date(msg.createdAt)
          }));
        setLogs(userMessages);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(err.message || "Failed to load student logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Sample logs data (only queries, no names / no IDs) - REMOVED, now using backend data
  const now = new Date();

  // Sample FAQs
  const faqs = [
    {
      q: "How can I reset my student portal password?",
      a: "Use the 'Forgot Password' option on the login page or contact the college IT support.",
    },
    {
      q: "Where can I see my internal marks?",
      a: "Internal marks are visible under the 'Assessment / Internal Marks' section in the student portal.",
    },
    {
      q: "How do I apply for a bonafide certificate?",
      a: "You can submit a request from the 'Certificates' section or visit the admin office.",
    },
    {
      q: "Is there any helpline for technical issues?",
      a: "Yes, you can contact the technical support email or helpline number given on the portal homepage.",
    },
  ];

  const filteredLogs = useMemo(() => {
    const msInHour = 60 * 60 * 1000;
    const msInDay = 24 * msInHour;

    return logs.filter((log) => {
      const diff = now - log.createdAt;

      switch (activeFilter) {
        case "1h":
          return diff <= msInHour;
        case "12h":
          return diff <= 12 * msInHour;
        case "24h":
          return diff <= msInDay;
        case "7d":
          return diff <= 7 * msInDay;
        case "1m":
          return diff <= 30 * msInDay;
        case "3m":
          return diff <= 90 * msInDay;
        case "6m":
          return diff <= 180 * msInDay;
        case "all":
        default:
          return true;
      }
    });
  }, [activeFilter, logs, now]);

  const formatDate = (date) => {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activeLabel =
    FILTERS.find((f) => f.id === activeFilter)?.label || "Last 1 hour";

  const logsSubtitle = "Showing queries based on selected time range.";
  const faqSubtitle = "Most common questions asked by students.";

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-24">
      {/* Outer page padding (same theme as other pages) */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6 flex justify-center">
        {/* Main Card */}
        <div className="bg-[#CAECFF] rounded-3xl shadow-md w-full lg:w-[100vw] max-w-5xl min-h-[60vh] p-4 lg:p-6 flex flex-col">
          
          {/* Header: Tabs + Filter */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              {/* Tabs */}
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("logs")}
                  className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                    activeTab === "logs"
                      ? "bg-[#3B7DDD] text-white shadow-md"
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-[#E3EEFF]"
                  }`}
                >
                  Student Logs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("faq")}
                  className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                    activeTab === "faq"
                      ? "bg-[#3B7DDD] text-white shadow-md"
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-[#E3EEFF]"
                  }`}
                >
                  Frequently Asked
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-xs lg:text-sm text-gray-700 mt-0.5">
                {activeTab === "logs" ? logsSubtitle : faqSubtitle}
              </p>
            </div>

            {/* Filter Dropdown (only for Student Logs tab) */}
            {activeTab === "logs" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-2 text-xs lg:text-sm font-medium text-gray-800 hover:bg-[#FFEDD5] transition"
                >
                  <i className="ri-filter-3-line text-sm"></i>
                  <span>Filter</span>
                  <span className="hidden sm:inline text-[0.7rem] text-gray-500">
                    ({activeLabel})
                  </span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-200 z-10">
                    <ul className="py-2 max-h-64 overflow-y-auto text-sm">
                      {FILTERS.map((filter) => {
                        const isActive = activeFilter === filter.id;
                        return (
                          <li key={filter.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveFilter(filter.id);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-2 hover:bg-[#FFE4C4] ${
                                isActive
                                  ? "font-semibold text-[#FF8A3D]"
                                  : "text-gray-800"
                              }`}
                            >
                              <span>{filter.label}</span>
                              {isActive && (
                                <i className="ri-check-line text-[#FF8A3D] text-base"></i>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="mt-2 flex-1 overflow-y-auto space-y-3 pr-1">
            {activeTab === "logs" ? (
              // Student Logs View
              loading ? (
                <div className="bg-white/70 rounded-2xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">Loading student logs...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    onClick={fetchLogs}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="bg-white/70 rounded-2xl p-4 text-center text-sm text-gray-700">
                  No queries found for{" "}
                  <span className="font-semibold">{activeLabel}</span>.
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm"
                  >
                    <p className="text-gray-900 text-sm lg:text-base leading-relaxed mb-2">
                      {log.query}
                    </p>
                    <div className="flex justify-end text-[0.7rem] lg:text-xs text-gray-600">
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                ))
              )
            ) : (
              // FAQ View
              faqs.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm"
                >
                  <p className="text-gray-900 font-semibold text-sm lg:text-base mb-1">
                    {item.q}
                  </p>
                  <p className="text-gray-700 text-xs lg:text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogs;
