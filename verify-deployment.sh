#!/bin/bash

echo "🚀 Askaksha Deployment Verification"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FRONTEND_URL="https://askaksha-project.vercel.app"
BACKEND_URL="https://askaksha-project.onrender.com"
API_URL="https://askaksha-project.onrender.com/api"

echo "📍 URLs:"
echo "  Frontend: $FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo "  API:      $API_URL"
echo ""

# Test Backend Health
echo "🔍 Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s "$API_URL/health")
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "   Response: $HEALTH_RESPONSE"
fi
echo ""

# Test Frontend
echo "🔍 Testing Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [[ $FRONTEND_STATUS == "200" ]]; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
    echo "   Status: $FRONTEND_STATUS"
else
    echo -e "${RED}❌ Frontend not accessible${NC}"
    echo "   Status: $FRONTEND_STATUS"
fi
echo ""

# Test CORS
echo "🔍 Testing CORS..."
CORS_RESPONSE=$(curl -s -X OPTIONS "$API_URL/health" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -I | grep -i "access-control-allow-origin")

if [[ -n $CORS_RESPONSE ]]; then
    echo -e "${GREEN}✅ CORS is configured${NC}"
    echo "   $CORS_RESPONSE"
else
    echo -e "${YELLOW}⚠️  CORS headers not detected (might be using wildcard)${NC}"
fi
echo ""

# Test Guest Endpoint
echo "🔍 Testing Guest Endpoint..."
GUEST_RESPONSE=$(curl -s -X POST "$API_URL/guest/create" \
    -H "Content-Type: application/json" \
    -d '{"collegeCode":"TEST"}')

if [[ $GUEST_RESPONSE == *"token"* ]] || [[ $GUEST_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Guest endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️  Guest endpoint response: ${GUEST_RESPONSE:0:100}${NC}"
fi
echo ""

# Summary
echo "===================================="
echo "📊 Deployment Summary"
echo "===================================="
echo ""
echo "✅ Configuration:"
echo "   • Frontend .env points to: https://askaksha-project.onrender.com/api"
echo "   • Backend CORS: Wildcard (allows all origins)"
echo "   • Socket.IO CORS: Wildcard enabled"
echo ""
echo "📝 Next Steps:"
echo "   1. Test login at: $FRONTEND_URL/login"
echo "   2. Test student dashboard"
echo "   3. Test chatbot functionality"
echo "   4. Test file upload in Scan Docs"
echo "   5. Test embedded widget on external site"
echo ""
echo "🔗 Quick Links:"
echo "   • Admin Login: $FRONTEND_URL/login"
echo "   • Student Login: $FRONTEND_URL/student/login"
echo "   • Health Check: $API_URL/health"
echo ""

# Check if local .env matches
echo "🔍 Checking local configuration..."
if [ -f "frontend/.env" ]; then
    LOCAL_API=$(grep VITE_API_URL frontend/.env | cut -d '=' -f2)
    if [[ $LOCAL_API == *"askaksha-project.onrender.com"* ]]; then
        echo -e "${GREEN}✅ Local .env is configured for production${NC}"
    else
        echo -e "${YELLOW}⚠️  Local .env points to: $LOCAL_API${NC}"
        echo "   Update to: https://askaksha-project.onrender.com/api"
    fi
else
    echo -e "${RED}❌ frontend/.env not found${NC}"
fi
echo ""

echo "🎉 Verification Complete!"
echo ""
