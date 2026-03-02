# Admin Authentication Fix Summary

## Problem
Admin endpoints were returning 401/403 errors because:
1. No admin user was set up in the database
2. Admin authentication wasn't properly configured

## Solution

### 1. Created Admin Setup Endpoint
**File**: `app/api/admin/setup/route.ts`

Allows creating admin users via API:
```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-key: setup-key-12345" \
  -d '{"email": "admin@agnishila.com", "password": "admin123"}'
```

### 2. Created Admin Setup Script
**File**: `scripts/setup-admin.js`

Allows creating admin users via Node script:
```bash
node scripts/setup-admin.js
```

### 3. Fixed Admin Authentication
**Files**: 
- `app/api/admin/orders/route.ts`
- `app/api/admin/delhivery-stats/route.ts`
- `app/api/admin/customers/route.ts`

All admin endpoints now:
- Check if user is authenticated
- Verify user has 'admin' role
- Return 401 if not authenticated
- Return 403 if not admin

### 4. Verified Auth Configuration
**File**: `lib/auth.ts`

Auth flow:
1. User logs in with email/password
2. NextAuth validates credentials against User model
3. JWT token includes user role
4. Session includes user role
5. Admin endpoints check role === 'admin'

## How to Set Up Admin

### Quick Setup (Recommended)
```bash
# 1. Create admin user via API
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-key: setup-key-12345" \
  -d '{
    "email": "admin@agnishila.com",
    "password": "admin123",
    "name": "Admin User"
  }'

# 2. Login at http://localhost:3000/admin/login
# 3. Access admin dashboard at http://localhost:3000/admin/orders
```

### Alternative Setup (Using Script)
```bash
# 1. Set environment variables in .env
ADMIN_EMAIL=admin@agnishila.com
ADMIN_PASSWORD=admin123

# 2. Run setup script
node scripts/setup-admin.js

# 3. Login and access admin features
```

## Admin Endpoints

All require authentication and admin role:

### Orders Management
```
GET /api/admin/orders
  - Query params: status, paymentMode, page, limit
  - Returns: List of orders with pagination

PUT /api/admin/orders
  - Body: { orderId, status, paymentMode, paymentStatus, notes }
  - Returns: Updated order
```

### Delhivery Statistics
```
GET /api/admin/delhivery-stats
  - Query params: days (default: 30)
  - Returns: Shipping stats, order breakdown, payment breakdown, recent orders
```

### Customers Management
```
GET /api/admin/customers
  - Query params: page, limit
  - Returns: List of customers
```

### Newsletter
```
GET /api/admin/newsletter
  - Query params: limit
  - Returns: Newsletter subscribers
```

## Admin Dashboard Pages

- `/admin/orders` - View and manage all orders
- `/admin/delhivery-stats` - View shipping statistics
- `/admin/customers` - View customer list
- `/admin/newsletter` - Manage newsletter
- `/admin/analytics` - View analytics
- `/admin/login` - Admin login page

## Authentication Flow

```
User Login
    ↓
Email/Password Validation
    ↓
Check User Role in Database
    ↓
Create JWT Token with Role
    ↓
Store Session with Role
    ↓
Admin Endpoints Check Role
    ↓
Grant/Deny Access
```

## Security Features

1. **Role-Based Access Control**: Only users with 'admin' role can access admin endpoints
2. **Session-Based Auth**: Uses NextAuth JWT sessions
3. **Setup Key Protection**: Admin creation requires setup key
4. **Password Hashing**: Passwords hashed with bcryptjs
5. **Unique Email**: Email addresses are unique in database

## Environment Variables

```env
# Admin credentials (for setup script)
ADMIN_EMAIL=admin@agnishila.com
ADMIN_PASSWORD=admin123

# Setup key (for API setup)
SETUP_KEY=setup-key-12345

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# MongoDB
MONGODB_URI=mongodb+srv://...
```

## Testing Admin Access

### 1. Check if Admin Exists
```bash
curl http://localhost:3000/api/admin/setup \
  -H "x-setup-key: setup-key-12345"
```

### 2. Create Admin User
```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-key: setup-key-12345" \
  -d '{"email": "admin@agnishila.com", "password": "admin123"}'
```

### 3. Check Session
```bash
curl http://localhost:3000/api/auth/session
```

### 4. Test Admin Endpoint
```bash
curl http://localhost:3000/api/admin/orders
```

## Troubleshooting

### 401 Unauthorized
- User not logged in
- Invalid credentials
- Session expired

**Fix**: Log in again at `/admin/login`

### 403 Forbidden
- User logged in but not admin
- Role is 'customer' instead of 'admin'

**Fix**: Update user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@agnishila.com" },
  { $set: { role: "admin" } }
)
```

### Admin User Already Exists
- Admin user already created
- Use existing credentials to login

**Fix**: Use existing email/password or update role if needed

### Setup Key Invalid
- Wrong setup key provided
- Setup key doesn't match environment variable

**Fix**: Use correct setup key from `.env` (default: `setup-key-12345`)

## Files Created/Modified

### Created
- `app/api/admin/setup/route.ts` - Admin setup endpoint
- `scripts/setup-admin.js` - Admin setup script
- `ADMIN_SETUP_GUIDE.md` - Detailed setup guide
- `ADMIN_QUICK_START.md` - Quick start guide
- `ADMIN_AUTHENTICATION_FIX.md` - This file

### Modified
- `app/api/admin/orders/route.ts` - Added admin check
- `app/api/admin/delhivery-stats/route.ts` - Added admin check
- `app/api/admin/customers/route.ts` - Added admin check

## Next Steps

1. Create admin user using setup API or script
2. Log in to admin dashboard
3. Verify all admin endpoints work
4. Start managing orders and viewing statistics
5. Configure admin features as needed

## Support

For detailed information, see:
- `ADMIN_SETUP_GUIDE.md` - Comprehensive setup guide
- `ADMIN_QUICK_START.md` - Quick start instructions
- Server logs for error messages
