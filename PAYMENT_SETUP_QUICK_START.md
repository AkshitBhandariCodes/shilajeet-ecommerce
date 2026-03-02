# Payment Modes Quick Start Guide

## What's New

Your e-commerce platform now supports **two payment modes** with unified Delhivery shipping:

1. **Cash on Delivery (COD)** - Customer pays when order arrives
2. **Online Payment (Prepaid)** - Secure payment via Razorpay before order confirmation

Both modes automatically create Delhivery shipments with correct payment mode settings.

## Files Created/Modified

### New Files
- `app/api/admin/orders/route.ts` - Admin order management API
- `app/api/payment/verify/route.ts` - Razorpay payment verification
- `app/api/payment/create-order/route.ts` - Create Razorpay orders
- `components/admin/OrderManagement.tsx` - Admin order dashboard
- `components/CheckoutPaymentOptions.tsx` - Payment mode selector
- `components/CheckoutFlow.tsx` - Complete checkout flow
- `lib/razorpay-checkout.ts` - Razorpay integration utilities
- `app/admin/orders/page.tsx` - Admin orders page

### Modified Files
- `app/api/orders/route.ts` - Updated to handle both payment modes
- `models/Order.ts` - Already has correct payment schema

## Quick Setup

### 1. Verify Environment Variables
Make sure your `.env` file has:

```env
# Razorpay (already configured)
RAZORPAY_KEY_ID=rzp_test_RKkNoqkW7sQisX
RAZORPAY_KEY_SECRET=Dfe20218e1WYafVRRZQUH9Qx

# Delhivery (already configured)
DELHIVERY_API_TOKEN=657916e717816069e427826ab385b665a245088a
DELHIVERY_ENVIRONMENT=test
DELHIVERY_TEST_URL=https://staging-express-api.delhivery.com
DELHIVERY_WAREHOUSE_NAME=Your_Warehouse_Name
SELLER_PHONE=9876543210
SELLER_ADDRESS=Your Warehouse Address
SELLER_GST_TIN=your_gst_number
```

### 2. Add Razorpay Public Key to Environment
Add to `.env.local` or `.env`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RKkNoqkW7sQisX
```

### 3. Update Your Checkout Page

Replace your existing checkout with the new component:

```tsx
import CheckoutFlow from '@/components/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <CheckoutFlow
      onOrderComplete={(orderData) => {
        // Redirect to order confirmation
        window.location.href = `/order-confirmation/${orderData.orderNumber}`;
      }}
    />
  );
}
```

### 4. Access Admin Orders Dashboard

Navigate to: `http://localhost:3000/admin/orders`

Features:
- View all orders with payment mode
- Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
- Filter by payment mode (COD, Online Payment)
- Edit order status and payment mode
- View Delhivery tracking links

## How It Works

### Customer Checkout Flow

1. **Select Payment Mode**
   - Choose "Cash on Delivery" or "Pay Online"
   - See order summary with total

2. **Enter Shipping Address**
   - Fill in delivery details
   - Address is used for Delhivery shipment

3. **Place Order**
   - **COD**: Order created immediately, Delhivery shipment with COD mode
   - **Online**: Redirected to Razorpay, payment verified, order created with Prepaid mode

4. **Automatic Delhivery Shipment**
   - Shipment created automatically with correct payment mode
   - Tracking number stored in order
   - Customer can track delivery

### Admin Order Management

1. **View Orders**
   - See all orders with payment mode badge
   - Filter by status and payment mode
   - View customer details and items

2. **Edit Orders**
   - Click edit icon to modify status
   - Change payment mode if needed
   - Save changes

3. **Track Shipments**
   - Click "Track" link to open Delhivery tracking
   - Real-time delivery status

## Testing

### Test COD Order
```
1. Go to checkout
2. Select "Cash on Delivery"
3. Fill address: 
   - Name: Test User
   - Phone: 9876543210
   - Address: 123 Test St
   - City: Mumbai
   - State: Maharashtra
   - ZIP: 400001
4. Click "Place Order (COD)"
5. Verify order created with COD payment mode
```

### Test Online Payment
```
1. Go to checkout
2. Select "Pay Online"
3. Fill address (same as above)
4. Click "Proceed to Payment"
5. Use Razorpay test card:
   - Card: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
6. Verify payment and order creation
```

### Test Admin Panel
```
1. Go to /admin/orders
2. Filter by "Cash on Delivery"
3. See COD orders
4. Filter by "Online Payment"
5. See Prepaid orders
6. Click edit to change status
7. Click track to see Delhivery tracking
```

## Payment Mode Details

### COD (Cash on Delivery)
- **Payment Status**: Pending (until payment collected)
- **Delhivery Mode**: COD
- **When to Use**: For customers who prefer to pay on delivery
- **Admin Action**: Mark as "delivered" when payment collected

### Online Payment (Prepaid)
- **Payment Status**: Completed (payment verified)
- **Delhivery Mode**: Prepaid
- **When to Use**: For customers who want to pay online
- **Admin Action**: Order ready to ship immediately

## API Endpoints

### Create Order (Customer)
```
POST /api/orders
```

### Get Orders (Customer)
```
GET /api/orders
```

### Admin Orders (Admin Only)
```
GET /api/admin/orders?status=pending&paymentMode=COD
PUT /api/admin/orders
```

### Payment Verification
```
POST /api/payment/verify
```

### Create Razorpay Order
```
POST /api/payment/create-order
```

## Troubleshooting

### Order Not Created
- Check if all address fields are filled
- For online payment, verify payment was successful
- Check browser console for errors

### Delhivery Shipment Not Created
- Verify Delhivery API token is correct
- Check if warehouse name is configured
- Verify delivery PIN code is valid (400001 for Mumbai)

### Payment Not Verifying
- Check Razorpay keys in environment
- Verify payment signature matches
- Check server logs for errors

### Admin Panel Not Loading
- Verify you're logged in as admin
- Check if user role is "admin" in database
- Check browser console for errors

## Next Steps

1. **Customize Checkout UI** - Update colors and styling to match your brand
2. **Add Email Notifications** - Send order confirmation emails
3. **Implement Order Tracking Page** - Let customers track their orders
4. **Add Payment Analytics** - Track COD vs Online payment ratio
5. **Set Up Webhooks** - Real-time Delhivery status updates

## Support

For detailed documentation, see: `PAYMENT_MODES_IMPLEMENTATION.md`

For issues:
1. Check server logs: `npm run dev` output
2. Check browser console: F12 → Console tab
3. Verify environment variables are set
4. Test with Razorpay test credentials
