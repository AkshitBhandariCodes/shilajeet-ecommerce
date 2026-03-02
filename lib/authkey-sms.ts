/**
 * AuthKey.io SMS OTP Service
 * Handles sending OTP via SMS and verifying OTP
 */

interface SendOTPResponse {
  success: boolean;
  logId?: string;
  otp?: string;
  message: string;
  error?: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

class AuthKeySMSService {
  private authKey: string;
  private baseUrl: string = 'https://console.authkey.io';
  private templateId: string; // OTP template ID from AuthKey.io

  constructor() {
    this.authKey = process.env.AUTHKEY_API_KEY || '';
    this.templateId = process.env.AUTHKEY_OTP_TEMPLATE_ID || '';

    if (!this.authKey) {
      console.warn('AUTHKEY_API_KEY is not set');
    }
    if (!this.templateId) {
      console.warn('AUTHKEY_OTP_TEMPLATE_ID is not set');
    }
  }

  /**
   * Generate random OTP
   */
  private generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits.charAt(Math.floor(Math.random() * 10));
    }
    return otp;
  }

  /**
   * Send OTP to phone number
   * Uses AuthKey.io POST SMS API with manual OTP
   * Template: "Use {#otp#} as your OTP to access your {#company#}, OTP is confidential and valid for 5 mins This sms sent by authkey.io"
   * We generate the OTP on backend and pass it to AuthKey.io
   */
  async sendOTP(phoneNumber: string, countryCode: string = '91', company: string = 'Agnishila'): Promise<SendOTPResponse> {
    try {
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 10) {
        return {
          success: false,
          message: 'Invalid phone number',
          error: 'Phone number must be at least 10 digits',
        };
      }

      // Remove any non-digit characters
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      // Generate OTP on backend
      const otp = this.generateOTP(6);
      console.log('Generated OTP:', otp);

      // Use the POST SMS API endpoint with manual OTP
      // This endpoint supports custom template variables like {#otp#} and {#company#}
      const payload = {
        country_code: countryCode,
        mobile: cleanPhone,
        sid: this.templateId,
        otp: otp, // Pass the generated OTP
        company: company, // Will replace {#company#} in template
      };

      console.log('Sending OTP to:', cleanPhone);
      console.log('Using template ID:', this.templateId);
      console.log('OTP:', otp);
      console.log('Company:', company);
      console.log('Payload:', payload);

      const response = await fetch(`${this.baseUrl}/restapi/requestjson.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.authKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('AuthKey.io API error:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return {
          success: false,
          message: 'Failed to send OTP',
          error: `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      console.log('AuthKey.io response:', data);

      // AuthKey.io returns LogID for OTP verification
      if (data.LogID) {
        return {
          success: true,
          logId: data.LogID,
          message: 'OTP sent successfully',
          otp: otp, // Return OTP for storage in database
        };
      }

      return {
        success: false,
        message: data.Message || 'Failed to send OTP',
        error: data.Message,
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Error sending OTP',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify OTP entered by user
   * Uses AuthKey.io 2FA verification API
   */
  async verifyOTP(otp: string, logId: string): Promise<VerifyOTPResponse> {
    try {
      // Validate OTP
      if (!otp || otp.length < 4) {
        return {
          success: false,
          message: 'Invalid OTP',
          error: 'OTP must be at least 4 digits',
        };
      }

      if (!logId) {
        return {
          success: false,
          message: 'Invalid session',
          error: 'LogID is missing',
        };
      }

      // Verify OTP using AuthKey.io 2FA verification API
      const url = `${this.baseUrl}/api/2fa_verify.php?authkey=${this.authKey}&channel=SMS&otp=${otp}&logid=${logId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Failed to verify OTP',
          error: `HTTP ${response.status}`,
        };
      }

      const data = await response.json();

      // AuthKey.io returns status: true for valid OTP
      if (data.status === true) {
        return {
          success: true,
          message: 'OTP verified successfully',
        };
      }

      return {
        success: false,
        message: data.message || 'Invalid OTP',
        error: data.message,
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Error verifying OTP',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

}

export default new AuthKeySMSService();
