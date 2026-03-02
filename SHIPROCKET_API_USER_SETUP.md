# Shiprocket API User Setup Guide

## The Problem

You're getting `Wrong number of segments` error because:
- Your current token is invalid/malformed
- You need to create an **API User** in Shiprocket first
- Then generate a proper JWT token

## Step-by-Step Setup

### Step 1: Create API User in Shiprocket Dashboard

1. **Log in to Shiprocket**
   - Go to: https://www.shiprocket.in/
   - Use your main account credentials

2. **Navigate to API Settings**
   - Left sidebar → **Settings**
   - Click **API**
   - Click **Add New API User**

3. **Fill the Form**
   - **Email**: Enter a NEW email (must be different from your main login)
     - Example: `api-user@agnishila.in`
   - **Modules to Access**: Select all modules you need
     - ✓ Orders
     - ✓ Shipments
     - ✓ Tracking
     - ✓ Pickups
   - **Buyer's Details Access**: Choose "Allowed"
   - Click **Create User**

4. **Get the Password**
   - Password will be sent to your **main email address**
   - Check your inbox (might be in spam)
   - Copy the password

### Step 2: Generate Auth Token

You have two options:

#### Option A: Use the Script (Recommended)

```bash
node scripts/get-shiprocket-token.js your_api_email@example.com your_password
```

Replace:
- `your_api_email@example.com` - The API user email you created
- `your_password` - The password from the email

**Example:**
```bash
node scripts/get-shiprocket-token.js api-user@agnishila.in MyPassword123
```

The script will output your token. Copy it.

#### Option B: Manual Request (Using Postman or curl)

```bash
curl --location 'https://apiv2.shiprocket.in/v1/external/auth/login' \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "your_api_email@example.com",
    "password": "your_password"
  }'
```

Response will look like:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

Copy the `token` value.

### Step 3: Update .env File

1. **Open `.env`** in your editor

2. **Find this line:**
   ```
   SHIPROCKET_API_TOKEN=bCnLDSBd@!%O9881YI@tRDUDw$J1GvoS
   ```

3. **Replace with your token:**
   ```
   SHIPROCKET_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Save the file**

### Step 4: Restart Dev Server

```bash
# Stop current server
Ctrl+C

# Start again
npm run dev
```

### Step 5: Test

1. **Create a test order**
   - Go to `http://localhost:3000`
   - Add product to cart
   - Go to checkout
   - Complete payment

2. **Check console**
   - Should see: `Shiprocket shipment result: { success: true, ... }`
   - Should NOT see: `Wrong number of segments`

## Troubleshooting

**Script says "Failed to parse response"?**
- Check API email and password are correct
- Make sure API user was created successfully
- Try waiting a few minutes after creating the user

**Still getting "Wrong number of segments"?**
- Verify token starts with `eyJ`
- Make sure entire token was copied (no truncation)
- Check for extra spaces in .env
- Restart dev server

**"Unauthorized" error?**
- Token might have expired (they last 24 hours)
- Generate a new token using the script
- Update .env with new token

**API User not receiving password email?**
- Check spam/junk folder
- Try creating another API user
- Contact Shiprocket support

## Token Format

Valid Shiprocket token:
- Starts with: `eyJ`
- Contains two dots: `eyJ...eyJ...eyJ`
- Length: 100-200+ characters
- Only alphanumeric, hyphens, underscores

Invalid token (what you had):
```
bCnLDSBd@!%O9881YI@tRDUDw$J1GvoS  ❌ Wrong format
```

Valid token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5MCwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ✅ Correct format
```

## Important Notes

- **Token expires in 24 hours** - You may need to regenerate periodically
- **Keep token secret** - Don't commit to git or share publicly
- **API User email** - Must be different from your main Shiprocket login
- **Pickup Location ID** - Make sure you have at least one pickup location configured

## Next Steps

After setting up the token:
1. Orders will create successfully
2. Shipments will be created automatically
3. Tracking will work
4. Customers can track their orders

## Support

If you still have issues:
- Email: integration@shiprocket.com (for API issues)
- Email: support@shiprocket.com (for general support)
- Check Shiprocket status: https://status.shiprocket.in/
