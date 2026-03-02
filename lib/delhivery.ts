import axios from 'axios';

interface DelhiveryConfig {
  clientId: string;
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
  paymentMode?: 'COD' | 'Prepaid' | 'Pickup' | 'REPL';
  codAmount?: number;
  productsDesc?: string;
  shippingMode?: 'Surface' | 'Express';
  transportSpeed?: 'F' | 'D';
  returnName?: string;
  returnAddress?: string;
  returnCity?: string;
  returnState?: string;
  returnPin?: string;
  returnPhone?: string | string[];
  returnCountry?: string;
  shipmentHeight?: number;
  shipmentWidth?: number;
  shipmentLength?: number;
  quantity?: string;
  hsn_code?: string;
  seller_inv?: string;
  fragile_shipment?: boolean;
  plastic_packaging?: boolean;
  dangerous_good?: boolean;
  ewbn?: string;
}

interface ShipmentUpdateData {
  waybill: string;
  name?: string;
  phone?: string | string[];
  paymentMode?: 'COD' | 'Prepaid';
  codAmount?: number;
  address?: string;
  productsDesc?: string;
  weight?: number;
  shipmentHeight?: number;
  shipmentWidth?: number;
  shipmentLength?: number;
}

interface ShippingCostParams {
  billingMode: 'E' | 'S';
  chargeableWeight: number;
  originPin: string;
  destinationPin: string;
  shipmentStatus: 'Delivered' | 'RTO' | 'DTO';
  paymentType: 'Pre-paid' | 'COD';
}

interface PickupRequestData {
  pickupTime: string;
  pickupDate: string;
  pickupLocation: string;
  expectedPackageCount: number;
}

class DelhiveryService {
  private config: DelhiveryConfig;

  constructor() {
    this.config = {
      clientId: process.env.DELHIVERY_CLIENT_ID || '',
      apiToken: process.env.DELHIVERY_API_TOKEN || '',
      baseUrl: process.env.DELHIVERY_ENVIRONMENT === 'production'
        ? 'https://track.delhivery.com'
        : 'https://staging-express.delhivery.com',
    };
  }

  async createShipment(orderData: ShipmentData, retryCount = 0) {
    try {
      const customerPhones = Array.isArray(orderData.customerPhone)
        ? orderData.customerPhone
        : [orderData.customerPhone];

      const returnPhones = orderData.returnPhone
        ? (Array.isArray(orderData.returnPhone) ? orderData.returnPhone : [orderData.returnPhone])
        : [];

      const shipmentPayload: any = {
        client: process.env.DELHIVERY_CLIENT_NAME || 'NK INTERNATIONAL',
        name: orderData.customerName,
        add: orderData.deliveryAddress,
        pin: orderData.deliveryPin,
        city: orderData.deliveryCity,
        state: orderData.deliveryState,
        country: 'India',
        phone: customerPhones[0] || orderData.customerPhone,
        order: orderData.orderId,
        payment_mode: orderData.paymentMode || 'Prepaid',
        return_pin: process.env.DELHIVERY_WAREHOUSE_PIN || '110035',
        return_city: process.env.DELHIVERY_WAREHOUSE_CITY || 'Delhi',
        return_phone: process.env.DELHIVERY_WAREHOUSE_PHONE || '8448893545',
        return_add: process.env.DELHIVERY_WAREHOUSE_ADDRESS || '',
        return_state: process.env.DELHIVERY_WAREHOUSE_STATE || 'Delhi',
        return_country: 'India',
        products_desc: orderData.productsDesc || 'Wellness Products',
        hsn_code: orderData.hsn_code || '30049090',
        cod_amount: orderData.codAmount || 0,
        order_date: new Date().toISOString().split('T')[0],
        total_amount: orderData.codAmount || 0,
        seller_add: process.env.DELHIVERY_WAREHOUSE_ADDRESS || '',
        seller_name: process.env.SELLER_NAME || 'NK INTERNATIONAL',
        seller_inv: orderData.seller_inv || '',
        quantity: orderData.quantity || '1',
        waybill: '',
        shipment_width: orderData.shipmentWidth || '10',
        shipment_height: orderData.shipmentHeight || '10',
        weight: orderData.weight ? String(Math.round(orderData.weight * 1000)) : '500',
        shipping_mode: orderData.shippingMode || 'Surface',
        address_type: 'home',
        transport_speed: orderData.transportSpeed || 'D',
      };

      // Remove empty values but keep 0 and false
      Object.keys(shipmentPayload).forEach(key => {
        const value = shipmentPayload[key];
        if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
          delete shipmentPayload[key];
        }
      });

      const dataPayload = {
        shipments: [shipmentPayload],
        pickup_location: {
          name: process.env.DELHIVERY_WAREHOUSE_NAME || 'Agnishila Warehouse',
        },
      };

      // Format as URL-encoded form data as per Delhivery API requirement
      const formData = new URLSearchParams();
      formData.append('format', 'json');
      formData.append('data', JSON.stringify(dataPayload));

      console.log('Creating Delhivery shipment with payload:', {
        format: 'json',
        data: dataPayload,
      });

      console.log('📤 Full Request Details:');
      console.log('URL:', `${this.config.baseUrl}/api/cmu/create.json`);
      console.log('Headers:', {
        'Authorization': `Token ${this.config.apiToken.substring(0, 10)}...`,
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      console.log('Body:', formData.toString());

      const response = await axios.post(
        `${this.config.baseUrl}/api/cmu/create.json`,
        formData,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Delhivery response:', response.data);

      // Check if shipments array exists and has items
      if (response.data.shipments && Array.isArray(response.data.shipments) && response.data.shipments.length > 0) {
        const shipment = response.data.shipments[0];
        
        // Check if waybill was generated
        if (shipment.waybill) {
          return {
            success: true,
            waybill: shipment.waybill,
            shipmentId: shipment.shipment_id,
            trackingUrl: `https://track.delhivery.com/tracking/${shipment.waybill}`,
            message: shipment.message || 'Shipment created successfully',
          };
        }
      }

      // If we get here, shipment creation failed
      const errorMsg = response.data.rmk || response.data.message || 'Unknown error';
      console.error('Shipment creation failed:', errorMsg);
      
      // Check for specific Delhivery errors
      if (errorMsg.includes('end_date')) {
        console.error('⚠️ DELHIVERY CONFIGURATION ERROR:');
        console.error('The warehouse is missing working days configuration.');
        console.error('Fix: Log in to https://one.delhivery.com');
        console.error('1. Go to Settings → Pickup Locations');
        console.error('2. Edit "Agnishila Warehouse"');
        console.error('3. Uncheck all working days, then check Monday-Saturday');
        console.error('4. Select "Evening 14:00:00 - 18:00:00" pickup slot');
        console.error('5. Save Changes');
        console.error('6. Wait 15 minutes for Delhivery to sync');
        console.error('See: DELHIVERY_FINAL_FIX_INSTRUCTIONS.md');
      }
      
      throw new Error(errorMsg);
    } catch (error: any) {
      console.error('Delhivery shipment creation error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        warehouseName: process.env.DELHIVERY_WAREHOUSE_NAME,
        environment: process.env.DELHIVERY_ENVIRONMENT,
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to create shipment with Delhivery');
    }
  }

  async updateShipment(updateData: ShipmentUpdateData) {
    try {
      const payload: any = {
        waybill: updateData.waybill,
      };

      if (updateData.name) payload.name = updateData.name;
      if (updateData.phone) payload.phone = Array.isArray(updateData.phone) ? updateData.phone : [updateData.phone];
      if (updateData.address) payload.add = updateData.address;
      if (updateData.productsDesc) payload.products_desc = updateData.productsDesc;
      if (updateData.weight) payload.weight = Math.round(updateData.weight * 1000);
      if (updateData.shipmentHeight) payload.shipment_height = updateData.shipmentHeight;
      if (updateData.shipmentWidth) payload.shipment_width = updateData.shipmentWidth;
      if (updateData.shipmentLength) payload.shipment_length = updateData.shipmentLength;

      if (updateData.paymentMode) {
        payload.pt = updateData.paymentMode;
        if (updateData.paymentMode === 'COD' && updateData.codAmount) {
          payload.cod = updateData.codAmount;
        }
      }

      console.log('Updating Delhivery shipment:', payload);

      const response = await axios.post(
        `${this.config.baseUrl}/api/p/edit`,
        payload,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: response.data.message || 'Shipment updated successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery shipment update error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update shipment');
    }
  }

  async cancelShipment(waybill: string) {
    try {
      const payload = {
        waybill: waybill,
        cancellation: 'true',
      };

      console.log('Canceling Delhivery shipment:', waybill);

      const response = await axios.post(
        `${this.config.baseUrl}/api/p/edit`,
        payload,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: response.data.message || 'Shipment cancelled successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery shipment cancellation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to cancel shipment');
    }
  }

  async trackShipment(waybill: string, orderId?: string) {
    try {
      const params: any = {
        waybill: waybill,
      };

      if (orderId) {
        params.ref_ids = orderId;
      }

      console.log('Tracking Delhivery shipment:', waybill);

      const response = await axios.get(
        `${this.config.baseUrl}/api/v1/packages/json/`,
        {
          params,
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery tracking error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to track shipment');
    }
  }

  async calculateShippingCost(params: ShippingCostParams) {
    try {
      const queryParams = {
        md: params.billingMode,
        cgm: params.chargeableWeight,
        o_pin: params.originPin,
        d_pin: params.destinationPin,
        ss: params.shipmentStatus,
        pt: params.paymentType,
      };

      console.log('Calculating Delhivery shipping cost:', queryParams);

      const response = await axios.get(
        `${this.config.baseUrl}/api/kinko/v1/invoice/charges/.json`,
        {
          params: queryParams,
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery shipping cost calculation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to calculate shipping cost');
    }
  }

  async createPickupRequest(pickupData: PickupRequestData) {
    try {
      const payload = {
        pickup_time: pickupData.pickupTime,
        pickup_date: pickupData.pickupDate,
        pickup_location: pickupData.pickupLocation,
        expected_package_count: pickupData.expectedPackageCount,
      };

      console.log('Creating Delhivery pickup request:', payload);

      const response = await axios.post(
        `${this.config.baseUrl}/fm/request/new/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: response.data.message || 'Pickup request created successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery pickup request error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create pickup request');
    }
  }

  async fetchShipmentDocument(waybill: string, docType: 'SIGNATURE_URL' | 'RVP_QC_IMAGE' | 'EPOD' | 'SELLER_RETURN_IMAGE') {
    try {
      const params = {
        doc_type: docType,
        waybill: waybill,
      };

      console.log('Fetching Delhivery shipment document:', params);

      const response = await axios.get(
        `${this.config.baseUrl}/api/rest/fetch/pkg/document/`,
        {
          params,
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery document fetch error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch document');
    }
  }

  async getExpectedTAT(originPin: string, destinationPin: string, mode: 'S' | 'E' = 'S', expectedPickupDate?: string) {
    try {
      const params: any = {
        origin_pin: originPin,
        destination_pin: destinationPin,
        mot: mode,
        pdt: 'B2C',
      };

      if (expectedPickupDate) {
        params.expected_pickup_date = expectedPickupDate;
      }

      console.log('Fetching Delhivery expected TAT:', params);

      const response = await axios.get(
        `${this.config.baseUrl}/api/dc/expected_tat`,
        {
          params,
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery TAT error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch TAT');
    }
  }

  async checkPincodeServiceability(pincode: string) {
    try {
      console.log('Checking Delhivery pincode serviceability:', pincode);

      const response = await axios.get(
        `${this.config.baseUrl}/c/api/pin-codes/json/`,
        {
          params: {
            filter_codes: pincode,
          },
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
          },
        }
      );

      return {
        success: true,
        isServiceable: response.data && response.data.length > 0,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Delhivery pincode check error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to check pincode');
    }
  }

  async registerWarehouse() {
    try {
      const payload = {
        name: process.env.DELHIVERY_WAREHOUSE_NAME || 'Agnishila_Warehouse',
        registered_name: process.env.SELLER_NAME || 'NK INTERNATIONAL',
        phone: process.env.DELHIVERY_WAREHOUSE_PHONE || '8448893545',
        email: process.env.DELHIVERY_WAREHOUSE_EMAIL || 'info@agnishila.in',
        address: process.env.DELHIVERY_WAREHOUSE_ADDRESS || '',
        city: process.env.DELHIVERY_WAREHOUSE_CITY || 'Delhi',
        pin: process.env.DELHIVERY_WAREHOUSE_PIN || '110035',
        country: process.env.DELHIVERY_WAREHOUSE_COUNTRY || 'India',
        return_address: process.env.DELHIVERY_RETURN_ADDRESS || process.env.DELHIVERY_WAREHOUSE_ADDRESS || '',
        return_pin: process.env.DELHIVERY_RETURN_PIN || process.env.DELHIVERY_WAREHOUSE_PIN || '110035',
        return_city: process.env.DELHIVERY_RETURN_CITY || process.env.DELHIVERY_WAREHOUSE_CITY || 'Delhi',
        return_state: process.env.DELHIVERY_RETURN_STATE || process.env.DELHIVERY_WAREHOUSE_STATE || 'Delhi',
        return_country: process.env.DELHIVERY_RETURN_COUNTRY || 'India',
      };

      console.log('Registering Delhivery warehouse:', payload);

      const response = await axios.post(
        `${this.config.baseUrl}/api/backend/clientwarehouse/create/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Warehouse registration response:', response.data);

      return {
        success: true,
        message: 'Warehouse registered successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Warehouse registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to register warehouse');
    }
  }

  async updateWarehouse() {
    try {
      const payload = {
        name: process.env.DELHIVERY_WAREHOUSE_NAME || 'Agnishila_Warehouse',
        phone: process.env.DELHIVERY_WAREHOUSE_PHONE || '8448893545',
        address: process.env.DELHIVERY_WAREHOUSE_ADDRESS || '',
        pin: process.env.DELHIVERY_WAREHOUSE_PIN || '110035',
      };

      console.log('Updating Delhivery warehouse:', payload);

      const response = await axios.post(
        `${this.config.baseUrl}/api/backend/clientwarehouse/edit/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Warehouse update response:', response.data);

      return {
        success: true,
        message: 'Warehouse updated successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Warehouse update error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update warehouse');
    }
  }
}

export default new DelhiveryService();
