# SMS OTP API Reference

## Overview

The SMS OTP system uses AuthKey.io's POST SMS API with template variables to send and verify OTPs.

## API Endpoints

### 1. Send OTP

**Endpoint**: `POST /api/auth/send-otp`

**Purpose**: Send OTP to user's phone number

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "phoneNumber": "9876543210",
  "countryCode": "91",
  "purpose": "signin"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| phoneNumber | string | Yes | 10-digit phone number (no country code) |
| countryCode | string | No | Country code (default: "91" for India) |
| purpose | string | No | "signin" or "signup" (default: "signin") |

**Response (Success)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "expiresIn": 600
}
```

**Response (Error)**:
```json
{
  "error": "Invalid phone number"
}
```

**Status Codes**:
| Code | Meaning |
|------|---------|
| 200 | OTP sent successfully |
| 400 | Invalid phone number or missing parameters |
| 404 | User not found (for signin) |
| 409 | Phone number already registered (for signup) |
| 500 | Server error |

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "countryCode": "91",
    "purpose": "signin"
  }'
```

**Example JavaScript**:
```javascript
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '9876543210',
    countryCode: '91',
    purpose: 'signin'
  })
});

const data = await response.json();
console.log(data.logId); // Use this for verification
```

---

### 2. Verify OTP (Signin)

**Endpoint**: `POST /api/auth/verify-otp`

**Purpose**: Verify OTP and sign in user

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "otp": "123456",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "phoneNumber": "9876543210",
  "purpose": "signin"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| otp | string | Yes | 4-6 digit OTP from SMS |
| logId | string | Yes | LogID from send-otp response |
| phoneNumber | string | Yes | 10-digit phone number |
| purpose | string | Yes | "signin" |

**Response (Success)**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

**Response (Error)**:
```json
{
  "error": "Invalid OTP",
  "attemptsRemaining": 4
}
```

**Status Codes**:
| Code | Meaning |
|------|---------|
| 200 | OTP verified successfully |
| 400 | Invalid OTP or OTP expired |
| 404 | Invalid OTP session or user not found |
| 429 | Maximum OTP attempts exceeded |
| 500 | Server error |

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456",
    "logId": "28bf7375bb54540ba03a4eb873d4da44",
    "phoneNumber": "9876543210",
    "purpose": "signin"
  }'
```

**Example JavaScript**:
```javascript
const response = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    otp: '123456',
    logId: logIdFromSendOTP,
    phoneNumber: '9876543210',
    purpose: 'signin'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Logged in as:', data.user.name);
}
```

---

### 3. Verify OTP (Signup)

**Endpoint**: `POST /api/auth/verify-otp`

**Purpose**: Verify OTP and create new user account

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "otp": "123456",
  "logId": "28bf7375bb54540ba03a4eb873d4da44",
  "phoneNumber": "9876543210",
  "purpose": "signup",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| otp | string | Yes | 4-6 digit OTP from SMS |
| logId | string | Yes | LogID from send-otp response |
| phoneNumber | string | Yes | 10-digit phone number |
| purpose | string | Yes | "signup" |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |
| email | string | Yes | User's email address |

**Response (Success)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

**Response (Error)**:
```json
{
  "error": "Phone number already registered"
}
```

**Status Codes**:
| Code | Meaning |
|------|---------|
| 200 | Account created successfully |
| 400 | Invalid OTP, missing parameters, or OTP expired |
| 404 | Invalid OTP session |
| 409 | Phone number or email already registered |
| 429 | Maximum OTP attempts exceeded |
| 500 | Server error |

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456",
    "logId": "28bf7375bb54540ba03a4eb873d4da44",
    "phoneNumber": "9876543210",
    "purpose": "signup",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }'
```

**Example JavaScript**:
```javascript
const response = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    otp: '123456',
    logId: logIdFromSendOTP,
    phoneNumber: '9876543210',
    purpose: 'signup',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Account created for:', data.user.name);
}
```

---

## AuthKey.io Integration

### Backend Service: `lib/authkey-sms.ts`

**Send OTP Method**:
```typescript
async sendOTP(
  phoneNumber: string,
  countryCode: string = '91',
  company: string = 'Agnishila'
): Promise<SendOTPResponse>
```

**How it works**:
1. Validates phone number (10+ digits)
2. Cleans phone number (removes non-digits)
3. Creates payload with template variables:
   ```json
   {
     "country_code": "91",
     "mobile": "9876543210",
     "sid": "33097",
     "otp": "",
     "company": "Agnishila"
   }
   ```
