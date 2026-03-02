# Coupon System Implementation Guide

## Overview
A complete coupon/discount code system has been implemented for the Agnishila e-commerce platform, allowing admins to create and manage coupons, and users to apply them during checkout.

## System Architecture

### 1. Database Models

#### Coupon Model (`models/Coupon.ts`)
```typescript
- code: String (unique, uppercase)
- description: String
- discountType: 'percentage' | 'fixed'
- discountValue: Number
- minOrderAmount: Number (minimum order to apply coupon)
- maxDiscount: Number (max discount for percentage coupons)
- maxUses: Number (null = unlimited)
- usedCount: Number (tracks usage)
- usedBy: Array (tracks which users used it)
- expiryDate: Date
- active: Boolean
- createdBy: ObjectId (admin who created it)
```

#### Order Model Updates
Added to existing Order model:
- `couponCode`: String (code applied to order)
- `discountAmount`: Number (discount given)

### 2. API Routes

#### User-Facing Routes

**POST `/api/coupons/validate`**
- Validates coupon code and calculates discount
- Checks: active status, expiry date, usage limits, minimum order amount
- Returns: discount amount and coupon details
- Request: `{ code: string, orderAmount: number }`
- Response: `{ valid: true, coupon: {...} }`

#### Admin Routes

**GET `/api/admin/coupons`**
- Fetches all coupons (admin only)
- Returns: Array of all coupons with usage stats

**POST `/api/admin/coupons`**
- Creates new coupon (admin only)
- Request: Coupon data
- Response: Created coupon object

**PUT `/api/admin/coupons/[id]`**
- Updates existing coupon (admin only)
- Request: Updated coupon fields
- Response: Updated coupon object

**DELETE `/api/admin/coupons/[id]`**
- Deletes coupon (admin only)
- Response: Success message

### 3. Frontend Components

#### CouponContext (`contexts/CouponContext.tsx`)
Global state management for coupons:
```typescript
- appliedCoupon: AppliedCoupon | null
- applyCoupon(code, orderAmount): Promise<boolean>
- removeCoupon(): void
- isLoading: boolean
- error: string | null
```

#### CouponInput Component (`components/CouponInput.tsx`)
Reusable coupon input field with:
- Input field for coupon code
- Apply button
- Applied coupon display with remove option
- Error handling and loading states

#### OrderSummary Component Updates
- Displays applied coupon with discount amount
- Shows final total after discount
- Green highlight for discount line

#### Cart Page Updates
- Integrated CouponInput component
- Shows coupon discount in order summary
- Updates total calculation with discount

#### Checkout Page Updates
- Passes coupon code to order creation API
- Calculates final total with discount
- Includes coupon in order data

### 4. Admin Panel

#### Coupon Management Page (`app/admin/coupons/page.tsx`)
Features:
- **List View**: Table showing all coupons with:
  - Code, Description, Discount type/value
  - Minimum order amount, Usage count
  - Expiry date, Active status
  - Edit/Delete actions

- **Create Form**: 
  - Coupon code (auto-uppercase)
  - Description
  - Discount type (percentage or fixed)
  - Discount value
  - Minimum order amount
  - Maximum discount (for percentage)
  - Maximum uses (leave empty for unlimited)
  - Expiry date (optional)

- **Edit Form**: Same as create, with pre-filled values

- **Actions**:
  - Create new coupon
  - Edit existing coupon
  - Delete coupon with confirmation
  - Real-time validation and error messages

### 5. User Flow

#### Applying Coupon
1. User adds items to cart
2. On cart page, enters coupon code in "Have a coupon code?" section
3. Clicks "Apply" button
4. System validates coupon:
   - Checks if code exists and is active
   - Verifies expiry date
   - Checks usage limits
   - Validates minimum order amount
5. If valid:
   - Calculates discount amount
   - Displays "Coupon Applied" message
   - Updates order total with discount
   - Shows discount breakdown
6. User can remove coupon anytime
7. Proceeds to checkout with coupon applied
8. Order is created with coupon code and discount amount

#### Creating Coupon (Admin)
1. Admin navigates to `/admin/coupons`
2. Clicks "New Coupon" button
3. Fills in coupon details:
   - Unique code (e.g., "SAVE20")
   - Description (e.g., "20% off on all products")
   - Discount type and value
   - Optional: min order, max discount, max uses, expiry date
4. Clicks "Create Coupon"
5. Coupon appears in list immediately
6. Can edit or delete anytime

### 6. Coupon Types

#### Percentage Discount
- Example: 20% off
- Calculation: `(orderAmount * 20) / 100`
- Optional max discount cap (e.g., max ₹1000)

#### Fixed Amount Discount
- Example: ₹500 off
- Calculation: Direct deduction of ₹500

