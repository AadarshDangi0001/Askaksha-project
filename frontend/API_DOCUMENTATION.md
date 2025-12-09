# API Service Documentation

This file contains all the API endpoints used in the frontend application.

## Base URL
- Development: `http://localhost:5050/api`
- Production: Set via `VITE_API_URL` environment variable

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Available APIs

### 1. Admin API (`adminAPI`)

#### Register Admin
```javascript
adminAPI.register(email, password)
```
- **Endpoint:** `POST /api/admin/register`
- **Body:** `{ email, password }`
- **Returns:** `{ success, message, data: { admin, token } }`

#### Login Admin
```javascript
adminAPI.login(email, password)
```
- **Endpoint:** `POST /api/admin/login`
- **Body:** `{ email, password }`
- **Returns:** `{ success, message, data: { admin, token } }`

#### Get Admin Profile
```javascript
adminAPI.getProfile()
```
- **Endpoint:** `GET /api/admin/profile`
- **Auth Required:** Yes
- **Returns:** `{ success, data: { admin, college } }`

#### Change Password
```javascript
adminAPI.changePassword(currentPassword, newPassword)
```
- **Endpoint:** `PUT /api/admin/change-password`
- **Auth Required:** Yes
- **Body:** `{ currentPassword, newPassword }`
- **Returns:** `{ success, message }`

---

### 2. College API (`collegeAPI`)

#### Create College
```javascript
collegeAPI.create(collegeData)
```
- **Endpoint:** `POST /api/college`
- **Auth Required:** Yes (Admin)
- **Body:** College data object
- **Returns:** `{ success, data: { college } }`

#### Get All Colleges
```javascript
collegeAPI.getAll()
```
- **Endpoint:** `GET /api/college`
- **Auth Required:** Yes
- **Returns:** `{ success, data: { colleges } }`

#### Get College by Code
```javascript
collegeAPI.getByCode(collegeCode)
```
- **Endpoint:** `GET /api/college/:collegeCode`
- **Auth Required:** Yes
- **Returns:** `{ success, data: { college } }`

#### Update College
```javascript
collegeAPI.update(collegeCode, collegeData)
```
- **Endpoint:** `PUT /api/college/:collegeCode`
- **Auth Required:** Yes (Admin)
- **Body:** College data object
- **Returns:** `{ success, data: { college } }`

#### Delete College
```javascript
collegeAPI.delete(collegeCode)
```
- **Endpoint:** `DELETE /api/college/:collegeCode`
- **Auth Required:** Yes (Admin)
- **Returns:** `{ success, message }`

---

### 3. Student API (`studentAPI`)

#### Register Student
```javascript
studentAPI.register(name, email, password, collegeCode)
```
- **Endpoint:** `POST /api/student/register`
- **Body:** `{ name, email, password, collegeCode }`
- **Returns:** `{ success, message, data: { student, college, token } }`

#### Login Student
```javascript
studentAPI.login(email, password, collegeCode)
```
- **Endpoint:** `POST /api/student/login`
- **Body:** `{ email, password, collegeCode }`
- **Returns:** `{ success, message, data: { student, college, token } }`

#### Get Student Profile
```javascript
studentAPI.getProfile()
```
- **Endpoint:** `GET /api/student/profile`
- **Auth Required:** Yes
- **Returns:** `{ success, data: { student, college } }`

---

### 4. Chatbot API (`chatbotAPI`)

#### Authenticate Chatbot
```javascript
chatbotAPI.authenticate(collegeCode, externalToken)
```
- **Endpoint:** `POST /api/chatbot/auth`
- **Body:** `{ collegeCode, externalToken? }`
- **Returns:** `{ success, data: { student, token, isGuest } }`
- **Note:** Creates guest user if no externalToken provided

#### Send Message
```javascript
chatbotAPI.sendMessage(message, chatbotToken)
```
- **Endpoint:** `POST /api/chatbot/message`
- **Auth Required:** Yes (Chatbot token)
- **Body:** `{ message }`
- **Returns:** `{ success, data: { response } }`

---

## Usage Examples

### Admin Login Flow
```javascript
import { adminAPI } from './services/api';

try {
  const data = await adminAPI.login(email, password);
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));
  // Navigate to dashboard
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Student Registration Flow
```javascript
import { studentAPI } from './services/api';

try {
  const data = await studentAPI.register(name, email, password, collegeCode);
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('studentInfo', JSON.stringify(data.data.student));
  localStorage.setItem('collegeInfo', JSON.stringify(data.data.college));
  // Navigate to dashboard
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Chatbot Authentication Flow
```javascript
import { chatbotAPI } from './services/api';

try {
  const data = await chatbotAPI.authenticate(collegeCode, externalToken);
  setChatbotToken(data.data.token);
  setIsGuest(data.data.isGuest);
  // Start chatting
} catch (error) {
  console.error('Chatbot auth failed:', error.message);
}
```

---

## Error Handling

All API calls throw errors with descriptive messages. Always wrap API calls in try-catch blocks:

```javascript
try {
  const data = await adminAPI.login(email, password);
  // Handle success
} catch (error) {
  // error.message contains the error description
  setErrorMessage(error.message);
}
```

---

## Environment Setup

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5050/api
```

For production, update the URL accordingly.
