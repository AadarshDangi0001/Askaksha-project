import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Add Details",
      number: "01",
      description: "Add college information",
      color: "#FFE4C4",
      route: "/admin/upgrade-data",
    },
    {
      title: "Bullet Board",
      number: "02",
      description: "Manage announcements",
      color: "#FFE4C4",
      route: "/admin/bulletboard",
    },
    {
      title: "Assign Volunteers",
      number: "03",
      description: "Manage volunteers",
      color: "#FFE4C4",
      route: "/admin/assign-volunteers",
    },
    {
      title: "Student Logs",
      number: "04",
      description: "View student queries",
      color: "#FFE4C4",
      route: "/admin/student-logs",
    },
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="Dashboard w-screen   mt-15 h-[92vh] bg-[#E8FDFF] overflow-y-auto pb-10 lg:w-full">
      {/* Hero Section */}
      <div className="DashboardUpper w-full px-0 lg:px-16 py-0 lg:py-6 mt-20 lg:mt-6">
        <div className="DashboardGraphic w-full bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-0 lg:rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[300px] ">
          {/* Background Pattern */}
            
          {/* Kid Image */}
          <img
            className="absolute right-0 lg:right-8 bottom-0 h-full w-[20vw] object-fit z-10"
            src="/imgs/male1.png"
            alt="Dashboard kid"
          />
          
          {/* Text Content */}
          <div className="relative z-20 p-8 lg:p-12 flex items-center h-full">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.9vw] text-white font-normal leading-tight max-w-[60%]"
              style={{ fontFamily: "Righteous, sans-serif" }}
            >
              Bridging the Education Gap <br /> 
              with Smart, Accessible, <br /> 
              and Connected <br />
              Learning Solutions
            </h1>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="DashboardLower px-8 lg:px-16 mt-8 lg:mt-10">
        <div className="w-full">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">Features</h1>

          <div className="FeaturesGrid grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.route)}
                className="DashboardBox bg-[#EFDEC2] rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:scale-105 active:scale-95"
              >
                <h3 className="text-sm lg:text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <div className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4">
                  {feature.number}
                </div>
                <p className="text-[1.2vh] lg:text-base text-blue-600 font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
