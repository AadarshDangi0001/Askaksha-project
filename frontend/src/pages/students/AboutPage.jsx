import React from 'react'

const AboutPage = () => {
  const features = [
    {
      icon: "ri-message-2-line",
      title: "Chat AI",
      description: "24/7 AI-powered assistant to help answer your college-related queries instantly. Get personalized responses and guidance anytime, anywhere."
    },
    {
      icon: "ri-book-open-line",
      title: "Bulletin Board",
      description: "Stay updated with important announcements, exam schedules, fee deadlines, and college events. Never miss critical information again."
    },
    {
      icon: "ri-team-line",
      title: "Volunteer Help",
      description: "Connect with experienced volunteers and peers who can help with your doubts and questions. Get real human support when you need it."
    },
    {
      icon: "ri-camera-line",
      title: "Scan Docs",
      description: "Upload or scan your documents to get instant summaries and explanations. Understand complex materials quickly and easily."
    },
    {
      icon: "ri-wechat-2-line",
      title: "WhatsApp Bot",
      description: "Access all features directly through WhatsApp. Get answers and updates on your favorite messaging platform."
    },
    {
      icon: "ri-wifi-off-line",
      title: "Offline Mode",
      description: "Continue accessing essential features even without internet connection. Learning never stops, even offline."
    },
    {
      icon: "ri-robot-line",
      title: "AI Agent",
      description: "Advanced AI agent that can perform complex tasks and provide in-depth analysis for your academic needs."
    }
  ];

  const teamMembers = [
    {
      name: "Development Team",
      role: "Full Stack Developers",
      description: "Building innovative solutions for education"
    },
    {
      name: "AI Team",
      role: "Machine Learning Engineers",
      description: "Creating intelligent learning experiences"
    },
    {
      name: "Design Team",
      role: "UI/UX Designers",
      description: "Crafting beautiful and intuitive interfaces"
    }
  ];

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-10">
      {/* Hero Section */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        <div className="bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-4xl lg:rounded-[3rem] shadow-2xl p-8 lg:p-16 text-center">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-normal mb-6"
            style={{ fontFamily: "Righteous, sans-serif" }}
          >
            About Askly
          </h1>
          <p className="text-white text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
            Askly is an innovative educational platform designed to bridge the education gap by providing 
            smart, accessible, and connected learning solutions for students. We leverage AI technology 
            to make quality education accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full px-8 lg:px-16 mt-10 lg:mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Our mission is to democratize education by providing students with intelligent tools that 
              make learning easier, faster, and more accessible. We believe that every student deserves 
              access to quality educational support, regardless of their location or resources.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Through our AI-powered platform, we aim to eliminate barriers to learning and empower 
              students to achieve their full potential by providing instant answers, personalized guidance, 
              and continuous support.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-8 lg:px-16 mt-10 lg:mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-900">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#3B9FFF] rounded-xl flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="w-full px-8 lg:px-16 mt-10 lg:mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-900">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-[#EFDEC2] rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-[#FF9D5C] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="ri-team-line text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-[#FF9D5C] font-medium mb-3">{member.role}</p>
                <p className="text-gray-700">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="w-full px-8 lg:px-16 mt-10 lg:mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-900">Technology Stack</h2>
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E8FDFF] rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <i className="ri-reactjs-line text-3xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">React</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E8FDFF] rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <i className="ri-nodejs-line text-3xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">Node.js</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E8FDFF] rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <i className="ri-database-2-line text-3xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">MongoDB</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E8FDFF] rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <i className="ri-brain-line text-3xl text-[#3B9FFF]"></i>
                </div>
                <p className="font-semibold text-gray-900">AI/ML</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="w-full px-8 lg:px-16 mt-10 lg:mt-16 mb-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-gray-900">Contact Us</h2>
          <div className="bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-3xl p-8 lg:p-12 text-center">
            <p className="text-white text-lg mb-6">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@askly.com"
                className="bg-white text-[#3B9FFF] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <i className="ri-mail-line"></i>
                support@askly.com
              </a>
              <a 
                href="tel:+1234567890"
                className="bg-[#FF9D5C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF8A3D] transition-colors inline-flex items-center justify-center gap-2"
              >
                <i className="ri-phone-line"></i>
                +123 456 7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage