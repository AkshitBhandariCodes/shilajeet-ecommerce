/**
 * Razorpay Checkout Handler
 * Handles payment processing for online orders
 */

interface RazorpayCheckoutOptions {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
}

export async function initiateRazorpayCheckout({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}: RazorpayCheckoutOptions) {
  try {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Agnishila',
        description: `Order ${orderId}`,
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#d4af37', // Gold color
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              onSuccess(verifyData);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            onError(error);
          }
        },
        modal: {
          ondismiss: () => {
            onError(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    };

    script.onerror = () => {
      onError(new Error('Failed to load Razorpay script'));
    };

    document.body.appendChild(script);
  } catch (error) {
    onError(error);
  }
}

export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        orderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}
