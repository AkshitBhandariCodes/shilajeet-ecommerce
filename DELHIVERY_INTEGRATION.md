# Delhivery Shipping Integration Guide

## Overview

Delhivery is India's leading logistics provider. This guide shows how to integrate Delhivery shipping into your Agnishila e-commerce platform.

## Key Features

✅ **Order Creation** - Create shipments and get waybill numbers
✅ **Tracking** - Track shipments in real-time
✅ **Shipping Rates** - Calculate shipping charges
✅ **Reverse Pickups** - Handle returns and reverse logistics
✅ **COD & Prepaid** - Support both payment modes

## Prerequisites

1. **Delhivery Account**
   - Business account with Delhivery
   - API credentials (Client ID, API Token)
   - Warehouse registered with Delhivery

2. **API Access**
   - Test environment credentials
   - Production environment credentials
   - API documentation access

## Getting Started

### Step 1: Get API Credentials

1. Login to Delhivery One: https://ucp.delhivery.com
2. Go to Developer Portal: https://ucp.delhivery.com/developer-portal/documents
3. Get your:
   - **Client ID** (your registered company name)
   - **API Token** (authentication token)
   - **Test URL** (sandbox environment)
   - **Production URL** (live environment)

### Step 2: Environment Setup

Add to `.env`:

```env
DELHIVERY_CLIENT_ID=your_client_id
DELHIVERY_API_TOKEN=your_api_token
DELHIVERY_TEST_URL=https://staging-express-api.delhivery.com
DELHIVERY_PROD_URL=https://express-api.delhivery.com
DELHIVERY_WAREHOUSE_NAME=Your_Warehouse_Name
DELHIVERY_ENVIRONMENT=test  # or 'production'
```

## API Endpoints

### 1. Order Creation API

**Purpose**: Create shipments and get waybill numbers

**Endpoint**:
```
POST /api/shipments/delhivery/create
```

**Request Body**:
```json
{
  "format": "json",
  "data": {
    "waybill": "optional_waybill_number",
    "order_id": "unique_order_id",
    "shipment_length": 10,
    "shipment_width": 10,
    "shipment_height": 10,
    "weight": 0.5,
    "payment_mode": "COD",
    "pickup_location": "Your_Warehouse_Name",
    "customer_name": "John Doe",
    "customer_phone": "9876543210",
    "customer_email": "john@example.com",
    "delivery_address": "123 Main St, City, State 110001",
    "delivery_pin": "110001",
    "country": "India",
    "seller_name": "Agnishila",
    "seller_phone": "9876543210",
    "seller_address": "Warehouse Address",
    "seller_gst_tin": "your_gst_number",
    "hsn_code": "30049090",
    "fragile_shipment": false,
    "items": [
      {
        "name": "Product Name",
        "quantity": 1,
        "price": 1000
      }
    ]
  }
}
```

**Response**:
```json
{
  "success": true,
  "waybill": "1234567890",
  "order_id": "ORD-2025-001",
  "tracking_url": "https://track.delhivery.com/tracking/1234567890"
}
```

### 2. Tracking API

**Purpose**: Get shipment tracking information

**Endpoint**:
```
GET /api/shipments/delhivery/track/:waybill
```

**Response**:
```json
{
  "waybill": "1234567890",
  "status": "Delivered",
  "last_update": "2025-01-07 14:30:00",
  "location": "Delhi",
  "events": [
    {
      "timestamp": "2025-01-07 14:30:00",
      "status": "Delivered",
      "location": "Delhi"
    }
  ]
}
```

### 3. Shipping Rates API

**Purpose**: Calculate shipping charges

**Endpoint**:
```
POST /api/shipments/delhivery/rates
```

**Request Body**:
```json
{
  "pickup_pin": "110001",
  "delivery_pin": "400001",
  "weight": 0.5,
  "payment_mode": "COD"
}
```

**Response**:
```json
{
  "shipping_charge": 50,
  "cod_charge": 10,
  "total": 60
}
```

## Implementation

### Step 1: Create Delhivery Service

Create `lib/delhivery.ts`:

```typescript
import axios from 'axios';

interface DelhiveryConfig {
  clientId: string;
  apiToken: string;
  baseUrl: string;
}

class DelhiveryService {
  private config: DelhiveryConfig;

  constructor() {
    this.config = {
      clientId: process.env.DELHIVERY_CLIENT_ID || '',
      apiToken: process.env.DELHIVERY_API_TOKEN || '',
      baseUrl: process.env.DELHIVERY_ENVIRONMENT === 'production'
        ? process.env.DELHIVERY_PROD_URL || ''
        : process.env.DELHIVERY_TEST_URL || '',
    };
  }

  async createShipment(orderData: any) {
    try {
      const payload = {
        format: 'json',
        data: {
          waybill: '',
          order_id: orderData.orderId,
          shipment_length: 10,
          shipment_width: 10,
          shipment_height: 10,
          weight: orderData.weight || 0.5,
          payment_mode: orderData.paymentMode || 'COD',
          pickup_location: process.env.DELHIVERY_WAREHOUSE_NAME,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          customer_email: orderData.customerEmail,
          delivery_address: orderData.deliveryAddress,
          delivery_pin: orderData.deliveryPin,
          country: 'India',
          seller_name: 'Agnishila',
          seller_phone: process.env.SELLER_PHONE,
          seller_address: process.env.SELLER_ADDRESS,
          seller_gst_tin: process.env.SELLER_GST_TIN,
          hsn_code: '30049090',
          fragile_shipment: false,
        },
      };

      const response = await axios.post(
        `${this.config.baseUrl}/api/cmu/create/json/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Delhivery shipment creation error:', error);
      throw error;
    }
  }

  async trackShipment(waybill: string) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/api/track/shipment/${waybill}/`,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Delhivery tracking error:', error);
      throw error;
    }
  }

  async getShippingRates(pickupPin: string, deliveryPin: string, weight: number) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/api/rates/`,
        {
          params: {
            pickup_pin: pickupPin,
            delivery_pin: deliveryPin,
            weight: weight,
          },
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Delhivery rates error:', error);
      throw error;
    }
  }
}

export default new DelhiveryService();
```

### Step 2: Create API Routes

Create `app/api/shipments/delhivery/create/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import delhiveryService from '@/lib/delhivery';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();

    // Get order details
    const order = await Order.findOne({ orderNumber: orderId });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create shipment with Delhivery
    const shipmentData = {
      orderId: order.orderNumber,
      customerName: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
      customerPhone: order.shippingAddress.phone,
      customerEmail: order.shippingAddress.email,
      deliveryAddress: `${order.shippingAddress.address1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
      deliveryPin: order.shippingAddress.zipCode,
      weight: 0.5, // Calculate based on items
      paymentMode: order.payment.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
    };

    const result = await delhiveryService.createShipment(shipmentData);

    // Save waybill to order
    order.trackingNumber = result.waybill;
    order.shippingProvider = 'delhivery';
    await order.save();

    return NextResponse.json({
      success: true,
      waybill: result.waybill,
      trackingUrl: `https://track.delhivery.com/tracking/${result.waybill}`,
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}
```

Create `app/api/shipments/delhivery/track/[waybill]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import delhiveryService from '@/lib/delhivery';

export async function GET(
  request: NextRequest,
  { params }: { params: { waybill: string } }
) {
  try {
    const tracking = await delhiveryService.trackShipment(params.waybill);
    return NextResponse.json(tracking);
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json({ error: 'Failed to track shipment' }, { status: 500 });
  }
}
```

### Step 3: Update Order Model

Add to `models/Order.ts`:

```typescript
trackingNumber: {
  type: String,
  required: false,
},
shippingProvider: {
  type: String,
  enum: ['delhivery', 'other'],
  default: 'delhivery',
},
trackingStatus: {
  type: String,
  enum: ['pending', 'picked', 'in_transit', 'delivered', 'failed'],
  default: 'pending',
},
```

### Step 4: Create Tracking Component

Create `components/OrderTracking.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
}

export default function OrderTracking({ waybill }: { waybill: string }) {
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await fetch(`/api/shipments/delhivery/track/${waybill}`);
        const data = await response.json();
        setTracking(data);
      } catch (error) {
        console.error('Error fetching tracking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [waybill]);

  if (loading) return <div>Loading tracking information...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Tracking Information</h3>
      
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-gray-600">Waybill: {waybill}</p>
        <p className="text-lg font-bold text-blue-600">{tracking?.status}</p>
      </div>

      <div className="space-y-3">
        {tracking?.events?.map((event: TrackingEvent, index: number) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {event.status === 'Delivered' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Truck className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div>
              <p className="font-medium">{event.status}</p>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-xs text-gray-500">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Integration Checklist

- [ ] Get Delhivery API credentials
- [ ] Add environment variables
- [ ] Create Delhivery service
- [ ] Create API routes
- [ ] Update Order model
- [ ] Create tracking component
- [ ] Test in sandbox environment
- [ ] Move to production

## Testing

### Test in Sandbox

1. Use test credentials
2. Create test orders
3. Verify waybill generation
4. Test tracking

### Production Checklist

- [ ] Switch to production credentials
- [ ] Test with real orders
- [ ] Verify shipping charges
- [ ] Monitor tracking updates
- [ ] Handle errors gracefully

## Important Notes

1. **Warehouse Name**: Must match exactly with registered warehouse
2. **GST Details**: Required for orders over ₹50,000
3. **Special Characters**: Avoid &, #, %, ;, \ in payload
4. **Pin Codes**: Must be valid Indian pin codes
5. **Weight**: In kg (e.g., 0.5 for 500g)

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| Invalid warehouse | Check warehouse name matches exactly |
| Invalid pin code | Verify pin code is valid |
| Authentication failed | Check API token and client ID |
| Duplicate order ID | Ensure order IDs are unique |
| Missing GST | Add GST details for orders > ₹50,000 |

## Support

- **Delhivery Docs**: https://delhivery-express-api-doc.readme.io
- **Developer Portal**: https://ucp.delhivery.com/developer-portal/documents
- **Support Email**: support@delhivery.com

## Next Steps

1. Get Delhivery account and API credentials
2. Implement the service and API routes
3. Test in sandbox environment
4. Deploy to production
5. Monitor shipments and tracking

---

**Status**: Ready for implementation
**Last Updated**: December 30, 2025
