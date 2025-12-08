import React from 'react'

const BulletboardPage = () => {
  const bulletins = [
    {
      id: 1,
      title: "Fees Deadline",
      description: "Fees submission last date was 30 july 2025 summit it before 30 july otherwise you have to pay 20rs fine per day"
    },
    {
      id: 2,
      title: "Fees Deadline",
      description: "Fees submission last date was 30 july 2025 summit it before 30 july otherwise you have to pay 20rs fine per day"
    },
    {
      id: 3,
      title: "Fees Deadline",
      description: "Fees submission last date was 30 july 2025 summit it before 30 july otherwise you have to pay 20rs fine per day"
    },
    {
      id: 4,
      title: "Fees Deadline",
      description: "Fees submission last date was 30 july 2025 summit it before 30 july otherwise you have to pay 20rs fine per day"
    },
    {
      id: 5,
      title: "Fees Deadline",
      description: "Fees submission last date was 30 july 2025 summit it before 30 july otherwise you have to pay 20rs fine per day"
    },
    {
      id: 6,
      title: "Fees Deadline",
      description: "Fees submission last date was 30 july 2025 summit it before 30 july otherwise you have to pay 20rs fine per day"
    }
  ];

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
                    {bulletin.description}
                  </p>
                </div>
                <button className="bg-[#FF9D5C] hover:bg-[#FF8A3D] text-white font-medium py-2 px-6 rounded-lg transition-colors self-start">
                  Read more
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulletboardPage
