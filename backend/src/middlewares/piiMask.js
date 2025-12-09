

const piiMask = (text) => {
  if (!text || typeof text !== "string") return text;



  const maskRules = [
    
    { 
      name: "email", 
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, 
      mask: "[EMAIL_REDACTED]" 
    },
    
   
    { 
      name: "phone", 
      regex: /\b[6-9]\d{9}\b/g, 
      mask: "[PHONE_REDACTED]" 
    },
    

    { 
      name: "aadhaar", 
      regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, 
      mask: "[AADHAAR_REDACTED]" 
    },
    
    
    { 
      name: "pan", 
      regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, 
      mask: "[PAN_REDACTED]" 
    },
    
   
    { 
      name: "rollno", 
      regex: /\b(roll\s?no\.?|enrollment|admission\s?no\.?|student\s?id)\s*:?\s*[0-9A-Za-z\-]+\b/gi, 
      mask: "[ROLLNO_REDACTED]" 
    },
    
  
    { 
      name: "pincode", 
      regex: /\b\d{6}\b/g, 
      mask: "[PINCODE_REDACTED]" 
    },
    
   
    { 
      name: "otp", 
      regex: /\b\d{4,6}\b(?=.*\b(otp|code|verification)\b)/gi, 
      mask: "[OTP_REDACTED]" 
    },
    
   
    { 
      name: "password", 
      regex: /(password|passcode|pwd|secret)\s*:?\s*\S+/gi, 
      mask: "[PASSWORD_REDACTED]" 
    },
    
  
    { 
      name: "card", 
      regex: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4,7}\b/g, 
      mask: "[CARD_REDACTED]" 
    },
    
  
    { 
      name: "dob", 
      regex: /\b(dob|date of birth|born on)\s*:?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi, 
      mask: "[DOB_REDACTED]" 
    },
    
  
    { 
      name: "address", 
      regex: /(full\s?address|home\s?address|residential|location|near|gali|street|colony|apartment|flat|building)\s*:?.{10,}/gi, 
      mask: "[ADDRESS_REDACTED]" 
    },
    
   
    { 
      name: "account", 
      regex: /\b(account|acc\.?)\s?(?:no\.?|number)?\s*:?\s*\d{8,18}\b/gi, 
      mask: "[ACCOUNT_REDACTED]" 
    },
    
   
    { 
      name: "ifsc", 
      regex: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g, 
      mask: "[IFSC_REDACTED]" 
    }
  ];

  let maskedText = text;


  maskRules.forEach(rule => {
    maskedText = maskedText.replace(rule.regex, rule.mask);
  });

  return maskedText;
};

module.exports = piiMask;