### 7. Validation Rules

**Coupon is valid if:**
- ✓ Code exists in database
- ✓ Coupon is marked as active
- ✓ Current date is before expiry date (if set)
- ✓ Usage count < max uses (if limit set)
- ✓ Order amount >= minimum order amount
- ✓ User hasn't already used this coupon (optional - can be enforced)

**Coupon is invalid if:**
- ✗ Code doesn't exist
- ✗ Coupon is inactive
- ✗ Coupon has expired
- ✗ Usage limit reached
- ✗ Order amount below minimum
- ✗ User already used this coupon (if enforced)

### 8. Order Processing with Coupon

When order is created:
1. Coupon code is validated again
2. Discount amount is calculated
3. Order is saved with:
   - `couponCode`: Applied coupon code
   - `discountAmount`: Calculated discount
   - `total`: Final amount after discount
4. Coupon usage is updated:
   - `usedCount` incremented
   - User ID and order ID added to `usedBy` array
5. Cart is cleared

### 9. Integration Points

**CouponProvider** added to `app/providers.tsx`:
- Wraps entire application
- Makes `useCoupon()` hook available globally

**Components using coupons:**
- `CouponInput` - Input field
- `OrderSummary` - Discount display
- `CartPage` - Coupon section
- `CheckoutPage` - Coupon in order data

### 10. Security Considerations

- ✓ Admin-only coupon creation/management
- ✓ Coupon validation on backend (not just frontend)
- ✓ Usage tracking prevents abuse
- ✓ Expiry dates prevent old coupon usage
- ✓ Minimum order amounts ensure profitability
- ✓ Max discount caps prevent excessive losses

### 11. Future Enhancements

Possible additions:
- User-specific coupons (email-based)
- Category-specific coupons
- Product-specific coupons
- Coupon analytics dashboard
- Automatic coupon generation for campaigns
- Referral coupon system
- Seasonal coupon templates
- Coupon code sharing/referral tracking

### 12. Testing Checklist

- [ ] Create coupon with percentage discount
- [ ] Create coupon with fixed discount
- [ ] Apply valid coupon to cart
- [ ] Verify discount calculation
- [ ] Test expired coupon (should fail)
- [ ] Test usage limit (should fail when exceeded)
- [ ] Test minimum order amount (should fail if not met)
- [ ] Remove applied coupon
- [ ] Complete order with coupon
- [ ] Verify coupon usage is tracked
- [ ] Edit coupon details
- [ ] Delete coupon
- [ ] Test invalid coupon code
- [ ] Test coupon on checkout page
- [ ] Verify order shows coupon code and discount

### 13. Example Coupons

**Percentage Discount:**
- Code: `SAVE20`
- Type: Percentage
- Value: 20%
- Max Discount: ₹1000
- Min Order: ₹500
- Max Uses: 100
- Expiry: 2025-12-31

**Fixed Discount:**
- Code: `FLAT500`
- Type: Fixed
- Value: ₹500
- Min Order: ₹2000
- Max Uses: Unlimited
- Expiry: 2025-12-31

**Limited Time:**
- Code: `FLASH50`
- Type: Percentage
- Value: 50%
- Max Discount: ₹2000
- Min Order: ₹1000
- Max Uses: 50
- Expiry: 2025-01-15

## Files Created/Modified

### New Files
- `models/Coupon.ts` - Coupon database model
- `app/api/coupons/validate/route.ts` - Coupon validation API
- `app/api/admin/coupons/route.ts` - Admin coupon CRUD
- `app/api/admin/coupons/[id]/route.ts` - Admin coupon update/delete
- `contexts/CouponContext.tsx` - Coupon state management
- `components/CouponInput.tsx` - Coupon input component
- `app/admin/coupons/page.tsx` - Admin coupon management page
- `COUPON_SYSTEM_DOCUMENTATION.md` - This file

### Modified Files
- `models/Order.ts` - Added couponCode and discountAmount fields
- `app/api/orders/route.ts` - Added coupon validation and application
- `components/OrderSummary.tsx` - Added coupon discount display
- `app/cart/page.tsx` - Added CouponInput component
- `app/checkout/page.tsx` - Added coupon to order creation
- `app/providers.tsx` - Added CouponProvider

## Deployment Notes

1. Run database migrations to add Coupon collection
2. Update Order model in existing orders (optional - new orders only)
3. Deploy new API routes
4. Deploy admin panel updates
5. Deploy frontend components
6. Test coupon creation and application
7. Monitor coupon usage and analytics

## Support

For issues or questions about the coupon system:
1. Check validation rules in `CouponInput` component
2. Review API error responses
3. Check admin panel for coupon status
4. Verify coupon hasn't expired or reached usage limit
