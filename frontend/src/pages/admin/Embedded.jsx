import React, { useState, useEffect } from 'react';
import { DEFAULT_BACKEND_ORIGIN } from '../../config/runtime';

const Embedded = () => {
  const [collegeCode, setCollegeCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [serverUrl, setServerUrl] = useState(DEFAULT_BACKEND_ORIGIN);

  useEffect(() => {
    // Get college code from localStorage
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    setCollegeCode(adminData.collegeCode || 'YOUR_COLLEGE_CODE');
  }, []);

  const embedCode = `<!-- Askaksha AI Chatbot -->
<script src="${serverUrl}/embed-chatbot.js"></script>
<script>
  AskakshaChat.init({
    collegeCode: '${collegeCode}'
  });
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              🤖
            </div>
            <div>
              <h1 className="text-3xl font-bold">Embed Chatbot on Your Website</h1>
              <p className="text-blue-100 mt-1">Add AI assistant to any webpage in seconds</p>
            </div>
          </div>
        </div>

        {/* Quick Start Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-bold text-gray-800">Quick Start Guide</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Copy the embed code below</h3>
                <p className="text-gray-600 text-sm">Your college code is already included in the code</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Paste before closing &lt;/body&gt; tag</h3>
                <p className="text-gray-600 text-sm">Add the code to your website's HTML, right before the &lt;/body&gt; tag</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">Done! Chatbot is live</h3>
                <p className="text-gray-600 text-sm">The AI chatbot will appear on your website instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* College Code Display */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-blue-600 text-xl"></i>
            <div>
              <p className="font-semibold text-blue-900">Your College Code</p>
              <p className="text-blue-700 font-mono text-lg">{collegeCode}</p>
            </div>
          </div>
        </div>

        {/* Embed Code Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-code-s-slash-line text-xl"></i>
              <span className="font-semibold">Embed Code</span>
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <i className="ri-check-line"></i>
                  Copied!
                </>
              ) : (
                <>
                  <i className="ri-file-copy-line"></i>
                  Copy Code
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-900 p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono leading-relaxed">
              {embedCode}
            </pre>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>✨</span>
            Features Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '💬', title: 'AI-Powered Chat', desc: 'Intelligent responses using advanced AI' },
              { icon: '📎', title: 'File Upload', desc: 'Upload images and PDFs for analysis' },
              { icon: '⚡', title: 'Real-time', desc: 'Instant responses via Socket.IO' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Works perfectly on all devices' },
              { icon: '🎨', title: 'Beautiful UI', desc: 'Modern, professional design' },
              { icon: '🔒', title: 'Secure', desc: 'College-specific data isolation' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="ri-settings-3-line"></i>
            Advanced Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Server URL
              </label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://your-backend-domain.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                Change this if you're hosting the chatbot on a different server
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Code
              </label>
              <input
                type="text"
                value={collegeCode}
                onChange={(e) => setCollegeCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="YOUR_COLLEGE_CODE"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your unique college identifier
              </p>
            </div>
          </div>
        </div>

        {/* Example Usage */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="ri-file-code-line"></i>
            Complete Example
          </h2>
          
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono leading-relaxed">
{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My College Website</title>
</head>
<body>
  <h1>Welcome to ${collegeCode === 'YOUR_COLLEGE_CODE' ? 'My College' : collegeCode}</h1>
  <p>Your website content here...</p>

  ${embedCode}
</body>
</html>`}
            </pre>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <i className="ri-customer-service-2-line"></i>
            Need Help?
          </h2>
          <p className="mb-4 text-purple-100">
            Having trouble integrating the chatbot? We're here to help!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <i className="ri-book-open-line text-2xl"></i>
                <div>
                  <p className="font-semibold">Documentation</p>
                  <p className="text-sm text-purple-100">Complete integration guide</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <i className="ri-question-answer-line text-2xl"></i>
                <div>
                  <p className="font-semibold">Support Chat</p>
                  <p className="text-sm text-purple-100">Get instant assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mt-6">
          <div className="flex items-start gap-2">
            <i className="ri-lightbulb-line text-yellow-600 text-xl mt-1"></i>
            <div>
              <p className="font-semibold text-yellow-900">Pro Tip</p>
              <p className="text-yellow-800 text-sm">
                Test the chatbot on a staging site first before deploying to production. 
                The chatbot will automatically use your college's data and branding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Embedded;
