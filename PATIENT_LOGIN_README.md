# Patient Login System Documentation

## Overview
This document describes the new patient login system implemented for the medical application. The system now requires patients to log in or sign up before accessing the patient portal.

## Features Implemented

### 1. Patient Login Page (`/patient-login`)
- **Email/Password Login**: Patients can log in using their registered email and password
- **Google OAuth Integration**: Option to log in with Google account
- **Password Visibility Toggle**: Users can show/hide their password
- **Remember Me Checkbox**: Option to remain logged in
- **Forgot Password Link**: (Placeholder for forgot password feature)
- **Sign Up Link**: Quick link to create a new account

### 2. Patient Sign Up Page (`/patient-signup`)
- **Full Registration Form** with fields for:
  - Full Name
  - Email Address
  - Phone Number
  - Password (with visibility toggle)
  - Confirm Password
- **Google OAuth Integration**: Alternative sign-up method
- **Form Validation**: 
  - All fields required
  - Email format validation
  - Password minimum length (6 characters)
  - Password confirmation matching
- **Terms & Conditions**: Checkbox for agreement
- **Login Link**: For existing users to go back to login

### 3. Updated Home Page
- **Patient Button** now redirects to `/patient-login` instead of direct login
- Maintains existing provider functionality

## API Endpoints

### 1. User Login
**POST** `/api/auth/login`
```json
Request:
{
  "email": "patient@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "patient@example.com",
    "fullName": "Patient Name",
    "loginType": "email"
  }
}
```

### 2. User Sign Up
**POST** `/api/auth/signup`
```json
Request:
{
  "fullName": "Patient Name",
  "email": "patient@example.com",
  "phone": "+966 5xx xxx xxxx",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": "user_id",
    "email": "patient@example.com",
    "fullName": "Patient Name",
    "phone": "+966 5xx xxx xxxx",
    "loginType": "email"
  }
}
```

### 3. Google Sign In/Up
**POST** `/api/auth/google`
```json
Request:
{
  "token": "google_id_token"
}

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "patient@gmail.com",
    "fullName": "Google User",
    "loginType": "google"
  }
}
```

## Session Management

### LocalStorage Keys
- **patientAuth**: Stores patient authentication data
  ```json
  {
    "isLoggedIn": true,
    "email": "patient@example.com",
    "fullName": "Patient Name",
    "loginType": "email",
    "loginTime": "2026-02-10T12:00:00.000Z"
  }
  ```

## Integration with Google OAuth

### Setup Steps (Required)

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API

2. **Create OAuth 2.0 Credentials**
   - Go to Credentials section
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)

3. **Install Google OAuth Package** (if not already installed)
   ```bash
   npm install @react-oauth/google
   ```

4. **Add Google Client ID to Environment**
   Create `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
   ```

5. **Update Login/Signup Pages** (when Google integration is ready)
   - Replace mock Google handlers with actual OAuth flow
   - Use `GoogleLogin` component from `@react-oauth/google`

## Testing the System

### Test Email/Password Login
1. Navigate to `http://localhost:3000/`
2. Click "أنا مريض" (I am a patient) button
3. Try to sign up first at `/patient-signup`
4. After signup, log in with the same credentials
5. Should redirect to `/second-page`

### Test Google Login
1. (When Google OAuth is configured)
2. Click Google login button
3. Complete Google authentication
4. Should redirect to `/second-page`

### Check Session
Check browser DevTools → Application → Local Storage → `patientAuth` key

## Frontend Implementation Notes

### Authentication State
- Authentication data is stored in localStorage
- Component can check if patient is logged in using:
  ```typescript
  const patientAuth = localStorage.getItem("patientAuth");
  const isLoggedIn = patientAuth && JSON.parse(patientAuth).isLoggedIn;
  ```

### Protected Routes (Future Enhancement)
Consider implementing:
```typescript
// Create a middleware or wrapper component
function ProtectedRoute({ children }) {
  const patientAuth = localStorage.getItem("patientAuth");
  if (!patientAuth) {
    return router.push("/patient-login");
  }
  return children;
}
```

## Next Steps / Future Enhancements

1. **Real Backend Integration**
   - Connect API endpoints to actual database
   - Implement proper password hashing (bcrypt)
   - Add JWT token-based authentication

2. **Google OAuth Implementation**
   - Set up Google Cloud credentials
   - Implement proper token verification
   - Handle OAuth redirect flow

3. **Additional Features**
   - Forgot password functionality
   - Email verification
   - Two-factor authentication
   - Profile management
   - Session timeout
   - Refresh tokens
   - Password reset

4. **Security Enhancements**
   - HTTPS only for production
   - CSRF protection
   - Rate limiting on login attempts
   - Input sanitization
   - SQL injection prevention (if using database)

5. **UI/UX Improvements**
   - Loading animations
   - Error notifications
   - Success messages
   - Password strength indicator
   - Social media login alternatives

## Styling & Customization

Both login pages use Tailwind CSS and include:
- Dark mode support (ready to implement)
- Responsive design (mobile-friendly)
- Consistent branding with existing app
- Arabic language support (right-to-left)

## Important Notes

⚠️ **Current Implementation:**
- This is a client-side implementation for demonstration
- Passwords are not hashed
- No real database integration
- Google OAuth not fully configured
- Data only stored in localStorage (not persistent after clearing browser data)

✅ **For Production:**
- Implement backend authentication
- Use secure database
- Hash passwords with industry-standard algorithms
- Implement JWT or session-based authentication
- Configure proper CORS
- Use HTTPS only
- Implement rate limiting
- Add logging and monitoring

## Support & Questions

For more information or issues, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
