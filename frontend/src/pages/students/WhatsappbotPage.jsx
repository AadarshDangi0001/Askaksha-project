import React from 'react'

const WhatsappbotPage = () => {
  const steps = [
    "Add +91 9516010257 in your WhatsApp",
    "Join Offical Doubt group and use bot"
  ];

  const features = [
    "Get 24/7 support on WhatsApp",
    "Not need to download additional App"
  ];

  return (
    <div className="w-full mt-10 min-h-screen bg-[#E8FDFF] overflow-y-auto pb-10">
      {/* Main Container */}
      <div className="w-full px-0 lg:px-16 py-0 lg:py-6 mt-20 lg:mt-6">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-0 lg:rounded-[3rem] shadow-2xl p-8 lg:p-0 flex items-center gap-6 lg:gap-12 min-h-[200px] mb-8">
          {/* Kid Image */}
          <img
            src="/imgs/kid4.png"
            alt="WhatsApp kid"
            className="h-52 lg:h-70 object-contain"
          />
          
          {/* Text Content */}
          <div className="flex-1">
            <h1
              className="text-xl sm:text-3xl lg:text-4xl xl:text-4xl text-white font-normal leading-tight"
              style={{ fontFamily: "Righteous, sans-serif" }}
            >
              Add our Askaksha in your WhatsApp <br />
              to get fully support any time <br />
              anywhere
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-8 lg:px-0">
          {/* Left Section - Steps and Features */}
          <div className="flex-1">
            {/* Steps Section */}
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Steps to access askaksha in whatsapp</h2>
              <ul className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-800 text-lg">{step}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 bg-[#FF9D5C] hover:bg-[#FF8A3D] text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                JOIN GROUP
              </button>
            </div>

            {/* Features Section */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Features of whatsApp Askaksha</h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 shrink-0"></span>
                    <span className="text-gray-800 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section - Mobile Image */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/imgs/mobile.png"
              alt="WhatsApp screens"
              className="w-full max-w-md lg:max-w-lg object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsappbotPage