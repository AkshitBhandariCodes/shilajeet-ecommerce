import axios from 'axios';

interface ShiprocketConfig {
  apiToken: string;
  baseUrl: string;
}

interface ShipmentData {
  orderId: string;
  customerName: string;
  customerPhone: string | string[];
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPin: string;
  weight?: number;
  paymentMode?: 'COD' | 'Prepaid';
  codAmount?: number;
  productsDesc?: string;
  quantity?: string;
}

class ShiprocketService {
  private config: ShiprocketConfig;

  constructor() {
    this.config = {
      apiToken: process.env.SHIPROCKET_API_TOKEN || '',
      baseUrl: 'https://apiv2.shiprocket.in/v1/external',
    };
  }

  async createShipment(orderData: ShipmentData) {
    try {
      const customerPhone = Array.isArray(orderData.customerPhone)
        ? orderData.customerPhone[0]
        : orderData.customerPhone;

      const shipmentPayload = {
        order_id: orderData.orderId,
        order_date: new Date().toISOString().split('T')[0],
        billing_customer_name: orderData.customerName,
        billing_last_name: '',
        billing_email: orderData.customerEmail || '',
        billing_phone: customerPhone,
        billing_address: orderData.deliveryAddress,
        billing_city: orderData.deliveryCity,
        billing_state: orderData.deliveryState,
        billing_country: 'India',
        billing_pincode: orderData.deliveryPin,
        shipping_is_billing: true,
        shipping_customer_name: orderData.customerName,
        shipping_last_name: '',
        shipping_email: orderData.customerEmail || '',
        shipping_phone: customerPhone,
        shipping_address: orderData.deliveryAddress,
        shipping_city: orderData.deliveryCity,
        shipping_state: orderData.deliveryState,
        shipping_country: 'India',
        shipping_pincode: orderData.deliveryPin,
        order_items: [
          {
            name: orderData.productsDesc || 'Product',
            sku: orderData.orderId,
            units: parseInt(orderData.quantity || '1'),
            selling_price: 0,
            discount: 0,
            tax: 0,
            hsn_code: '30049090',
          },
        ],
        payment_method: orderData.paymentMode === 'COD' ? 'COD' : 'Prepaid',
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: 0,
        length: 10,
        breadth: 10,
        height: 10,
        weight: orderData.weight || 0.5,
      };

      console.log('Creating Shiprocket shipment with payload:', shipmentPayload);

      const response = await axios.post(
        `${this.config.baseUrl}/orders/create/adhoc`,
        shipmentPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Shiprocket response:', response.data);

      if (response.data.shipment_id) {
        const shipmentId = response.data.shipment_id;
        const orderId = response.data.order_id;

        return {
          success: true,
          waybill: shipmentId.toString(),
          shipmentId: shipmentId,
          orderId: orderId,
          trackingUrl: `https://track.shiprocket.in/tracking/${shipmentId}`,
          message: 'Shipment created successfully',
        };
      } else {
        throw new Error(response.data.message || 'Failed to create shipment');
      }
    } catch (error: any) {
      console.error('Shiprocket shipment creation error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to create shipment with Shiprocket');
    }
  }

  async getPickupLocations() {
    try {
      console.log('Fetching Shiprocket pickup locations...');

      const response = await axios.get(
        `${this.config.baseUrl}/settings/company/pickup-addresses`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
          },
        }
      );

      console.log('Pickup locations:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pickup locations:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch pickup locations');
    }
  }

  async trackShipment(shipmentId: string) {
    try {
      console.log('Tracking Shiprocket shipment:', shipmentId);

      const response = await axios.get(
        `${this.config.baseUrl}/shipments/track/`,
        {
          params: {
            shipment_id: shipmentId,
          },
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Shiprocket tracking error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to track shipment');
    }
  }

  async cancelShipment(shipmentId: string) {
    try {
      console.log('Canceling Shiprocket shipment:', shipmentId);

      const response = await axios.post(
        `${this.config.baseUrl}/shipments/cancel/`,
        {
          shipment_id: shipmentId,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: response.data.message || 'Shipment cancelled successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Shiprocket cancellation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to cancel shipment');
    }
  }

  async checkPincodeServiceability(pincode: string) {
    try {
      console.log('Checking Shiprocket pincode serviceability:', pincode);

      const response = await axios.get(
        `${this.config.baseUrl}/courier/serviceability/`,
        {
          params: {
            postcode: pincode,
            weight: 0.5,
          },
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
          },
        }
      );

      return {
        success: true,
        isServiceable: response.data.data && response.data.data.length > 0,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Shiprocket pincode check error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to check pincode');
    }
  }

  async generateLabel(shipmentId: string) {
    try {
      console.log('Generating Shiprocket label:', shipmentId);

      const response = await axios.post(
        `${this.config.baseUrl}/shipments/generate/label/`,
        {
          shipment_id: [shipmentId],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Shiprocket label generation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate label');
    }
  }
}

export default new ShiprocketService();
