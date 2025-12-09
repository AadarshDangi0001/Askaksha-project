import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

const ChatbotDemo = () => {
  const [searchParams] = useSearchParams();
  const [collegeCode, setCollegeCode] = useState('');
  const [externalToken, setExternalToken] = useState(null);

  useEffect(() => {
    // Get college code and token from URL params (for iframe embedding)
    const code = searchParams.get('code') || 'CLG123456ABCD';
    const token = searchParams.get('token') || null;
    
    setCollegeCode(code);
    setExternalToken(token);
  }, [searchParams]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      padding: '20px'
    }}>
      {collegeCode && (
        <ChatbotWidget 
          collegeCode={collegeCode} 
          externalToken={externalToken} 
        />
      )}
    </div>
  );
};

export default ChatbotDemo;
