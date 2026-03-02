# 5% Signup Discount Implementation Guide

## Overview
This implementation adds a 5% welcome discount for new users who sign up. The system includes:
- A promotional popup for non-signed-in users
- Automatic coupon code generation on signup
- Auto-application of signup discount on first order
- Tracking of signup discount usage

## Features Implemented

### 1. **Signup Promotion Popup** (`components/SignupPromotionPopup.tsx`)
- Shows a floating popup in the bottom-right corner after 3 seconds
- Only displays for non-authenticated users
- Shows once per session
- Includes:
  - 5% discount badge
  - Call-to-action button to sign up
  - Benefits list
  - Close button

**Behavior:**
- Appears automatically 3 seconds after page load
- Only for users not logged in
- Can be dismissed by clicking X or backdrop
- Triggers signup modal when "Sign Up Now" is clicked

### 2. **Signup Discount Popup** (`components/SignupDiscountPopup.tsx`)
- Shows after successful signup
- Displays the unique coupon code generated for the user
- Includes:
  - Animated gift icon
  - 5% discount badge
  - Unique coupon code with copy button
  - Benefits and validity information
  - Auto-closes after 8 seconds

**Behavior:**
- Appears after user completes signup
- Shows unique coupon code (format: `WELCOME5{USER_ID_LAST_6_CHARS}`)
- Copy button for easy code sharing
- Auto-dismisses after 8 seconds

### 3. **User Model Updates** (`models/User.ts`)
Added three new fields:
```typescript
signupDiscountUsed: Boolean (default: false)
signupDiscountCode: String (optional)
firstOrderCompleted: Boolean (default: false)
```

### 4. **Signup Flow** (`app/api/auth/verify-otp/route.ts`)
When a user signs up:
1. User account is created
2. Unique welcome coupon is generated with code: `WELCOME5{USER_ID_LAST_6_CHARS}`
3. Coupon details:
   - **Discount Type:** Percentage
   - **Discount Value:** 5%
   - **Max Discount:** ₹500
   - **Max Uses:** 1 (per user)
   - **Expiry:** 30 days from signup
   - **Min Order Amount:** ₹0 (no minimum)
4. Coupon code is saved to user's `signupDiscountCode` field
5. Signup discount popup is triggered with the coupon code

### 5. **Auto-Application on First Order** (`app/api/orders/route.ts`)
When creating an order:
1. If no coupon code is provided, system checks for signup discount
2. If user has unused signup discount:
   - Validates coupon is still active and not expired
   - Validates coupon hasn't been used yet
   - Auto-applies the discount
3. Discount is calculated: 5% of subtotal (max ₹500)
4. After order is placed:
   - Coupon is marked as used
   - User's `signupDiscountUsed` flag is set to true

### 6. **Navbar Integration** (`components/Navbar.tsx`)
- Listens for `openSignupModal` custom event
- Triggers signup modal when promotion popup is clicked
- Displays signup discount popup after successful signup
- Passes coupon code from signup response to popup

### 7. **Layout Integration** (`app/layout.tsx`)
- Added `SignupPromotionPopup` component to root layout
- Ensures popup appears on all pages for non-authenticated users

## User Journey

### For New Users (Not Signed In):
1. User visits website
2. After 3 seconds, promotion popup appears (bottom-right)
3. User clicks "Sign Up Now"
4. Signup modal opens
5. User enters phone, receives OTP, verifies
6. User enters first name, last name, email
7. Account is created with unique welcome coupon
8. Signup discount popup appears showing coupon code
9. User can copy the code or proceed to shopping
10. On first order, discount is auto-applied

### For Existing Users:
- Promotion popup doesn't appear
- No signup discount available

## Coupon Code Format
- **Pattern:** `WELCOME5{LAST_6_CHARS_OF_USER_ID}`
- **Example:** `WELCOME5A1B2C3` (if user ID ends with A1B2C3)
- **Uniqueness:** Each user gets a unique code based on their ID

## Discount Details
- **Discount:** 5% off
- **Maximum Discount:** ₹500
- **Validity:** 30 days from signup
- **Usage:** One-time use per user
- **Minimum Order:** No minimum required
- **Auto-Application:** Yes, on first order if not manually applied

## Database Changes

### User Model
```typescript
{
  // ... existing fields
  signupDiscountUsed: Boolean,
  signupDiscountCode: String,
  firstOrderCompleted: Boolean
}
```

