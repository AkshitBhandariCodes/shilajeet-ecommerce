# Admin Quick Start

## 1. Create Admin User (Choose One)

### Option A: Using API
```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -H "x-setup-key: setup-key-12345" \
  -d '{
    "email": "admin@agnishila.com",
    "password": "admin123",
    "name": "Admin"
  }'
```

### Option B: Using Node Script
```bash
node scripts/setup-admin.js
```

Requires `.env`:
```env
ADMIN_EMAIL=admin@agnishila.com
ADMIN_PASSWORD=admin123
MONGODB_URI=your_mongodb_uri
```

## 2. Login to Admin
1. Go to `http://localhost:3000/admin/login`
2. Enter email: `admin@agnishila.com`
3. Enter password: `admin123`
4. Click Sign In

## 3. Access Admin Features
- Orders: `http://localhost:3000/admin/orders`
- Delhivery Stats: `http://localhost:3000/admin/delhivery-stats`
- Customers: `http://localhost:3000/admin/customers`
- Newsletter: `http://localhost:3000/admin/newsletter`

## 4. Test Admin APIs
```bash
# Check if admin exists
curl http://localhost:3000/api/admin/setup \
  -H "x-setup-key: setup-key-12345"

# Get all orders (requires login)
curl http://localhost:3000/api/admin/orders

# Get Delhivery stats (requires login)
curl http://localhost:3000/api/admin/delhivery-stats
```

## Troubleshooting

**401 Unauthorized**: Not logged in or invalid credentials
- Log in again at `/admin/login`

**403 Forbidden**: User exists but not admin
- Update user role in MongoDB:
  ```javascript
  db.users.updateOne(
    { email: "admin@agnishila.com" },
    { $set: { role: "admin" } }
  )
  ```

**Admin user already exists**: 
- Use existing credentials to login
- Or update role if needed

See `ADMIN_SETUP_GUIDE.md` for detailed troubleshooting.
