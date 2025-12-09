import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

// Format text with markdown-style formatting
const formatText = (text) => {
  if (!text) return null;
  
  // Split by lines first
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) return <br key={lineIndex} />;
    
    // Process each line for inline formatting
    const parts = [];
    let currentIndex = 0;
    
    // Match **bold** text
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(line.substring(currentIndex, match.index));
      }
      // Add bold text
      parts.push(<strong key={`bold-${lineIndex}-${match.index}`} className="font-bold text-gray-900">{match[1]}</strong>);
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < line.length) {
      parts.push(line.substring(currentIndex));
    }
    
    return (
      <div key={lineIndex} className="mb-2">
        {parts.length > 0 ? parts : line}
      </div>
    );
  });
};

const ScanDocs = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
    });

    newSocket.on('chat-response', (response) => {
      setIsLoading(false);
      
      if (response.error) {
        setError(response.message);
        setOutput("❌ " + response.message);
      } else {
        setOutput(response.message);
        setError(null);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Connection error. Please check if the server is running.');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      // Auto-analyze the file
      await analyzeFile(file);
    }
  };

  const analyzeFile = async (file) => {
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
    
    if (!token) {
      setError('Please login to use this feature');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput("🔍 Analyzing your document...");

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result.split(',')[1];
        
        // Generate a unique chat ID for this analysis
        const chatId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Prepare message payload with file data
        const messagePayload = {
          content: `Please analyze this document and provide a detailed summary.`,
          chat: chatId,
          token: token,
          fileData: base64Data,
          mimeType: file.type,
          fileName: file.name
        };

        // Send to backend via Socket.IO
        socket.emit('student-message', messagePayload);
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File analysis error:', err);
      setError(err.message || 'Failed to analyze file');
      setIsLoading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      if (isCameraOpen) {
        // Close camera
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
        return;
      }

      // Open camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Failed to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(canvas.toDataURL());
        
        // Close camera
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
        
        // Analyze the captured photo
        await analyzeFile(file);
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="w-screen min-h-screen mt-10 bg-[#E8FDFF] overflow-y-auto pb-10 lg:w-full">
      {/* Error Banner */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {error}
        </div>
      )}

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Capture Photo</h3>
              <button 
                onClick={handleCameraCapture}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full rounded-xl mb-4"
            />
            <button
              onClick={capturePhoto}
              className="w-full bg-[#FF993A] hover:bg-[#e88a33] text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <i className="ri-camera-line text-xl"></i>
              Take Photo
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Main Container */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Section - Upload Area */}
          <div className="flex-1">
            <div className="bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-4xl lg:rounded-[3rem] shadow-2xl relative overflow-hidden p-8 lg:p-12 h-[200px] lg:h-[350px] flex items-center gap-6">
              {/* Kid Image */}
              <img
                src="/imgs/kid3.png"
                alt="Scan kid"
                className="h-full max-h-[250px] lg:max-h-[250px] object-contain"
              />
              
              {/* Text Content */}
              <div className="flex-1">
                <h1
                  className="text-1xl sm:text-3xl lg:text-4xl xl:text-4xl text-white font-normal leading-tight"
                  style={{ fontFamily: "Righteous, sans-serif" }}
                >
                  Upload or Scan <br />
                  your Docs for clear <br />
                  understanding
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section - Upload Card */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-lg p-6 min-h-[100px] lg:h-[350px] flex flex-col items-center justify-center gap-4 overflow-hidden">
              {/* Preview Area */}
              {previewUrl && (
                <div className="w-full">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-contain rounded-xl bg-gray-50"
                  />
                  <p className="text-xs text-gray-600 mt-2 text-center truncate px-2">
                    {selectedFile?.name}
                  </p>
                </div>
              )}

              {!previewUrl && (
                <>
                  {/* File Upload Area */}
                  <label htmlFor="file-upload" className="w-full cursor-pointer">
                    <div className="border-2 border-dashed border-[#FF9D5C] rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center hover:bg-orange-50 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                        <i className="ri-file-upload-line text-2xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-400 text-xs text-center">
                        {isLoading ? 'Analyzing...' : 'Select file (PDF, Image)'}
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf"
                      disabled={isLoading}
                    />
                  </label>

                  {/* OR Divider */}
                  <div className="w-full text-center">
                    <span className="text-gray-400 text-sm">or</span>
                  </div>

                  {/* Camera Button */}
                  <button
                    onClick={handleCameraCapture}
                    disabled={isLoading}
                    className="w-full bg-[#FFE4C4] hover:bg-[#FFD9B3] text-[#FF9D5C] font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <i className="ri-camera-line text-lg"></i>
                    Open Camera & Take Photo
                  </button>
                </>
              )}

              {/* Clear Button */}
              {selectedFile && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setOutput("");
                    setError(null);
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                  Clear & Upload New
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="mt-8 lg:mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Analysis Result</h2>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin">
                  <i className="ri-loader-4-line text-2xl"></i>
                </div>
                <span className="font-medium">Analyzing...</span>
              </div>
            )}
          </div>
          <div className="bg-[#CAECFF] rounded-3xl p-8 lg:p-12 min-h-[250px] shadow-md">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-[#FF993A] rounded-full animate-bounce"></span>
                  <span className="w-3 h-3 bg-[#FF993A] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-3 h-3 bg-[#FF993A] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <p className="text-gray-600">Processing your document with AI...</p>
              </div>
            ) : (
              <div className="text-gray-700 text-base lg:text-lg leading-relaxed">
                {output ? formatText(output) : (
                  <div className="text-gray-500">
                    <p className="mb-4">📄 <strong className="font-bold text-gray-700">Upload a document or take a photo</strong> to get instant AI-powered analysis and summary.</p>
                    <p className="font-semibold text-gray-700 mb-2">Supported formats:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>PDF documents</li>
                      <li>Images (JPG, PNG)</li>
                      <li>Screenshots</li>
                      <li>Scanned documents</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanDocs
