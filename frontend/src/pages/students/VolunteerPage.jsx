import React, { useEffect, useMemo, useState } from 'react'
import { studentAPI, volunteerAPI } from '../../services/api'

const VolunteerPage = () => {
  const [message, setMessage] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [collegeFeed, setCollegeFeed] = useState([]);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [openReplies, setOpenReplies] = useState({});
  const [openReplyBox, setOpenReplyBox] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVolunteerData = async () => {
      try {
        setLoading(true);
        setError("");

        const dashboard = await studentAPI.getDashboard();
        setIsVolunteer(!!dashboard.isVolunteer);
        setCurrentStudentId(dashboard.studentId || dashboard.student?._id || "");

        const feedResponse = await volunteerAPI.getCollegeFeed();
        setCollegeFeed(feedResponse.questions || []);
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
        setCollegeFeed((prev) => [response.question, ...prev]);
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

  const toggleReplies = (questionId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleReplyBox = (questionId) => {
    setOpenReplyBox((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleVolunteerReplyAction = (questionId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [questionId]: true,
    }));
    setOpenReplyBox((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
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
        setCollegeFeed((prev) =>
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
    () => collegeFeed.length > 0,
    [collegeFeed.length]
  );

  const renderQuestionCard = (question) => {
    const replies = question.replies || [];
    const isOwnQuestion = currentStudentId && String(question.student?._id || question.student || "") === String(currentStudentId);
    const repliesOpen = !!openReplies[question._id];
    const replyBoxOpen = !!openReplyBox[question._id];

    return (
      <div key={question._id} className={`rounded-[2rem] border shadow-lg overflow-hidden ${isOwnQuestion ? 'border-[#FF9D5C]/30 bg-white' : 'border-white/50 bg-white'}`}>
        <div className="p-5 lg:p-6 bg-gradient-to-br from-white to-[#FFF8F0]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {question.student?.name || "Student"}
                </h3>
                {isOwnQuestion && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFEDD5] text-[#C2410C]">
                    Yours
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${question.status === "answered" ? "bg-green-100 text-green-700" : question.status === "assigned" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                  {question.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{formatDate(question.createdAt)}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Replies</p>
              <p className="text-lg font-bold text-gray-900">{replies.length}</p>
            </div>
          </div>

          <p className="text-gray-800 text-[1.02rem] leading-relaxed whitespace-pre-wrap mb-4">
            {question.question}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {!isVolunteer ? (
              <button
                type="button"
                onClick={() => toggleReplies(question._id)}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:border-[#FF9D5C] hover:text-[#C2410C] transition-colors"
              >
                {repliesOpen ? "Hide Reply" : "See Reply"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleVolunteerReplyAction(question._id)}
                className="rounded-full px-4 py-2 text-sm font-semibold transition-colors bg-[#FF9D5C] text-white hover:bg-[#FF8A3D]"
              >
                Reply
              </button>
            )}
          </div>

          {repliesOpen && (
            <div className="mt-5 space-y-3">
              {replies.length > 0 ? (
                replies.map((reply, index) => (
                  <div key={`${question._id}-reply-${index}`} className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-semibold text-sm text-gray-900">
                        {reply.volunteer?.name || "Volunteer"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500">
                  No reply yet.
                </div>
              )}
            </div>
          )}

          {isVolunteer && replyBoxOpen && (
            <div className="mt-5 rounded-3xl border border-[#FFD3AD] bg-[#FFF7ED] p-4">
              <textarea
                value={replyDrafts[question._id] || ""}
                onChange={(e) => handleReplyChange(question._id, e.target.value)}
                placeholder="Write your reply..."
                className="w-full min-h-28 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#FF9D5C] resize-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSendReply(question._id)}
                  disabled={replyingId === question._id}
                  className="rounded-full bg-[#3B7DDD] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5A97E4] disabled:opacity-60 transition-colors"
                >
                  {replyingId === question._id ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#E8FDFF] overflow-y-auto pb-36">
      <div className="w-full px-4 sm:px-6 lg:px-16 py-6 mt-24 lg:mt-16">
        <div className="mb-5 lg:mb-8 rounded-[2rem] bg-gradient-to-r from-[#3B9FFF] to-[#5FB4FF] px-6 py-6 lg:px-8 lg:py-8 shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-2 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-white/80 font-semibold">Volunteer Help</p>
            <h2 className="text-2xl lg:text-4xl font-bold leading-tight">Shared questions for your college</h2>
            <p className="text-white/90 text-sm lg:text-base">
              Everyone in your college can see the questions. Students can check replies, and any volunteer can answer any question.
            </p>
            {isVolunteer && (
              <p className="inline-flex w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                Volunteer mode enabled
              </p>
            )}
          </div>
          <div className="absolute right-0 top-0 h-full w-40 lg:w-72 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_65%)]"></div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-lg">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF9D5C] border-t-transparent"></div>
            <p className="text-gray-600">Loading volunteer feed...</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] bg-red-50 p-6 text-center shadow-lg">
            <p className="font-semibold text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-5">
            {collegeFeed.length > 0 ? (
              collegeFeed.map((question) => renderQuestionCard(question))
            ) : (
              <div className="rounded-[2rem] bg-white p-8 text-center shadow-lg">
                <p className="text-gray-600">No questions have been posted yet.</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && !hasContent && (
          <div className="mt-4 rounded-[2rem] bg-white p-8 text-center shadow-lg">
            <p className="text-gray-600">There are no volunteer questions yet.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-[16vw] z-40 border-t border-white/60 bg-[#E8FDFF]/95 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-4">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="sr-only" htmlFor="volunteer-question">Type your question</label>
              <textarea
                id="volunteer-question"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question here..."
                rows={1}
                className="w-full min-h-14 max-h-32 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-4 text-gray-800 shadow-sm outline-none placeholder:text-gray-400 focus:border-[#FF9D5C] focus:ring-2 focus:ring-[#FF9D5C]/15"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF9D5C] px-5 mb-2 text-sm font-bold text-white shadow-md shadow-orange-200 transition-colors hover:bg-[#FF8A3D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <i className="ri-send-plane-2-fill text-base"></i>
              <span>{submitting ? "Sending" : "Send"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VolunteerPage
