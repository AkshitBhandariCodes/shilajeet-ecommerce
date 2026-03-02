# SMS OTP Authentication Implementation Guide

## Overview
Complete SMS OTP authentication system integrated with AuthKey.io for phone-based login and signup.

## Architecture

### Components
1. **lib/authkey-sms.ts** - SMS service with AuthKey.io integration
2. **models/OTPSession.ts** - MongoDB model for OTP session storage
3. **models/User.ts** - User model with phone authentication fields
4. **app/api/auth/send-otp/route.ts** - API endpoint to send OTP
5. **app/api/auth/verify-otp/route.ts** - API endpoint to verify OTP
6. **components/AuthModal.tsx** - UI component for phone OTP authentication

### Flow

#### Sign Up Flow
```
User enters phone → Send OTP → Verify OTP → Enter details → Create account
```

#### Sign In Flow
```
User enters phone → Send OTP → Verify OTP → Login
```

## API Endpoints

### Send OTP
**POST** `/api/auth/send-otp`

Request:
```json
{
  "phoneNumber": "9876543210",
  "countryCode": "91",
  "purpose": "signin" // or "signup"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "expiresIn": 600
}
```

### Verify OTP
**POST** `/api/auth/verify-otp`

Request:
```json
{
  "otp": "123456",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "phoneNumber": "9876543210",
  "purpose": "signin",
  "firstName": "John",      // Required for signup
  "lastName": "Doe",        // Required for signup
  "email": "john@example.com" // Required for signup
}
```

Response (Sign In):
```json
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

Response (Sign Up):
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

## AuthKey.io Configuration

### Template Setup
The OTP template must be created in AuthKey.io console with the following format:

```
Use {#2fa#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

**Important**: The `{#2fa#}` variable is automatically replaced by AuthKey.io with the generated OTP.

### Environment Variables
```env
AUTHKEY_API_KEY=your_authkey_api_key
AUTHKEY_OTP_TEMPLATE_ID=your_template_id
```

## SMS OTP Service (lib/authkey-sms.ts)

### Methods

#### sendOTP(phoneNumber, countryCode, company)
Sends OTP to the provided phone number using AuthKey.io 2FA API.

**Endpoint**: `GET /restapi/request.php`

**Parameters**:
- `phoneNumber`: 10-digit phone number
- `countryCode`: Country code (default: "91" for India)
- `company`: Company name for template variable (default: "Agnishila")

**Returns**: `SendOTPResponse` with `logId` for verification

#### verifyOTP(otp, logId)
Verifies the OTP entered by user using AuthKey.io 2FA verification API.

**Endpoint**: `GET /api/2fa_verify.php`

**Parameters**:
- `otp`: 4-6 digit OTP entered by user
- `logId`: LogID returned from sendOTP

**Returns**: `VerifyOTPResponse` with success status

#### sendOTPPost(phoneNumber, countryCode)
Alternative POST method for sending OTP (optional).

**Endpoint**: `POST /restapi/requestjson.php`

## Database Models

### OTPSession
```typescript
{
  phoneNumber: String,        // User's phone number
  logId: String,              // AuthKey.io LogID (unique)
  otp: String,                // Not stored for security
  isVerified: Boolean,        // OTP verification status
  attempts: Number,           // Failed verification attempts
  maxAttempts: Number,        // Max allowed attempts (5)
  expiresAt: Date,            // Auto-expires after 10 minutes
  userId: ObjectId,           // Reference to User (optional)
  purpose: String,            // 'signup', 'signin', 'password-reset'
  metadata: Object,           // Additional data
  createdAt: Date,
  updatedAt: Date
}
```

### User (Updated Fields)
```typescript
{
  phone: String,              // Phone number (optional)
  phoneVerified: Boolean,     // Phone verification status
  authMethod: String,         // 'email' or 'phone'
  // ... other fields
}
```

## Testing

### Manual Testing Steps

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Open Auth Modal**
   - Click "Sign In" or "Sign Up" button on homepage
   - AuthModal component opens

3. **Test Sign Up**
   - Select "Sign Up" mode
   - Enter phone number (e.g., 9876543210)
   - Click "Send OTP"
   - Check phone for OTP SMS
   - Enter OTP in modal
   - Fill in details (First Name, Last Name, Email)
   - Click "Verify OTP"
   - Account created successfully

4. **Test Sign In**
   - Select "Sign In" mode
   - Enter registered phone number
   - Click "Send OTP"
   - Check phone for OTP SMS
   - Enter OTP in modal
   - Click "Verify OTP"
   - Logged in successfully

### Testing with Console Logs
The service logs all API calls and responses:
```
Sending OTP to: 9876543210
Using template ID: 33097
API URL: https://console.authkey.io/restapi/request.php?authkey=...
AuthKey.io 2FA response: { LogID: "...", Message: "Submitted Successfully" }
```

## Troubleshooting

### Issue: OTP not received
**Cause**: Template ID or API key incorrect
**Solution**: 
- Verify `AUTHKEY_API_KEY` and `AUTHKEY_OTP_TEMPLATE_ID` in `.env`
- Check AuthKey.io console for template configuration
- Ensure template contains `{#2fa#}` variable

### Issue: "Invalid OTP" error
**Cause**: OTP expired or incorrect
**Solution**:
- OTP expires after 10 minutes
- User has 5 attempts before session expires
- Click "Resend" to get new OTP

### Issue: "User not found" on sign in
**Cause**: Phone number not registered
**Solution**:
- Use "Sign Up" mode to create account first
- Or check if phone number is correct

### Issue: "Phone number already registered"
**Cause**: Phone already exists in database
**Solution**:
- Use "Sign In" mode instead
- Or use different phone number

## Security Features

1. **OTP Expiry**: 10 minutes auto-expiry
2. **Attempt Limiting**: 5 failed attempts before session expires
3. **LogID Validation**: Each OTP session has unique LogID
4. **Phone Verification**: Phone marked as verified after successful OTP
5. **No OTP Storage**: OTP not stored in database for security
6. **HTTPS Only**: All AuthKey.io API calls use HTTPS

## Integration Points

### AuthModal Component
- Handles phone input and OTP verification UI
- Supports both sign up and sign in modes
- Shows OTP timer and attempt counter
- Auto-redirects on successful verification

### API Routes
- `/api/auth/send-otp` - Initiates OTP flow
- `/api/auth/verify-otp` - Completes OTP verification

### User Model
- `phone` field for phone number storage
- `phoneVerified` flag for verification status
- `authMethod` field to track authentication method

## Next Steps

1. Test the SMS OTP flow end-to-end
2. Monitor AuthKey.io console for delivery reports
3. Implement password reset via OTP (optional)
4. Add phone number update functionality (optional)
5. Implement 2FA for existing email accounts (optional)

## Support

For AuthKey.io API issues:
- Check AuthKey.io documentation: https://console.authkey.io
- Verify template configuration in console
- Check API key and template ID in `.env`
- Review console logs for API responses
