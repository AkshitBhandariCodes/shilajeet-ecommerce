# Payment Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AGNISHILA PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │   FRONTEND       │         │   ADMIN PANEL    │              │
│  │  (Customer)      │         │  (Order Mgmt)    │              │
│  └────────┬─────────┘         └────────┬─────────┘              │
│           │                            │                        │
│           └────────────┬───────────────┘                        │
│                        │                                        │
│                   ┌────▼─────┐                                 │
│                   │  NEXT.JS  │                                │
│                   │  API      │                                │
│                   └────┬──────┘                                │
│                        │                                        │
│        ┌───────────────┼───────────────┐                       │
│        │               │               │                       │
│   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐                  │
│   │ ORDERS  │    │ PAYMENT │    │ ADMIN   │                  │
│   │ API     │    │ API     │    │ API     │                  │
│   └────┬────┘    └────┬────┘    └────┬────┘                  │
│        │              │              │                        │
│        └──────────────┼──────────────┘                        │
│                       │                                        │
│                   ┌───▼────────┐                              │
│                   │  MONGODB   │                              │
│                   │  DATABASE  │                              │
│                   └────────────┘                              │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         │                                    │
    ┌────▼──────────┐              ┌─────────▼────────┐
    │  RAZORPAY     │              │   DELHIVERY      │
    │  (Payments)   │              │   (Shipping)     │
    └───────────────┘              └──────────────────┘
```

## COD (Cash on Delivery) Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    COD ORDER FLOW                                │
└─────────────────────────────────────────────────────────────────┘

CUSTOMER SIDE:
┌──────────────┐
│   Browse     │
│  Products    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Add to      │
│  Cart        │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Checkout Page                           │
│  ┌────────────────────────────────────┐  │
│  │ Select Payment Mode:               │  │
│  │ ✓ Cash on Delivery                 │  │
│  │   Pay Online                       │  │
│  └────────────────────────────────────┘  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Enter Shipping Address                  │
│  - Name, Phone, Email                    │
│  - Address, City, State, ZIP             │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Review Order Summary                    │
│  - Items, Quantity, Price                │
│  - Total Amount                          │
│  - Payment: COD                          │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Click "Place Order (COD)"               │
└──────┬───────────────────────────────────┘
       │
       ▼

BACKEND SIDE:
┌──────────────────────────────────────────┐
│  POST /api/orders                        │
│  - Validate address                      │
│  - Calculate totals                      │
│  - Create Order in MongoDB               │
│  - Payment Mode: COD                     │
│  - Payment Status: Pending               │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Create Delhivery Shipment               │
│  - Payment Mode: COD                     │
│  - Get Tracking Number                   │
│  - Store in Order                        │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Award Fire Coins                        │
│  - Calculate coins earned                │
│  - Update user balance                   │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Return Order Confirmation               │
│  - Order Number                          │
│  - Tracking Number                       │
│  - Estimated Delivery                    │
└──────┬───────────────────────────────────┘
       │
       ▼

CUSTOMER RECEIVES:
┌──────────────────────────────────────────┐
│  Order Confirmation                      │
│  - Order #: AG123456789                  │
│  - Tracking: DL123456789                 │
│  - Status: Pending                       │
│  - Payment: COD (Pay on Delivery)        │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Delhivery Picks Up & Delivers           │
│  - Tracking updates in real-time         │
│  - Customer receives package             │
│  - Customer pays delivery agent          │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Admin Marks as Delivered                │
│  - Payment Status: Completed             │
│  - Order Status: Delivered               │
└──────────────────────────────────────────┘
```

## Online Payment (Prepaid) Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ONLINE PAYMENT (PREPAID) FLOW                       │
└─────────────────────────────────────────────────────────────────┘

CUSTOMER SIDE:
┌──────────────┐
│   Browse     │
│  Products    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Add to      │
│  Cart        │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Checkout Page                           │
│  ┌────────────────────────────────────┐  │
│  │ Select Payment Mode:               │  │
│  │   Cash on Delivery                 │  │
│  │ ✓ Pay Online                       │  │
│  └────────────────────────────────────┘  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Enter Shipping Address                  │
│  - Name, Phone, Email                    │
│  - Address, City, State, ZIP             │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Review Order Summary                    │
│  - Items, Quantity, Price                │
│  - Total Amount                          │
│  - Payment: Online (Razorpay)            │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Click "Proceed to Payment"              │
└──────┬───────────────────────────────────┘
       │
       ▼

BACKEND SIDE:
┌──────────────────────────────────────────┐
│  POST /api/payment/create-order          │
│  - Create Razorpay Order                 │
│  - Get Order ID                          │
│  - Return to Frontend                    │
└──────┬───────────────────────────────────┘
       │
       ▼

CUSTOMER SIDE (RAZORPAY):
┌──────────────────────────────────────────┐
│  Razorpay Checkout Modal Opens           │
│  ┌────────────────────────────────────┐  │
│  │  Amount: ₹5,000                    │  │
│  │  Payment Methods:                  │  │
│  │  - Credit/Debit Card               │  │
│  │  - UPI                             │  │
│  │  - Wallets                         │  │
│  │  - Net Banking                     │  │
│  └────────────────────────────────────┘  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Customer Enters Payment Details         │
│  - Card: 4111 1111 1111 1111             │
│  - Expiry: MM/YY                         │
│  - CVV: 123                              │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Razorpay Processes Payment              │
│  - Validates card                        │
│  - Charges amount                        │
│  - Returns payment ID & signature        │
└──────┬───────────────────────────────────┘
       │
       ▼

BACKEND SIDE:
┌──────────────────────────────────────────┐
│  POST /api/payment/verify                │
│  - Verify Razorpay signature             │
│  - Confirm payment success               │
│  - Return payment details                │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  POST /api/orders                        │
│  - Validate address                      │
│  - Calculate totals                      │
│  - Create Order in MongoDB               │
│  - Payment Mode: Prepaid                 │
│  - Payment Status: Completed             │
│  - Transaction ID: pay_xxx               │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Create Delhivery Shipment               │
│  - Payment Mode: Prepaid                 │
│  - Get Tracking Number                   │
│  - Store in Order                        │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Award Fire Coins                        │
│  - Calculate coins earned                │
│  - Update user balance                   │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Return Order Confirmation               │
│  - Order Number                          │
│  - Tracking Number                       │
│  - Estimated Delivery                    │
└──────┬───────────────────────────────────┘
       │
       ▼

CUSTOMER RECEIVES:
┌──────────────────────────────────────────┐
│  Order Confirmation                      │
│  - Order #: AG123456789                  │
│  - Tracking: DL123456789                 │
│  - Status: Processing                    │
│  - Payment: Online (Completed)           │
│  - Amount Paid: ₹5,000                   │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Delhivery Picks Up & Delivers           │
│  - Tracking updates in real-time         │
│  - Customer receives package             │
│  - No payment needed (already paid)      │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Order Marked as Delivered               │
│  - Payment Status: Completed             │
│  - Order Status: Delivered               │
└──────────────────────────────────────────┘
```

## Admin Order Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           ADMIN ORDER MANAGEMENT FLOW                            │
└─────────────────────────────────────────────────────────────────┘

ADMIN DASHBOARD:
┌──────────────────────────────────────────┐
│  /admin/orders                           │
│  ┌────────────────────────────────────┐  │
│  │ Filters:                           │  │
│  │ Status: [All ▼]                    │  │
│  │ Payment: [All ▼]                   │  │
│  └────────────────────────────────────┘  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Orders Table                            │
│  ┌────────────────────────────────────┐  │
│  │ Order# │ Customer │ Total │ Mode   │  │
│  │ AG001  │ John Doe │ ₹5000 │ COD    │  │
│  │ AG002  │ Jane Doe │ ₹3000 │ Online │  │
│  │ AG003  │ Bob Smith│ ₹7500 │ COD    │  │
│  └────────────────────────────────────┘  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Click Edit Icon on Order                │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Edit Order Modal                        │
│  ┌────────────────────────────────────┐  │
│  │ Status: [pending ▼]                │  │
│  │ Payment Mode: [COD ▼]              │  │
│  │ Payment Status: [pending ▼]        │  │
│  │                                    │  │
│  │ [✓ Save]  [✗ Cancel]              │  │
│  └────────────────────────────────────┘  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Admin Updates Order                     │
│  - Change status to "shipped"            │
│  - Update payment status if needed       │
│  - Click Save                            │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  PUT /api/admin/orders                   │
│  - Validate admin role                   │
│  - Update order in MongoDB               │
│  - Return updated order                  │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Order Updated Successfully              │
│  - Status changed                        │
│  - Payment mode updated                  │
│  - Changes reflected in table             │
└──────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Click Track Link                        │
│  - Opens Delhivery tracking page         │
│  - Real-time delivery status             │
│  - Customer location                     │
└──────────────────────────────────────────┘
```

## Database Schema

```
ORDER DOCUMENT:
{
  _id: ObjectId,
  orderNumber: "AG123456789",
  userId: ObjectId,
  items: [
    {
      productId: "prod_001",
      name: "Shilajit Premium",
      price: 999,
      quantity: 1,
      image: "url"
    }
  ],
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "9876543210",
    address1: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    country: "India"
  },
  payment: {
    mode: "COD" | "Prepaid",
    method: "Razorpay" | undefined,
    cardNumber: "****1111" | undefined,
    transactionId: "pay_xxx" | undefined,
    status: "pending" | "completed"
  },
  subtotal: 999,
  tax: 0,
  shipping: 0,
  discountAmount: 0,
  total: 999,
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered",
  trackingNumber: "DL123456789",
  shippingProvider: "delhivery",
  trackingStatus: "pending" | "picked" | "in_transit" | "delivered",
  createdAt: Date,
  updatedAt: Date
}
```

## Key Differences: COD vs Online Payment

```
┌─────────────────────┬──────────────────┬──────────────────┐
│ Aspect              │ COD              │ Online Payment   │
├─────────────────────┼──────────────────┼──────────────────┤
│ Payment Mode        │ COD              │ Prepaid          │
│ Payment Status      │ Pending          │ Completed        │
│ Delhivery Mode      │ COD              │ Prepaid          │
│ When Payment Made   │ On Delivery      │ Before Order     │
│ Order Creation      │ Immediate        │ After Verify     │
│ Razorpay Involved   │ No               │ Yes              │
│ Transaction ID      │ None             │ pay_xxx          │
│ Admin Action        │ Mark Delivered   │ Ready to Ship    │
│ Risk                │ Payment Risk     │ Fulfillment Risk │
└─────────────────────┴──────────────────┴──────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                                │
└─────────────────────────────────────────────────────────────────┘

CHECKOUT ERRORS:
├─ Missing Address Fields
│  └─ Show: "Please fill in all required fields"
│
├─ Invalid ZIP Code
│  └─ Show: "Invalid ZIP code"
│
└─ Cart Empty
   └─ Show: "Your cart is empty"

PAYMENT ERRORS:
├─ Razorpay Script Failed
│  └─ Show: "Failed to load payment gateway"
│
├─ Payment Verification Failed
│  └─ Show: "Payment verification failed"
│
├─ Signature Mismatch
│  └─ Show: "Payment verification failed"
│
└─ User Cancelled Payment
   └─ Show: "Payment cancelled by user"

ORDER CREATION ERRORS:
├─ Unauthorized User
│  └─ Return: 401 Unauthorized
│
├─ Duplicate Order (Idempotency)
│  └─ Return: Existing order data
│
├─ Coupon Invalid
│  └─ Show: "Coupon has expired"
│
└─ Delhivery Shipment Failed
   └─ Log error but don't fail order

ADMIN ERRORS:
├─ Not Admin User
│  └─ Return: 401 Unauthorized
│
├─ Order Not Found
│  └─ Return: 404 Not Found
│
└─ Invalid Status
   └─ Return: 400 Bad Request
```
