# Payment Modes Implementation Guide

## Overview
This document outlines the implementation of dual payment modes (COD and Online Payment) with unified Delhivery shipping integration for the Agnishila e-commerce platform.

## Features Implemented

### 1. Payment Modes
- **Cash on Delivery (COD)**: Customer pays when order arrives
- **Online Payment (Prepaid)**: Secure payment via Razorpay before order confirmation

### 2. Admin Panel Features
- View all orders with payment mode filter
- Filter orders by status and payment mode
- Edit order status and payment mode
- View customer details and tracking information
- Real-time order management

### 3. Customer Checkout Flow
- Choose between COD and Online Payment
- Secure Razorpay integration for online payments
- Automatic Delhivery shipment creation for both modes
- Order confirmation with tracking details

## Database Schema Updates

### Order Model - Payment Schema
```typescript
payment: {
  mode: 'COD' | 'Prepaid',           // Payment mode
  method?: 'Razorpay' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Wallet',
  cardNumber?: string,                // Masked for security
  cardholderName?: string,
  transactionId?: string,
  status: 'pending' | 'completed' | 'failed'
}
```

## API Endpoints

### 1. Create Order
**POST** `/api/orders`

Request body:
```json
{
  "items": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 999,
      "quantity": 1,
      "image": "image_url"
    }
  ],
  "address": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "payment": {
    "mode": "COD" | "Prepaid",
    "razorpayData": {
      "verified": true,
      "paymentId": "pay_xxx",
      "orderId": "order_xxx",
      "userDetails": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      }
    }
  },
  "idempotencyKey": "unique_key"
}
```

### 2. Admin Orders API
**GET** `/api/admin/orders`

Query parameters:
- `status`: Filter by order status (pending, confirmed, processing, shipped, delivered, cancelled)
- `paymentMode`: Filter by payment mode (COD, Prepaid)
- `page`: Pagination page number (default: 1)
- `limit`: Items per page (default: 20)

Response:
```json
{
  "orders": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

**PUT** `/api/admin/orders`

Update order details:
```json
{
  "orderId": "order_id",
  "status": "shipped",
  "paymentMode": "COD",
  "paymentStatus": "completed",
  "notes": "Order notes"
}
```

### 3. Payment Verification
**POST** `/api/payment/verify`

Verifies Razorpay payment signature and returns payment details.

### 4. Create Razorpay Order
**POST** `/api/payment/create-order`

Creates a Razorpay order for payment processing.

## Components

### 1. CheckoutPaymentOptions
Displays payment mode selection with COD and Online Payment options.

**Props:**
- `selectedMode`: Current selected payment mode
- `onModeChange`: Callback when mode changes
- `total`: Order total amount

### 2. CheckoutFlow
Complete checkout flow with address form and payment selection.

**Props:**
- `onOrderComplete`: Callback when order is successfully placed

### 3. OrderManagement (Admin)
Admin dashboard for managing orders with filters and inline editing.

**Features:**
- Filter by status and payment mode
- Edit order status and payment mode
- View customer details
- Direct Delhivery tracking links
- Real-time updates

## Delhivery Integration

### Automatic Shipment Creation
When an order is created (both COD and Prepaid), a Delhivery shipment is automatically created with:
- Payment mode set correctly (COD or Prepaid)
- Customer details
- Delivery address
- Tracking number stored in order

### Tracking
- Tracking number stored in `order.trackingNumber`
- Direct link to Delhivery tracking: `https://track.delhivery.com/track/package/{trackingNumber}`

## Frontend Integration

### Using CheckoutFlow Component
```tsx
import CheckoutFlow from '@/components/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <CheckoutFlow
      onOrderComplete={(orderData) => {
        console.log('Order placed:', orderData);
        // Redirect to order confirmation
      }}
    />
  );
}
```

