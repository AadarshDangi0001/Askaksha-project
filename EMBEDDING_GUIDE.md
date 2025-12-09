# Askaksha AI Chatbot - Embedding Guide

## 🚀 Quick Start

Add the Askaksha AI chatbot to any website with just 2 lines of code!

### Step 1: Add the Script

Add this code right before the closing `</body>` tag of your HTML:

```html
<!-- Askaksha AI Chatbot -->
<script src="http://localhost:5050/embed-chatbot.js"></script>
<script>
  AskakshaChat.init({
    collegeCode: 'YOUR_COLLEGE_CODE'
  });
</script>
```

### Step 2: Replace College Code

Replace `YOUR_COLLEGE_CODE` with your actual college code (e.g., `MIT_2024`, `HARVARD_COLLEGE`)

## ✨ Features

- 💬 **AI-Powered Responses** - Intelligent chatbot using advanced AI
- 📎 **File Upload** - Upload images and PDFs for analysis
- 🎨 **Beautiful UI** - Modern, responsive design
- ⚡ **Real-time** - Instant responses via Socket.IO
- 📱 **Mobile-Friendly** - Works on all devices
- 🔒 **Secure** - College-specific data isolation

## 📋 Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My College Website</title>
</head>
<body>
  <h1>Welcome to My College</h1>
  <p>Your website content here...</p>

  <!-- Askaksha AI Chatbot -->
  <script src="http://localhost:5050/embed-chatbot.js"></script>
  <script>
    AskakshaChat.init({
      collegeCode: 'MIT_COLLEGE_2024'
    });
  </script>
</body>
</html>
```

## ⚙️ Configuration Options

```javascript
AskakshaChat.init({
  collegeCode: 'YOUR_COLLEGE_CODE',      // Required: Your college identifier
  serverUrl: 'http://localhost:5050'     // Optional: Custom server URL
});
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `collegeCode` | String | Yes | Your unique college identifier |
| `serverUrl` | String | No | Custom server URL (default: http://localhost:5050) |

## 🎯 What It Does

1. **Loads chatbot widget** - Floating button appears in bottom-right
2. **Click to open** - Beautiful chat window slides up
3. **Type messages** - Get AI-powered responses
4. **Upload files** - Send images or PDFs for analysis
5. **Real-time chat** - Instant communication with AI

## 🌐 Browser Support

✅ Works on all modern browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Support

The chatbot automatically adapts to mobile screens:
- Responsive design
- Touch-friendly interface
- Optimized for small screens

## 🎨 UI Preview

### Desktop View
- Floating button in bottom-right corner
- Chat window: 400px × 600px
- Modern gradient design
- Smooth animations

### Mobile View
- Full-width chat window
- Touch-optimized controls
- Auto-adjusts to screen size

## 🔧 Technical Details

### What Gets Loaded
1. **JavaScript file** (~20KB compressed)
2. **Socket.IO client** (auto-loaded from CDN)
3. **Inline CSS** (scoped to avoid conflicts)

### No Dependencies Required
- No jQuery needed
- No Bootstrap required
- No external CSS files
- Works with any website

## 🛡️ Security

- **College isolation** - Each college has separate data
- **Guest mode** - Safe for public websites
- **File validation** - Only images and PDFs allowed
- **Size limits** - Max 10MB per file

## 📊 Data Privacy

- Messages are associated with college code
- No personal data required
- Guest sessions are temporary
- Complies with privacy standards

## 🚨 Troubleshooting

### Chatbot not appearing?
1. Check if script URL is correct
2. Verify college code is provided
3. Check browser console for errors
4. Ensure backend server is running

### Not connecting?
1. Check `serverUrl` setting
2. Verify server is accessible
3. Check firewall settings
4. Look for CORS errors in console

### File upload not working?
1. Check file type (only images/PDFs)
2. Verify file size (max 10MB)
3. Ensure Socket.IO is connected
4. Check browser console for errors

## 📞 Support

Need help? Contact us:
- 📧 Email: support@askaksha.com
- 📚 Documentation: Check your dashboard
- 💬 Live chat: Use the chatbot on our website

## 🎓 Examples

### WordPress Integration
```php
<?php
// In your footer.php or functions.php
function add_askaksha_chatbot() {
    ?>
    <script src="http://localhost:5050/embed-chatbot.js"></script>
    <script>
      AskakshaChat.init({
        collegeCode: '<?php echo get_option('college_code'); ?>'
      });
    </script>
    <?php
}
add_action('wp_footer', 'add_askaksha_chatbot');
?>
```

### React Integration
```javascript
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:5050/embed-chatbot.js';
    script.onload = () => {
      window.AskakshaChat.init({
        collegeCode: 'YOUR_COLLEGE_CODE'
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div>Your app content</div>;
}
```

### Static HTML
```html
<!-- Just paste before </body> -->
<script src="http://localhost:5050/embed-chatbot.js"></script>
<script>
  AskakshaChat.init({ collegeCode: 'YOUR_COLLEGE_CODE' });
</script>
```

## 🔄 Updates

The chatbot automatically updates when you refresh the page. No manual updates needed!

## 📝 License

© 2024 Askaksha. All rights reserved.

---

**Made with ❤️ by the Askaksha Team**
