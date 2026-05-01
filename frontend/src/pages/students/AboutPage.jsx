import React from 'react'

const AboutPage = () => {
  const features = [
    {
      icon: "ri-message-2-fill",
      title: "AI Chat Assistant",
      description: "Get instant answers to your questions 24/7 with our intelligent chatbot"
    },
    {
      icon: "ri-scan-line",
      title: "Smart Document Scanner",
      description: "Scan and analyze documents to extract key information instantly"
    },
    {
      icon: "ri-global-line",
      title: "Multi-language Support",
      description: "Communicate in your preferred language with automatic translation"
    },
    {
      icon: "ri-brain-line",
      title: "AI-Powered Learning",
      description: "Personalized learning experience powered by advanced AI"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Colleges" },
    { number: "99%", label: "Satisfaction" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#E8FDFF] via-[#F0F9FF] to-[#E8FDFF] overflow-y-auto">
      {/* Hero Section */}
      <div className="w-full px-6 lg:px-16 py-12 mt-16 lg:mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#3B9FFF] to-[#5FB4FF] bg-clip-text text-transparent"
              style={{ fontFamily: "Righteous, sans-serif" }}
            >
              About Askaksha
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Empowering students with AI-driven solutions for accessible and personalized learning experiences
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-3xl lg:text-4xl font-bold text-[#3B9FFF] mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full px-6 lg:px-16 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-3xl p-8 lg:p-16 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-white/90 text-lg leading-relaxed mb-4">
                  To democratize education by providing AI-powered tools that make learning accessible, 
                  engaging, and effective for students across all backgrounds.
                </p>
                <p className="text-white/90 text-lg leading-relaxed">
                  We believe every student deserves quality educational support, regardless of their 
                  location or resources.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <i className="ri-graduation-cap-line text-8xl text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-6 lg:px-16 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B9FFF] to-[#5FB4FF] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <i className={`${feature.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="w-full px-6 lg:px-16 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-10 text-gray-900">
              Powered By
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8FDFF] to-[#CAECFF] rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <i className="ri-reactjs-line text-4xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">React</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8FDFF] to-[#CAECFF] rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <i className="ri-nodejs-line text-4xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">Node.js</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8FDFF] to-[#CAECFF] rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <i className="ri-database-2-line text-4xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">MongoDB</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8FDFF] to-[#CAECFF] rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <i className="ri-brain-line text-4xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">Gemini AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      
    </div>
  )
}

export default AboutPage