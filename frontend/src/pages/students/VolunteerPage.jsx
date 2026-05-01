import React, { useEffect, useMemo, useState } from 'react'
import { studentAPI, volunteerAPI } from '../../services/api'

const VolunteerPage = () => {
  const [message, setMessage] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [studentQuestions, setStudentQuestions] = useState([]);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVolunteerData = async () => {
      try {
        setLoading(true);
        setError("");

        const dashboard = await studentAPI.getDashboard();
        setIsVolunteer(!!dashboard.isVolunteer);

        const myQuestionsResponse = await volunteerAPI.getMyQuestions();
        setStudentQuestions(myQuestionsResponse.questions || []);

        if (dashboard.isVolunteer) {
          const assignedResponse = await volunteerAPI.getAssignedQuestions();
          setAssignedQuestions(assignedResponse.questions || []);
        } else {
          setAssignedQuestions([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load volunteer help");
      } finally {
        setLoading(false);
      }
    };

    loadVolunteerData();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await volunteerAPI.submitQuestion(trimmed);
      if (response.question) {
        setStudentQuestions((prev) => [response.question, ...prev]);
      }
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyChange = (questionId, value) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSendReply = async (questionId) => {
    const reply = (replyDrafts[questionId] || "").trim();
    if (!reply) return;

    try {
      setReplyingId(questionId);
      setError("");
      const response = await volunteerAPI.replyToQuestion(questionId, reply);
      if (response.question) {
        setAssignedQuestions((prev) =>
          prev.map((question) =>
            question._id === questionId ? response.question : question
          )
        );
        setStudentQuestions((prev) =>
          prev.map((question) =>
            question._id === questionId ? response.question : question
          )
        );
      }
      setReplyDrafts((prev) => ({ ...prev, [questionId]: "" }));
    } catch (err) {
      setError(err.message || "Failed to send reply");
    } finally {
      setReplyingId(null);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const hasContent = useMemo(
    () => studentQuestions.length > 0 || assignedQuestions.length > 0,
    [studentQuestions.length, assignedQuestions.length]
  );

  const renderQuestionCard = (question, showReplyBox = false) => {
    const replies = question.replies || [];

    return (
      <div key={question._id} className="bg-[#FFE4C4] rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{question.student?.name || "Student"}</h3>
            <p className="text-sm text-gray-600">{formatDate(question.createdAt)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${question.status === "answered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {question.status}
          </span>
        </div>

        <p className="text-gray-800 text-base leading-relaxed mb-4">
          {question.question}
        </p>

        <div className="space-y-3 mb-4">
          {replies.length > 0 ? (
            replies.map((reply, index) => (
              <div key={`${question._id}-reply-${index}`} className="bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm text-gray-900">
                    {reply.volunteer?.name || "Volunteer"}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600 bg-white/70 rounded-2xl p-4">No reply yet.</p>
          )}
        </div>

        {showReplyBox && (
          <div className="bg-white rounded-2xl p-4">
            <textarea
              value={replyDrafts[question._id] || ""}
              onChange={(e) => handleReplyChange(question._id, e.target.value)}
              placeholder="Write a helpful reply for the student..."
              className="w-full min-h-24 rounded-xl border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF9D5C]"
            />
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => handleSendReply(question._id)}
                disabled={replyingId === question._id}
                className="bg-[#3B7DDD] hover:bg-[#5A97E4] disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {replyingId === question._id ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-24">
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Volunteer Help</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ask a question and get a reply from an assigned volunteer.
          </p>
          {isVolunteer && (
            <p className="text-sm font-medium text-green-700 mt-2">
              You are assigned as a volunteer and can reply to student questions.
            </p>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-md">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading volunteer help...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-3xl p-6 text-center shadow-md">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-24">
            <div className="space-y-6">
              <div className="bg-[#FFE4C4] rounded-3xl p-6 lg:p-8 shadow-md">
                <p className="text-gray-800 text-sm lg:text-base leading-relaxed mb-4">
                  Send your doubt below. It will be routed to an assigned volunteer from your college.
                </p>
                <form onSubmit={handleSendMessage} className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full min-h-40 rounded-2xl px-4 py-4 pr-20 bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9D5C] text-gray-700 placeholder-gray-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-4 bottom-4 bg-[#FF9D5C] hover:bg-[#FF8A3D] disabled:opacity-60 text-white px-4 py-3 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <i className="ri-send-plane-2-fill text-lg"></i>
                    <span>{submitting ? "Sending..." : "Send"}</span>
                  </button>
                </form>
              </div>

              <h3 className="text-xl font-bold text-gray-900">Your Questions</h3>
              {studentQuestions.length > 0 ? (
                studentQuestions.map((question) => renderQuestionCard(question, false))
              ) : (
                <div className="bg-[#FFE4C4] rounded-3xl p-6 text-gray-700 shadow-md">
                  No questions yet. Use the box below to ask for help.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isVolunteer ? "Assigned Questions" : "Ask a Volunteer"}
              </h3>

              {isVolunteer ? (
                assignedQuestions.length > 0 ? (
                  assignedQuestions.map((question) => renderQuestionCard(question, true))
                ) : (
                  <div className="bg-[#FFE4C4] rounded-3xl p-6 text-gray-700 shadow-md">
                    No questions assigned yet.
                  </div>
                )
              ) : (
                <div className="bg-[#FFE4C4] rounded-3xl p-6 text-gray-700 shadow-md">
                  Volunteer replies will appear here once your question is assigned.
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && !hasContent && (
          <div className="bg-white rounded-3xl p-8 text-center shadow-md">
            <p className="text-gray-600">There are no volunteer questions yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VolunteerPage
