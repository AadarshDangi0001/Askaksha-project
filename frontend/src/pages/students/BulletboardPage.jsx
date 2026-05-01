import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';

const BulletboardPage = () => {
  const [bulletins, setBulletins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeBulletin = (notice) => ({
    id: notice._id || notice.id || Date.now(),
    title: notice.title || "Untitled Notice",
    description: notice.description || "",
    expanded: false,
  });

  useEffect(() => {
    const loadBulletins = async () => {
      try {
        setIsLoading(true);
        const data = await studentAPI.getDashboard();
        const notices = data?.college?.notices || [];
        setBulletins(notices.map(normalizeBulletin));
      } catch (err) {
        console.error("Failed to load bulletin board:", err);
        setError(err.message || "Failed to load bulletin board");
      } finally {
        setIsLoading(false);
      }
    };

    loadBulletins();
  }, []);

  const toggleReadMore = (id) => {
    setBulletins((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const getShortText = (text) => {
    if (text.length <= 110) return text;
    return text.substring(0, 110) + "...";
  };

  return (
    <div className="Dashboard mt-15 w-full min-h-screen bg-[#E8FDFF] overflow-y-hidden pb-10">
      {/* Hero Section */}
      <div className="DashboardUpper w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-4 md:py-6 mt-20 lg:mt-0">
        <div className="DashboardGraphic w-full max-w-6xl mx-auto bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-3xl shadow-2xl relative overflow-hidden min-h-[220px] md:min-h-[300px] flex items-center">
          {/* Kid Image */}
          <img
            className="absolute left-2 bottom-0 h-[85%] md:left-8 md:h-full object-contain z-10"
            src="/imgs/kid2.png"
            alt="Bulletin kid"
          />
          
          {/* Text Content */}
          <div className="relative z-20 w-full h-full flex items-center justify-center md:justify-end p-4 sm:p-8 md:p-12 lg:p-16">
            <h1
              className="text-sm sm:text-xl md:text-2xl lg:text-3xl text-white font-normal leading-tight sm:leading-snug max-w-[50%] md:max-w-[55%] text-center md:text-right ml-auto"
              style={{ fontFamily: "Righteous, sans-serif" }}
            >
              Never miss critical updates like fees, exams, circulars, and schedules with our smart bulletin system.
            </h1>
          </div>
        </div>
      </div>

      {/* Bulletins Grid */}
      <div className="BulletinsLower px-4 sm:px-6 lg:px-12 xl:px-16 mt-6 md:mt-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 rounded-xl bg-red-100 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="rounded-2xl bg-white/70 px-6 py-10 text-center text-gray-600">
              Loading bulletin notices...
            </div>
          )}

          {!isLoading && bulletins.length === 0 && (
            <div className="rounded-2xl bg-white/70 px-6 py-10 text-center text-gray-600">
              No notices have been posted by your college yet.
            </div>
          )}

          <div className="BulletinsGrid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {bulletins.map((bulletin) => (
              <div
                key={bulletin.id}
                className="BulletinCard bg-[#EFDEC2] backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {bulletin.title}
                  </h3>
                  <p className="text-sm text-blue-500 leading-relaxed mb-6">
                    {bulletin.expanded
                      ? bulletin.description
                      : getShortText(bulletin.description)}
                  </p>
                </div>
                {bulletin.description.length > 110 ? (
                  <button
                    onClick={() => toggleReadMore(bulletin.id)}
                    className="bg-[#FF9D5C] hover:bg-[#FF8A3D] text-white font-medium py-2 px-6 rounded-lg transition-colors self-start"
                  >
                    {bulletin.expanded ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulletboardPage
