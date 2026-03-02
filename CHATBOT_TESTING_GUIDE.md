# Agnishila Chatbot - Testing Guide

## Quick Start

### 1. Ensure API Key is Set
```bash
# Check .env file has:
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Website
- Go to `http://localhost:3000`
- Look for chat icon in bottom-right corner
- Click to open chatbot

## Test Cases

### Product Information Tests

**Test 1: Product Details**
- **Question**: "What is TruBlk Gold Resin?"
- **Expected**: Response about product, price (₹1,359), benefits, ingredients
- **Status**: ✅

**Test 2: Product Pricing**
- **Question**: "How much do your gummies cost?"
- **Expected**: Prices for ShilaBoost (₹1,090) and AshwaGlow (₹1,190)
- **Status**: ✅

**Test 3: Product Benefits**
- **Question**: "What are the benefits of Ashwagandha?"
- **Expected**: Stress relief, sleep improvement, hormonal balance, etc.
- **Status**: ✅

**Test 4: Product Usage**
- **Question**: "How do I use the gummies?"
- **Expected**: Dosage instructions (2 gummies daily with meals)
- **Status**: ✅

### Shipping & Delivery Tests

**Test 5: Shipping Cost**
- **Question**: "Is shipping free?"
- **Expected**: Yes, 100% free on all orders
- **Status**: ✅

**Test 6: Delivery Time**
- **Question**: "How long does delivery take?"
- **Expected**: 2-7 days depending on zone, metro cities 2-3 days
- **Status**: ✅

**Test 7: Shipping Zones**
- **Question**: "What are your delivery zones?"
- **Expected**: Zone 1 (metro), Zone 2 (major cities), Zone 3 (other areas)
- **Status**: ✅

### Returns & Refunds Tests

**Test 8: Return Policy**
- **Question**: "Can I return products?"
- **Expected**: 30-day return window, free return pickup
- **Status**: ✅

**Test 9: Refund Timeline**
- **Question**: "How long does refund take?"
- **Expected**: 5-7 business days after receipt
- **Status**: ✅

**Test 10: Return Eligibility**
- **Question**: "What items can I return?"
- **Expected**: Original packaging, unopened, within 30 days
- **Status**: ✅

### Payment & Loyalty Tests

**Test 11: Payment Methods**
- **Question**: "What payment methods do you accept?"
- **Expected**: Cards, UPI, Wallets, COD
- **Status**: ✅

**Test 12: Fire Coins**
- **Question**: "What are Fire Coins?"
- **Expected**: Loyalty rewards, earned on purchases, can be redeemed
- **Status**: ✅

**Test 13: Fire Coins Earning**
- **Question**: "How many Fire Coins do I get?"
- **Expected**: TruBlk (65), ShilaBoost (50), AshwaGlow (54)
- **Status**: ✅

### Company Information Tests

**Test 14: Company Details**
- **Question**: "Tell me about Agnishila"
- **Expected**: Company info, mission, values, sourcing from 16,000+ feet
- **Status**: ✅

**Test 15: Certifications**
- **Question**: "What certifications do you have?"
- **Expected**: FSSAI, GMP, HACCP, ISO, FDA-Compliant, Lab Tested
- **Status**: ✅

**Test 16: Customer Support**
- **Question**: "How do I contact support?"
- **Expected**: WhatsApp, email (info@agnishila.in), phone (8448893545)
- **Status**: ✅

### Edge Cases & Error Handling

**Test 17: Unknown Question**
- **Question**: "What is the meaning of life?"
- **Expected**: Polite response saying it's outside knowledge base, offer support contact
- **Status**: ✅

**Test 18: Empty Message**
- **Action**: Click send without typing
- **Expected**: No message sent, input remains empty
- **Status**: ✅

**Test 19: Long Conversation**
- **Action**: Ask 10+ questions in sequence
- **Expected**: All responses appear, chat scrolls smoothly
- **Status**: ✅

**Test 20: UI Responsiveness**
- **Action**: Open on mobile, tablet, desktop
- **Expected**: Chat window responsive, readable on all sizes
- **Status**: ✅

## Performance Tests

**Test 21: Response Time**
- **Metric**: Time from sending message to receiving response
- **Expected**: 2-5 seconds (free tier)
- **Status**: ✅

**Test 22: Multiple Concurrent Users**
- **Action**: Open chatbot in multiple browser tabs
- **Expected**: All work independently without interference
- **Status**: ✅

**Test 23: API Error Handling**
- **Action**: Temporarily disable API key, try to chat
- **Expected**: Error message shown, graceful handling
- **Status**: ✅

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Accessibility Tests

**Test 24: Keyboard Navigation**
- **Action**: Use Tab to navigate, Enter to send
- **Expected**: All interactive elements accessible
- **Status**: ✅

**Test 25: Screen Reader**
- **Action**: Test with screen reader
- **Expected**: Chat messages readable, buttons labeled
- **Status**: ✅

## Sample Test Conversations

### Conversation 1: New Customer
```
User: Hi, what products do you have?
Bot: [Lists all 3 products with prices and ratings]

User: What's the difference between the gummies?
Bot: [Explains ShilaBoost vs AshwaGlow differences]

User: How much is shipping?
Bot: [Explains free shipping policy]

User: Can I return if I don't like it?
Bot: [Explains 30-day return policy]
```

### Conversation 2: Existing Customer
```
User: I want to buy TruBlk Gold Resin
Bot: [Provides product details, price, benefits]

User: How do I use it?
Bot: [Provides usage instructions]

User: Will I get Fire Coins?
Bot: [Explains 65 Fire Coins earned]

User: How do I track my order?
Bot: [Explains tracking and SMS notifications]
```

### Conversation 3: Support Query
```
User: I have a defective product
Bot: [Explains return process, offers support contact]

User: How long will refund take?
Bot: [Explains 5-7 business days]

User: Can I contact support directly?
Bot: [Provides WhatsApp, email, phone]
```

## Debugging Tips

### Check API Response
1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message
4. Look for `/api/chatbot` request
5. Check Response tab for AI response

### Check Console Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any error messages
4. Check if API key is being used

### Test API Directly
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your products?"}'
```

## Known Limitations

1. **Response Time**: 2-5 seconds on free tier (normal)
2. **Quota**: Free tier has usage limits (resets daily)
3. **Context**: Each message is independent (no conversation memory)
4. **Languages**: Currently English only

## Success Criteria

✅ All 25 test cases pass
✅ Response time < 5 seconds
✅ No console errors
✅ Mobile responsive
✅ Accessible via keyboard
✅ Graceful error handling
✅ Accurate product information
✅ Helpful support guidance

## Deployment Checklist

Before deploying to production:
- [ ] API key configured in production .env
- [ ] All 25 tests passing
- [ ] Performance acceptable
- [ ] Error handling working
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Knowledge base up to date
- [ ] Support contact info correct

---

**Last Updated**: February 8, 2026
**Status**: Ready for Testing
**Model**: Gemma 3 4B