### Coupon Model (No changes needed)
Existing coupon model supports all required fields:
- code, description, discountType, discountValue
- minOrderAmount, maxDiscount, maxUses
- usedBy (tracks usage), expiryDate, active

## API Changes

### POST `/api/auth/verify-otp`
**Response (on signup):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer",
    "signupDiscountCode": "WELCOME5A1B2C3"
  }
}
```

### POST `/api/orders`
**Auto-Application Logic:**
- If no couponCode provided, checks for user's signup discount
- If valid, applies automatically
- Marks coupon as used and user's discount as used

## Testing Checklist

### 1. Promotion Popup
- [ ] Popup appears after 3 seconds for non-signed-in users
- [ ] Popup doesn't appear for signed-in users
- [ ] Popup only shows once per session
- [ ] Close button works
- [ ] "Sign Up Now" button opens signup modal

### 2. Signup Flow
- [ ] User can complete signup
- [ ] Unique coupon code is generated
- [ ] Coupon code is saved to user account
- [ ] Signup discount popup appears after signup
- [ ] Coupon code is displayed correctly
- [ ] Copy button works

### 3. Coupon Validation
- [ ] Coupon is active and valid
- [ ] Coupon has 30-day expiry
- [ ] Coupon has max 1 use
- [ ] Coupon shows 5% discount

### 4. First Order
- [ ] Signup discount is auto-applied on first order
- [ ] Discount amount is calculated correctly (5% max ₹500)
- [ ] Coupon is marked as used after order
- [ ] User's `signupDiscountUsed` flag is set to true
- [ ] Discount appears in order summary

### 5. Subsequent Orders
- [ ] Signup discount is NOT applied on second order
- [ ] User can manually apply other coupons

## Configuration

### Discount Amount
To change the discount percentage, update in `app/api/auth/verify-otp/route.ts`:
```typescript
discountValue: 5, // Change this value
```

### Maximum Discount Cap
To change the max discount cap, update:
```typescript
maxDiscount: 500, // Change this value (in rupees)
```

### Expiry Duration
To change the expiry period, update:
```typescript
expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Change 30 to desired days
```

### Popup Delay
To change when promotion popup appears, update in `components/SignupPromotionPopup.tsx`:
```typescript
const timer = setTimeout(() => {
  setIsOpen(true);
  setHasSeenPopup(true);
}, 3000); // Change 3000 to desired milliseconds
```

## Files Modified/Created

### Created:
1. `components/SignupDiscountPopup.tsx` - Popup shown after signup
2. `components/SignupPromotionPopup.tsx` - Promotional popup for non-users
3. `SIGNUP_DISCOUNT_IMPLEMENTATION.md` - This guide

### Modified:
1. `models/User.ts` - Added signup discount tracking fields
2. `app/api/auth/verify-otp/route.ts` - Added coupon generation on signup
3. `components/AuthModal.tsx` - Added onSignupComplete callback
4. `components/Navbar.tsx` - Added popup integration and event listener
5. `app/api/orders/route.ts` - Added auto-application logic
6. `app/layout.tsx` - Added SignupPromotionPopup component

## Troubleshooting

### Popup Not Appearing
- Check if user is authenticated (popup only shows for non-auth users)
- Check browser console for errors
- Verify `SignupPromotionPopup` is added to layout

### Coupon Code Not Generated
- Check if signup is completing successfully
- Verify Coupon model is imported in verify-otp route
- Check database for coupon creation

### Discount Not Auto-Applying
- Verify user has `signupDiscountCode` set
- Check if coupon is still valid (not expired)
- Verify coupon hasn't been used yet
- Check order API logs for auto-application logic

### Popup Showing Multiple Times
- Clear browser localStorage/sessionStorage
- Check if `hasSeenPopup` state is persisting correctly

## Future Enhancements

1. **Email Notification:** Send coupon code via email after signup
2. **SMS Notification:** Send coupon code via SMS
3. **Admin Dashboard:** View signup discount usage statistics
4. **Customizable Discount:** Admin can set discount percentage and cap
5. **Referral Integration:** Combine with referral program
6. **Analytics:** Track conversion from popup to signup to order
7. **A/B Testing:** Test different discount amounts
8. **Expiry Reminder:** Send reminder before coupon expires

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the implementation files
3. Check browser console for errors
4. Check server logs for API errors