### Using CheckoutPaymentOptions Component
```tsx
import CheckoutPaymentOptions from '@/components/CheckoutPaymentOptions';
import { useState } from 'react';

export default function PaymentSelector() {
  const [mode, setMode] = useState<'COD' | 'Prepaid'>('COD');

  return (
    <CheckoutPaymentOptions
      selectedMode={mode}
      onModeChange={setMode}
      total={5000}
    />
  );
}
```

## Admin Panel Usage

### Access Admin Orders
Navigate to `/admin/orders` to access the order management dashboard.

### Filter Orders
1. Use the status dropdown to filter by order status
2. Use the payment mode dropdown to filter by COD or Online Payment
3. Filters work together (e.g., show all "shipped" orders with "COD" payment)

### Edit Order
1. Click the edit icon (pencil) on any order row
2. Change the status or payment mode
3. Click the checkmark to save or X to cancel

### Track Shipment
Click the "Track" link in the Tracking column to open Delhivery tracking page.

## Payment Flow Diagrams

### COD Flow
```
Customer → Select COD → Enter Address → Place Order → 
Order Created → Delhivery Shipment (COD) → Tracking Number → 
Customer Receives → Payment Collected
```

### Online Payment Flow
```
Customer → Select Online Payment → Enter Address → 
Create Razorpay Order → Razorpay Checkout → Payment Verification → 
Order Created → Delhivery Shipment (Prepaid) → Tracking Number → 
Delivery
```

## Security Considerations

1. **Payment Verification**: All Razorpay payments are verified using signature verification
2. **Card Masking**: Card numbers are masked in database (only last 4 digits stored)
3. **Idempotency**: Orders use idempotency keys to prevent duplicate orders
4. **Admin Authentication**: Admin endpoints require admin role verification
5. **Session Management**: JWT-based sessions with NextAuth.js

## Environment Variables Required

```env
# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id

# Delhivery
DELHIVERY_API_TOKEN=your_token
DELHIVERY_ENVIRONMENT=test|production
DELHIVERY_TEST_URL=https://staging-express-api.delhivery.com
DELHIVERY_PROD_URL=https://express-api.delhivery.com
DELHIVERY_WAREHOUSE_NAME=Your_Warehouse_Name
SELLER_PHONE=9876543210
SELLER_ADDRESS=Your Warehouse Address
SELLER_GST_TIN=your_gst_number
```

## Testing

### Test COD Order
1. Go to checkout
2. Select "Cash on Delivery"
3. Fill in address details
4. Click "Place Order (COD)"
5. Verify order created with COD payment mode
6. Check Delhivery shipment created with COD mode

### Test Online Payment
1. Go to checkout
2. Select "Pay Online"
3. Fill in address details
4. Click "Proceed to Payment"
5. Use Razorpay test card: 4111 1111 1111 1111
6. Verify payment and order creation
7. Check Delhivery shipment created with Prepaid mode

### Test Admin Panel
1. Go to `/admin/orders`
2. Filter by payment mode (COD/Prepaid)
3. Filter by status
4. Edit order status and payment mode
5. Verify changes are saved

## Troubleshooting

### Order Not Created
- Check if address fields are complete
- Verify payment verification passed (for online payments)
- Check server logs for errors

### Delhivery Shipment Not Created
- Verify Delhivery API token is correct
- Check if warehouse name is configured
- Verify delivery PIN code is valid
- Check server logs for Delhivery API errors

### Payment Verification Failed
- Verify Razorpay keys are correct
- Check if payment signature matches
- Verify order amount matches

## Future Enhancements

1. Multiple payment gateways (PayPal, Stripe)
2. Partial payments
3. Payment plan options
4. Wallet integration
5. Gift card support
6. Subscription orders
7. Automated payment reminders for COD orders
8. Payment analytics dashboard

## Support

For issues or questions, refer to:
- Razorpay Documentation: https://razorpay.com/docs/
- Delhivery API: https://delhivery.com/api/
- NextAuth.js: https://next-auth.js.org/