4. Sends POST request to AuthKey.io: `https://console.authkey.io/restapi/requestjson.php`
5. AuthKey.io:
   - Generates random OTP (4-6 digits)
   - Replaces `{#otp#}` with generated OTP
   - Replaces `{#company#}` with "Agnishila"
   - Sends SMS with complete message
   - Returns LogID for verification
6. Returns LogID to frontend

**Verify OTP Method**:
```typescript
async verifyOTP(
  otp: string,
  logId: string
): Promise<VerifyOTPResponse>
```

**How it works**:
1. Validates OTP (4+ digits)
2. Validates LogID (not empty)
3. Sends GET request to AuthKey.io: `https://console.authkey.io/api/2fa_verify.php`
4. AuthKey.io verifies OTP against LogID
5. Returns verification result

---

## SMS Template

**Template ID**: 33097 (from `.env` AUTHKEY_OTP_TEMPLATE_ID)

**Template Text**:
```
Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

**Template Variables**:
| Variable | Value | Source |
|----------|-------|--------|
| `{#otp#}` | 123456 | Auto-generated by AuthKey.io |
| `{#company#}` | Agnishila | Passed from API payload |

**Example SMS Received**:
```
Use 456789 as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io
```

---

## Environment Variables

**Required**:
```env
AUTHKEY_API_KEY=a36c6502b63a844c
AUTHKEY_OTP_TEMPLATE_ID=33097
```

**Optional (for DLT compliance in India)**:
```env
AUTHKEY_DLT_PE_ID=1101432621000095221
AUTHKEY_DLT_TEMPLATE_ID=1707911215678100001
```

---

## Error Handling

### Common Errors

**Invalid Phone Number**:
```json
{
  "error": "Invalid phone number"
}
```
**Solution**: Enter 10-digit phone number without country code

**User Not Found**:
```json
{
  "error": "User not found. Please sign up first."
}
```
**Solution**: Use Sign Up flow first

**Phone Number Already Registered**:
```json
{
  "error": "Phone number already registered"
}
```
**Solution**: Use Sign In flow or different phone number

**Invalid OTP**:
```json
{
  "error": "Invalid OTP",
  "attemptsRemaining": 4
}
```
**Solution**: Enter correct OTP from SMS

**OTP Expired**:
```json
{
  "error": "OTP has expired. Please request a new one."
}
```
**Solution**: Click "Resend" to get new OTP

**Maximum Attempts Exceeded**:
```json
{
  "error": "Maximum OTP attempts exceeded. Please request a new OTP."
}
```
**Solution**: Click "Resend" to get new OTP

---

## Rate Limiting

**Send OTP**:
- Max 5 requests per phone number per hour
- Max 10 requests per IP per hour

**Verify OTP**:
- Max 5 attempts per OTP session
- OTP expires after 10 minutes

---

## Security Considerations

1. **OTP Validity**: 10 minutes (600 seconds)
2. **OTP Length**: 4-6 digits
3. **Max Attempts**: 5 per OTP session
4. **Phone Verification**: Required for account creation
5. **LogID**: Unique per OTP session, cannot be reused
6. **HTTPS Only**: All API calls use HTTPS
7. **Authorization**: Basic auth with API key

---

## Testing

### Test Credentials

**Test Phone Number**: 9876543210 (or any valid 10-digit number)

**Test OTP**: Any 4-6 digit number (AuthKey.io generates real OTPs)

### Test Flow

1. **Send OTP**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "9876543210", "purpose": "signin"}'
   ```

2. **Receive SMS**: Check phone for OTP

3. **Verify OTP**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{
       "otp": "123456",
       "logId": "28bf7375bb54540ba03a4eb873d4da44",
       "phoneNumber": "9876543210",
       "purpose": "signin"
     }'
   ```

---

## Monitoring

### Key Metrics

- OTP send success rate
- OTP verify success rate
- Average OTP send time
- Average OTP verify time
- Failed attempts per user
- Failed attempts per IP

### Logs to Monitor

```
[INFO] Sending OTP to: 9876543210
[INFO] Using template ID: 33097
[INFO] Company: Agnishila
[INFO] AuthKey.io response: { LogID: '...' }
[ERROR] Error sending OTP: ...
[ERROR] Error verifying OTP: ...
```

---

## Summary

The SMS OTP API provides a complete authentication system using AuthKey.io:

1. **Send OTP**: `/api/auth/send-otp` (POST)
2. **Verify OTP**: `/api/auth/verify-otp` (POST)
3. **Template**: Uses `{#otp#}` and `{#company#}` variables
4. **Security**: 10-minute expiry, 5 max attempts
5. **Integration**: Works with both signin and signup flows

**Status**: ✅ Ready for production

