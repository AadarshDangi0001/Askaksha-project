# 🚀 Production Deployment Setup

## Your Deployment URLs
- **Frontend (Vercel)**: https://askaksha-project.vercel.app
- **Backend (Render)**: https://askaksha-project.onrender.com
- **API**: https://askaksha-project.onrender.com/api

---

## ✅ Quick Verification

Run the verification script:
```bash
./verify-deployment.sh
```

Or test manually:
```bash
# Test backend health
curl https://askaksha-project.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","environment":"production"}
```

---

## 🔧 Render Backend Configuration

### Environment Variables (Set in Render Dashboard)

Go to: Render Dashboard → askaksha-project → Environment

**Required Variables:**
```env
PORT=5050
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/askaksha
JWT_SECRET=your_strong_secret_minimum_32_characters
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=askly-final
```

**Optional (for features):**
```env
FRONTEND_URL=https://askaksha-project.vercel.app
WHATSAPP_NUMBER=1234567890
```

### Build & Start Commands
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Branch**: `main`
- **Auto-Deploy**: ✅ Enabled

---

## 🎨 Vercel Frontend Configuration

### Environment Variables (Set in Vercel Dashboard)

Go to: Vercel Dashboard → askaksha-project → Settings → Environment Variables

**Add:**
```
Name:  VITE_API_URL
Value: https://askaksha-project.onrender.com/api
```

### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x

---

## ✅ Configuration Checklist

### Backend (Render)
- [x] CORS allows all origins (for widget embedding)
- [x] Socket.IO CORS configured
- [x] Health check endpoint added: `/api/health`
- [x] All routes prefixed with `/api`
- [x] Static files served from `/public`
- [x] MongoDB connection configured
- [x] Environment variables set

### Frontend (Vercel)
- [x] `.env` updated to Render backend
- [x] `vercel.json` configured for SPA routing
- [x] Build tested locally
- [x] Environment variable set in Vercel

---

## 🧪 Testing Checklist

### 1. Backend Tests
```bash
# Health check
curl https://askaksha-project.onrender.com/api/health

# Guest endpoint
curl -X POST https://askaksha-project.onrender.com/api/guest/create \
  -H "Content-Type: application/json" \
  -d '{"collegeCode":"TEST"}'
```

### 2. Frontend Tests
- [ ] Visit https://askaksha-project.vercel.app
- [ ] No console errors
- [ ] Assets load correctly
- [ ] Routing works (refresh on any page)

### 3. Integration Tests
- [ ] Admin login works
- [ ] Student registration works
- [ ] Student login works
- [ ] Chatbot connects (Socket.IO)
- [ ] Chatbot responds to messages
- [ ] File upload works (Scan Docs)
- [ ] WhatsApp fallback appears after timeout
- [ ] Embedded widget works on external site

### 4. Embedded Widget Test
Create a test HTML file:
```html
<!DOCTYPE html>
<html>
<head><title>Widget Test</title></head>
<body>
  <h1>Test Embedded Chatbot</h1>
  
  <script src="https://askaksha-project.onrender.com/embed-chatbot.js"></script>
  <script>
    AskakshaChat.init({
      collegeCode: 'TEST_COLLEGE'
    });
  </script>
</body>
</html>
```

---

## 🔍 Monitoring

### Check Render Logs
```bash
# Go to Render Dashboard → Logs
# Look for:
- [App] Server running on port 5050
- [App] MongoDB connected
- [App] WhatsApp Bot integration enabled
```

### Check Vercel Logs
```bash
# Go to Vercel Dashboard → Deployments → Latest
# Check build logs for errors
```

### Common Log Messages (Normal)
```
✅ Server running on port 5050
✅ MongoDB connected
✅ [App] Initializing WhatsApp Bot...
✅ [WhatsApp Bot] Initializing...
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: Frontend shows blank page
**Cause**: API URL incorrect
**Fix**: 
1. Check `frontend/.env` has: `VITE_API_URL=https://askaksha-project.onrender.com/api`
2. Rebuild and redeploy:
```bash
cd frontend
npm run build
git add .
git commit -m "Fix API URL"
git push origin main
```

### Issue 2: CORS errors in browser console
**Cause**: Backend CORS not allowing frontend
**Fix**: Already configured with wildcard (`origin: "*"`) - should work

### Issue 3: 404 on page refresh
**Cause**: Missing SPA routing config
**Fix**: Already fixed - `vercel.json` has rewrites

### Issue 4: Socket.IO connection failed
**Cause**: CORS or backend sleeping (Render free tier)
**Fix**:
- Check backend is running: `curl https://askaksha-project.onrender.com/api/health`
- Wait 30 seconds on first request (cold start)
- Check browser console for exact error

### Issue 5: WhatsApp bot not working
**Cause**: Render free tier goes to sleep, WhatsApp needs persistent connection
**Solution**: 
- Upgrade to Render paid tier ($7/month) for always-on
- Or deploy WhatsApp bot separately on VPS

---

## 🚀 Deployment Commands

### Update Backend (Render auto-deploys)
```bash
git add backend/
git commit -m "Update backend"
git push origin main
# Render auto-deploys from GitHub
```

### Update Frontend (Vercel auto-deploys)
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys from GitHub
```

### Manual Deploy Frontend
```bash
cd frontend
npm run build
vercel --prod
```

---

## 📊 Performance Notes

### Render Free Tier
- **Cold Start**: ~30 seconds after 15 minutes of inactivity
- **Sleep Time**: After 15 minutes of no requests
- **Solution**: Upgrade to paid tier ($7/month) for always-on

### Optimization Tips
1. **Keep Backend Warm**: Use a service like UptimeRobot to ping every 5 minutes
2. **Optimize Images**: Use WebP format, compress files
3. **Enable Caching**: Add cache headers for static assets
4. **CDN**: Vercel automatically uses CDN for frontend

---

## 🔐 Security Checklist

- [x] `JWT_SECRET` is strong (32+ characters)
- [x] MongoDB uses authentication
- [x] CORS configured (wildcard for widget embedding)
- [x] HTTPS enabled (automatic on Vercel & Render)
- [x] Environment variables not in Git
- [x] `.env` in `.gitignore`
- [ ] Rate limiting (optional, add if needed)
- [ ] Input validation (verify in production)

---

## 📱 Mobile Testing

Test on mobile devices:
- [ ] Responsive design works
- [ ] Chatbot widget opens
- [ ] File upload works
- [ ] Touch interactions smooth

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at https://askaksha-project.vercel.app
- ✅ Backend responds at https://askaksha-project.onrender.com/api/health
- ✅ Login works (admin and student)
- ✅ Chatbot connects and responds
- ✅ File upload works
- ✅ Embedded widget loads on external sites
- ✅ No CORS errors in console
- ✅ No 404 errors on page refresh

---

## 📞 Support Links

- **Render Status**: https://status.render.com
- **Vercel Status**: https://www.vercelstatus.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Your Render Dashboard**: https://dashboard.render.com
- **Your Vercel Dashboard**: https://vercel.com/dashboard

---

## 🎉 You're Live!

Your Askaksha platform is deployed and accessible at:
- **Students**: https://askaksha-project.vercel.app
- **Admin**: https://askaksha-project.vercel.app/login
- **API Docs**: https://askaksha-project.vercel.app/api-docs (if you add them)

**Next Steps:**
1. Share admin credentials with your team
2. Create first college account
3. Test with real students
4. Share embedded code with colleges
5. Monitor usage and performance
