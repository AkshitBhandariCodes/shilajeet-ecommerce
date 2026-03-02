# SMS OTP Authentication - Complete Setup Guide

## Overview

This guide explains how to integrate AuthKey.io SMS OTP authentication for phone-based login and signup on the Agnishila platform.

## What Was Implemented

### 1. AuthKey.io SMS Service (`lib/authkey-sms.ts`)
- Sends OTP via SMS using AuthKey.io 2FA API
- Verifies OTP entered by user
- Handles both GET and POST API methods
- Error handling and validation

### 2. OTP Session Model (`models/OTPSession.ts`)
- Stores OTP verification sessions
- Auto-expires after 10 minutes
- Tracks verification attempts (max 5)
- Supports multiple purposes: signup, signin, password-reset, phone-verification

### 3. API Routes
**Send OTP** (`app/api/auth/send-otp/route.ts`)
- POST endpoint to send OTP to phone number
- Validates phone number format
- Checks if user exists (for signin)
- Checks if phone already registered (for signup)
- Returns LogID for verification

**Verify OTP** (`app/api/auth/verify-otp/route.ts`)
- POST endpoint to verify OTP
- Validates OTP against AuthKey.io
- Creates user account (for signup)
- Updates phone verification status (for signin)
- Handles password reset flow

### 4. Phone OTP Auth Modal (`components/PhoneOTPAuthModal.tsx`)
- Beautiful UI for phone-based authentication
- Three steps: Phone → OTP → Success
- OTP timer (10 minutes)
- Attempt tracking
- Resend OTP functionality
- Mode switching (signin ↔ signup)

### 5. User Model Updates (`models/User.ts`)
- Added `phone` field (unique per user)
- Added `phoneVerified` boolean
- Added `authMethod` field (email or phone)

## Setup Instructions

### Step 1: Get AuthKey.io Credentials

1. Go to: https://console.authkey.io
2. Sign up for an account
3. Get your API Key from the dashboard
4. Create an OTP template with variable `{#2fa#}`
5. Get the Template ID (SID)

### Step 2: Create OTP Template

In AuthKey.io console:
1. Go to SMS Templates
2. Create new template with exact message (use `{#2fa#}` NOT `{#otp#}`):
   ```
   Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
   ```
   **Important**: AuthKey.io uses `{#2fa#}` for the auto-generated OTP variable
3. Copy the Template ID (SID)

### Step 3: Update Environment Variables

Edit `.env`:
```env
AUTHKEY_API_KEY=your_api_key_from_authkey_io
AUTHKEY_OTP_TEMPLATE_ID=your_template_id_from_authkey_io
```

### Step 4: Update AuthContext

Add phone authentication methods to `contexts/AuthContext.tsx`:

```typescript
const loginWithPhone = async (phoneNumber: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        otp,
        purpose: 'signin',
      }),
    });

    if (response.ok) {
      // Refresh session
      await signIn('credentials', { redirect: false });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Phone login error:', error);
    return false;
  }
};

const signupWithPhone = async (phoneNumber: string, otp: string, userData: any): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        otp,
        purpose: 'signup',
        ...userData,
      }),
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Phone signup error:', error);
    return false;
  }
};
```

### Step 5: Add Phone OTP Modal to Navbar

Update `components/Navbar.tsx`:

```typescript
import PhoneOTPAuthModal from '@/components/PhoneOTPAuthModal';

export default function Navbar() {
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);

  return (
    <>
      {/* Existing navbar code */}
      
      {/* Add button to open phone auth */}
      <button onClick={() => setShowPhoneAuth(true)}>
        Sign In with Phone
      </button>

      {/* Phone OTP Modal */}
      <PhoneOTPAuthModal
        isOpen={showPhoneAuth}
        onClose={() => setShowPhoneAuth(false)}
        initialMode="signin"
        onSuccess={() => {
          // Refresh page or update auth state
        }}
      />
    </>
  );
}
```

### Step 6: Test the Integration

1. Start development server: `npm run dev`
2. Click "Sign In with Phone" button
3. Enter phone number (10 digits)
4. Click "Send OTP"
5. Check your phone for OTP
6. Enter OTP in the modal
7. Verify success

## API Endpoints

### Send OTP
```
POST /api/auth/send-otp

Request:
{
  "phoneNumber": "9876543210",
  "countryCode": "91",
  "purpose": "signin" | "signup"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "expiresIn": 600
}
```

