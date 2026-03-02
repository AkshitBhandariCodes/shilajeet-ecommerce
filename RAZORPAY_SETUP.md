# Razorpay Integration Setup Guide

## 1. Create Razorpay Account

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a new account or log in to existing account
3. Complete the KYC verification process

## 2. Get API Keys

1. Go to **Settings** → **API Keys** in your Razorpay dashboard
2. Generate API keys for your account
3. Copy the **Key ID** and **Key Secret**

## 3. Configure Environment Variables

Update your `.env` file with your Razorpay credentials:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
```

**Important Notes:**
- Use `rzp_test_` keys for development/testing
- Use `rzp_live_` keys for production
- Never commit your secret keys to version control

## 4. Test Mode vs Live Mode

### Test Mode (Development)
- Use test API keys (`rzp_test_`)
- No real money transactions
- Use test card numbers for testing

### Live Mode (Production)
- Use live API keys (`rzp_live_`)
- Real money transactions
- Complete KYC verification required

## 5. Test Card Numbers

For testing in development mode, use these test card numbers:

| Card Network | Card Number | CVV | Expiry |
|--------------|-------------|-----|--------|
| Visa | 4111 1111 1111 1111 | 123 | Any future date |
| Mastercard | 5555 5555 5555 4444 | 123 | Any future date |
| American Express | 3782 8224 6310 005 | 1234 | Any future date |

## 6. UPI Testing

For UPI testing, use:
- UPI ID: `success@razorpay`
- This will simulate a successful payment

## 7. Webhook Configuration (Optional)

1. Go to **Settings** → **Webhooks** in Razorpay dashboard
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret for verification

## 8. Currency Support

- Primary: INR (Indian Rupees)
- International: USD, EUR, GBP (requires additional setup)

## 9. Payment Methods Supported

- **Cards**: Visa, Mastercard, American Express, RuPay
- **UPI**: Google Pay, PhonePe, Paytm, BHIM
- **Wallets**: Paytm, Mobikwik, Freecharge, Ola Money
- **Net Banking**: All major Indian banks
- **EMI**: Card and Bank EMI options

## 10. Security Features

- PCI DSS Level 1 compliant
- 256-bit SSL encryption
- Two-factor authentication
- Real-time fraud detection
- Automatic payment verification

## 11. Integration Features Implemented

✅ **Payment Gateway Integration**
- Razorpay checkout modal
- Multiple payment methods
- Real-time payment verification
- Automatic signature verification

✅ **Order Management**
- Order creation with Razorpay order ID
- Payment status tracking
- Transaction ID storage
- Automatic cart clearing

✅ **User Experience**
- Seamless payment flow
- Loading states and error handling
- Payment method selection
- Mobile-responsive design

✅ **Security**
- Server-side payment verification
- Signature validation
- Secure API key handling
- Payment data encryption

## 12. Going Live Checklist

Before switching to live mode:

- [ ] Complete Razorpay KYC verification
- [ ] Test all payment methods thoroughly
- [ ] Update environment variables with live keys
- [ ] Configure webhook endpoints
- [ ] Set up proper error logging
- [ ] Test refund functionality
- [ ] Verify tax calculations
- [ ] Test order confirmation emails
- [ ] Ensure HTTPS is enabled
- [ ] Review security measures

## 13. Support and Documentation

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [API Reference](https://razorpay.com/docs/api/)
- [Support Portal](https://razorpay.com/support/)

## 14. Troubleshooting

### Common Issues:

1. **Payment Gateway Not Loading**
   - Check if Razorpay script is loaded
   - Verify API keys are correct
   - Check browser console for errors

2. **Payment Verification Failed**
   - Ensure webhook secret is correct
   - Check signature generation logic
   - Verify order ID matches

3. **Test Payments Not Working**
   - Confirm using test API keys
   - Use correct test card numbers
   - Check if test mode is enabled

### Error Codes:

- `BAD_REQUEST_ERROR`: Invalid request parameters
- `GATEWAY_ERROR`: Payment gateway issue
- `INTERNAL_SERVER_ERROR`: Server-side error
- `SERVER_ERROR`: Razorpay server issue

For additional support, contact Razorpay support team or check their documentation.