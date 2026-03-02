'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Mail, Phone } from 'lucide-react';

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressFormProps {
  onComplete: (address: Address) => void;
}

export default function AddressForm({ onComplete }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Partial<Address>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof Address]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Address> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'PIN code is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Indian format)
    const phoneRegex = /^(\+91[\s\-]?)?[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Indian phone number';
    }

    // PIN code validation (Indian format - 6 digits)
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    if (formData.zipCode && !pinCodeRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onComplete(formData);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-jet-900 border border-white/20 p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary-400/30"></div>

      <div className="flex items-center space-x-3 mb-8">
        <MapPin className="w-6 h-6 text-primary-400" />
        <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
          Shipping Address
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              <User className="w-4 h-4 inline mr-2" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.firstName ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.lastName ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.email ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.phone ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
            Street Address *
          </label>
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            className={`w-full bg-black border ${errors.address1 ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
            placeholder="Enter your street address"
          />
          {errors.address1 && (
            <p className="text-red-400 text-xs mt-1">{errors.address1}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.city ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-400 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.state ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="Enter state"
            />
            {errors.state && (
              <p className="text-red-400 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
              PIN Code *
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full bg-black border ${errors.zipCode ? 'border-red-400' : 'border-white/20'} text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors`}
              placeholder="Enter PIN code"
              maxLength={6}
              pattern="[0-9]{6}"
            />
            {errors.zipCode && (
              <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-primary-400 focus:outline-none transition-colors"
          >
            <option value="India">India</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-400 text-black py-4 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving Address...' : 'Continue to Payment'}
        </button>
      </form>
    </motion.div>
  );
}