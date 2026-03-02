// Test script to verify Delhivery shipment creation
const testOrder = {
  items: [
    {
      productId: "test-product",
      name: "Test Product",
      price: 500,
      quantity: 1
    }
  ],
  address: {
    fullName: "Test User",
    phone: "+919876543210",
    email: "test@example.com",
    addressLine1: "123 Test Street",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110001",
    country: "India"
  },
  payment: {
    mode: "COD",
    method: "cash"
  },
  couponCode: null,
  redeemedCoins: 0,
  idempotencyKey: "test-" + Date.now()
};

console.log("Test Order Payload:");
console.log(JSON.stringify(testOrder, null, 2));
console.log("\nTo test, send POST request to: http://localhost:3002/api/orders");
console.log("With the above payload and Authorization header with valid session token");
