# ATS Authentication Setup Guide

This application includes a complete authentication system using Appwrite with email verification.

## Features

### 🔐 Sign In Page (`/signin`)

Two authentication methods:

1. **Magic Link (Passwordless)**
   - User enters email
   - Receives a magic link via email
   - Clicks link to sign in automatically
   - No password required

2. **Email & Password**
   - Traditional email/password login
   - Automatic email verification check
   - Sends verification email if not verified

### ✉️ Email Verification (`/auth/verify`)

- Handles magic link callbacks
- Verifies email addresses
- Beautiful success/error states
- Auto-redirects after verification

### 📝 Sign Up Page (`/signup`)

- User registration with name, email, password
- Password confirmation validation
- Minimum 8 characters requirement
- Auto-sends verification email
- Auto-login after registration

## Setup Instructions

### 1. Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted instance
2. Create a new project
3. Note your **Project ID** and **Endpoint**

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
```

Replace `your_project_id_here` with your actual Appwrite project ID.

### 3. Configure Appwrite Platform

In your Appwrite console:

1. Go to **Settings** → **Platforms**
2. Add a new **Web App** platform
3. Add your development URL: `http://localhost:5173`
4. For production, add your production domain

### 4. Enable Email Service (Optional but Recommended)

For production, configure an SMTP provider in Appwrite:

1. Go to **Settings** → **SMTP**
2. Configure your SMTP settings (e.g., SendGrid, Mailgun, AWS SES)
3. Test email delivery

### 5. Install Dependencies

```powershell
npm install
```

### 6. Run Development Server

```powershell
npm run dev
```

Visit `http://localhost:5173/signin` to test the authentication.

## Usage

### Magic Link Authentication Flow

1. User enters email on `/signin`
2. Selects "Magic Link" tab
3. Clicks "Send Magic Link"
4. Receives email with verification link
5. Clicks link → redirected to `/auth/verify`
6. Automatically signed in → redirected to home

### Password Authentication Flow

1. User enters email and password on `/signin`
2. Selects "Password" tab
3. Clicks "Sign In"
4. System checks if email is verified
5. If not verified, sends verification email
6. If verified, signs in → redirected to home

### Registration Flow

1. User fills out sign-up form at `/signup`
2. Creates account with name, email, password
3. Automatically logged in
4. Verification email sent
5. User clicks verification link
6. Email verified → full access granted

## Security Features

- ✅ Email verification required
- ✅ Secure password storage (handled by Appwrite)
- ✅ Magic URL tokens with expiration
- ✅ HTTPS required for production
- ✅ CORS protection via Appwrite platform settings
- ✅ Rate limiting (configured in Appwrite)

## Customization

### Redirect URLs

Update redirect URLs in the code:

**SignIn.tsx** (line ~33):

```typescript
const redirectUrl = `${window.location.origin}/auth/verify`;
```

**signup.tsx** (line ~74):

```typescript
await account.createVerification(`${window.location.origin}/auth/verify`);
```

### Styling

The pages use Tailwind CSS. Modify classes to match your brand:

- Primary colors: `blue-600`, `purple-600`
- Gradient: `from-blue-600 to-purple-600`
- Background: `from-blue-50 via-white to-purple-50`

### Email Templates

Customize email templates in Appwrite Console:

- **Settings** → **Templates** → **Email Templates**

## Troubleshooting

### Magic Link Not Working

- Verify platform URL is added in Appwrite console
- Check email spam folder
- Ensure `VITE_APPWRITE_ENDPOINT` is correct

### "Invalid Credentials" Error

- Double-check email and password
- Ensure user account exists
- Try password reset if implemented

### Verification Email Not Sending

- Check Appwrite SMTP configuration
- Verify email service is enabled
- Check Appwrite console logs

### CORS Errors

- Add your domain to Appwrite platform settings
- Include `http://localhost:5173` for development

## Next Steps

Consider adding:

- Password reset functionality
- Social authentication (Google, GitHub, etc.)
- Two-factor authentication
- User profile management
- Session management UI
- Protected routes

## Support

For Appwrite-specific issues:

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)

## License

MIT
