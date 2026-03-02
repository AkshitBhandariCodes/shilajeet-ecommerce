# Admin Setup Guide

## Overview
This guide explains how to set up admin users and access admin features.

## Admin Features
- View all orders with filtering
- View Delhivery shipping statistics
- Manage customers
- View analytics
- Manage coupons
- View reviews
- Newsletter management

## Setting Up Admin User

### Method 1: Using Setup API (Recommended)

#### 1. Check if Admin Exists
```bash
curl http://localhost:3000/api/admin/setup \
  -H "x-setup-key: setup-key-12345"
```

**Response**:
```json
{
  "adminExists": false,
  "adminEmail": null,
  "setupRequired": true
}
```

#### 2. Create Admin User
```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-key: setup-key-12345" \
  -d '{
    "email": "admin@agnishila.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "user": {
    "id": "...",
    "email": "admin@agnishila.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Method 2: Using Node Script

```bash
# Run the setup script
node scripts/setup-admin.js
```

This uses environment variables:
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password
- `MONGODB_URI` - MongoDB connection string

### Method 3: Using Environment Variables

Set these in `.env`:
```env
ADMIN_EMAIL=admin@agnishila.com
ADMIN_PASSWORD=admin123
```

Then run the setup script or API endpoint.

## Logging In as Admin

1. Go to `/admin/login`
2. Enter admin email and password
3. Click "Sign In"
4. You'll be redirected to admin dashboard

## Admin Dashboard Features

### 1. Orders Management (`/admin/orders`)
- View all orders
- Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
- Filter by payment mode (COD, Prepaid)
- Pagination support
- Update order status
- Update payment status
- Add notes to orders

**API**: `GET /api/admin/orders?status=shipped&paymentMode=COD&page=1&limit=20`

### 2. Delhivery Statistics (`/admin/delhivery-stats`)
- Total orders shipped via Delhivery
- Total revenue from Delhivery orders
- Tracking status breakdown
- Order status breakdown
- Payment mode breakdown
- Recent orders list
- Customizable date range (default: 30 days)

**API**: `GET /api/admin/delhivery-stats?days=30`

### 3. Customers Management (`/admin/customers`)
- View all customers
- Customer details
- Order history per customer
- Contact information

**API**: `GET /api/admin/customers?page=1&limit=20`

### 4. Newsletter Management (`/admin/newsletter`)
- View newsletter subscribers
- Export subscriber list
- Manage subscriptions

**API**: `GET /api/admin/newsletter?limit=100`

### 5. Analytics (`/admin/analytics`)
- Sales trends
- Revenue metrics
- Order statistics
- Customer insights

**API**: `GET /api/admin/analytics?period=month`

## Admin API Endpoints

### Orders
```
GET /api/admin/orders - Get all orders
PUT /api/admin/orders - Update order
```

### Delhivery Stats
```
GET /api/admin/delhivery-stats - Get shipping statistics
```

### Customers
```
GET /api/admin/customers - Get all customers
```

### Newsletter
```
GET /api/admin/newsletter - Get subscribers
```

### Analytics
```
GET /api/admin/analytics - Get analytics data
```

## Authentication

All admin endpoints require:
1. Valid session (logged in as admin)
2. User role must be 'admin'
3. Session is checked via `getServerSession(authOptions)`

### Session Flow
1. User logs in with email/password
2. NextAuth validates credentials
3. JWT token is created with user role
4. Session includes user role
5. Admin endpoints check if role === 'admin'

## Troubleshooting

### 401 Unauthorized
**Problem**: Admin endpoints return 401

**Solutions**:
1. Check if you're logged in: `GET /api/auth/session`
2. Verify user role is 'admin': Check User document in MongoDB
3. Try logging out and logging back in
4. Clear browser cookies and try again

### 403 Forbidden
**Problem**: Admin endpoints return 403

**Solutions**:
1. User is logged in but doesn't have admin role
2. Update user role to 'admin' in database:
   ```javascript
   db.users.updateOne(
     { email: "admin@agnishila.com" },
     { $set: { role: "admin" } }
   )
   ```

### Admin User Not Created
**Problem**: Can't create admin user

**Solutions**:
1. Check if admin already exists: `GET /api/admin/setup`
2. Verify setup key is correct
3. Check MongoDB connection
4. Check environment variables

## Security Considerations

1. **Setup Key**: Change `SETUP_KEY` in production
2. **Admin Password**: Use strong passwords
3. **Session**: Sessions expire after inactivity
4. **Role-Based Access**: Only admins can access admin endpoints
5. **Audit Logs**: Consider adding audit logging for admin actions

## Environment Variables

```env
# Admin credentials
ADMIN_EMAIL=admin@agnishila.com
ADMIN_PASSWORD=admin123

# Setup key for admin creation
SETUP_KEY=setup-key-12345

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# MongoDB
MONGODB_URI=mongodb+srv://...
```

## Testing Admin Access

### 1. Check Session
```bash
curl http://localhost:3000/api/auth/session
```

### 2. Check Admin Status
```bash
curl http://localhost:3000/api/admin/setup \
  -H "x-setup-key: setup-key-12345"
```

### 3. Test Admin Orders Endpoint
```bash
curl http://localhost:3000/api/admin/orders
```

Should return 401 if not logged in, or orders if logged in as admin.

### 4. Test Admin Stats Endpoint
```bash
curl http://localhost:3000/api/admin/delhivery-stats
```

## Next Steps

1. Set up admin user using one of the methods above
2. Log in to admin dashboard
3. Verify all admin endpoints are accessible
4. Start managing orders and viewing statistics
5. Configure admin features as needed

## Support

If you encounter issues:
1. Check server logs for error messages
2. Verify all environment variables are set
3. Check MongoDB connection
4. Verify user role in database
5. Clear browser cache and cookies
6. Try in incognito/private mode