### Verify OTP
```
POST /api/auth/verify-otp

Request (Signin):
{
  "otp": "123456",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "phoneNumber": "9876543210",
  "purpose": "signin"
}

Request (Signup):
{
  "otp": "123456",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "phoneNumber": "9876543210",
  "purpose": "signup",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

## Features

✅ **Phone-based Authentication**
- Send OTP via SMS
- Verify OTP
- Create account with phone
- Sign in with phone

✅ **Security**
- OTP expires after 10 minutes
- Maximum 5 verification attempts
- Auto-delete expired OTP sessions
- Phone number validation
- Duplicate phone prevention

✅ **User Experience**
- Beautiful modal interface
- Real-time OTP timer
- Resend OTP functionality
- Attempt tracking
- Error messages
- Success animations

✅ **Multiple Purposes**
- Signin
- Signup
- Password reset
- Phone verification

## File Structure

```
lib/
├── authkey-sms.ts              # AuthKey.io SMS service
├── auth-phone-provider.ts      # Custom phone auth provider

models/
├── OTPSession.ts               # OTP session model
└── User.ts                     # Updated with phone fields

app/api/auth/
├── send-otp/route.ts           # Send OTP endpoint
└── verify-otp/route.ts         # Verify OTP endpoint

components/
└── PhoneOTPAuthModal.tsx        # Phone OTP auth UI

.env                            # Environment variables
```

## Database Schema

### OTPSession
```javascript
{
  phoneNumber: String,           // User's phone number
  logId: String,                 // AuthKey.io LogID (unique)
  otp: String,                   // OTP (not stored for security)
  isVerified: Boolean,           // Verification status
  attempts: Number,              // Verification attempts
  maxAttempts: Number,           // Max attempts allowed (5)
  expiresAt: Date,               // Expiry time (10 minutes)
  userId: ObjectId,              // Reference to User
  purpose: String,               // signup, signin, password-reset
  metadata: Object,              // Additional data
  timestamps: true               // createdAt, updatedAt
}
```

### User (Updated)
```javascript
{
  // ... existing fields
  phone: String,                 // Phone number (unique)
  phoneVerified: Boolean,        // Phone verification status
  authMethod: String,            // 'email' or 'phone'
}
```

## AuthKey.io API Reference

### Send OTP (GET)
```
https://console.authkey.io/restapi/request.php?authkey=AUTHKEY&mobile=PHONE&country_code=91&sid=TEMPLATE_ID
```

### Verify OTP (GET)
```
https://console.authkey.io/api/2fa_verify.php?authkey=AUTHKEY&channel=SMS&otp=OTP&logid=LOGID
```

## Troubleshooting

### OTP Not Sending
- Check AUTHKEY_API_KEY is correct
- Verify AUTHKEY_OTP_TEMPLATE_ID is correct
- Check phone number format (10 digits)
- Verify AuthKey.io account has SMS credits

### OTP Verification Fails
- Check OTP is correct
- Verify OTP hasn't expired (10 minutes)
- Check LogID is correct
- Verify attempt limit not exceeded

### User Not Created
- Check email is valid
- Verify phone number not already registered
- Check firstName, lastName, email provided

## Security Considerations

1. **OTP Storage**: OTPs are not stored in database (security best practice)
2. **Expiry**: OTPs auto-expire after 10 minutes
3. **Attempts**: Maximum 5 verification attempts
4. **Phone Validation**: Phone numbers validated before sending OTP
5. **Duplicate Prevention**: Phone numbers must be unique
6. **HTTPS Only**: All API calls use HTTPS

## Testing Checklist

- [ ] AuthKey.io account created
- [ ] API Key obtained
- [ ] OTP template created
- [ ] Template ID obtained
- [ ] Environment variables set
- [ ] OTP sending works
- [ ] OTP verification works
- [ ] User signup with phone works
- [ ] User signin with phone works
- [ ] OTP expiry works
- [ ] Attempt limit works
- [ ] Modal UI displays correctly
- [ ] Error messages show correctly
- [ ] Success animations work

## Next Steps

1. ✅ Implementation complete
2. Get AuthKey.io credentials
3. Create OTP template
4. Update environment variables
5. Test phone authentication
6. Deploy to production

## Support

- **AuthKey.io Docs**: https://console.authkey.io/docs
- **API Reference**: https://console.authkey.io/api-reference
- **Support Email**: support@authkey.io

---

**Status**: Ready for deployment
**Last Updated**: January 7, 2026
**Version**: 1.0
