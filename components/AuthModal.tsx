'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight, Shield, Zap, Loader, CheckCircle, AlertCircle, Mail, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
  onSignupComplete?: (couponCode: string) => void;
}

type AuthStep = 'phone' | 'otp' | 'signup-details' | 'success';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess, onSignupComplete }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [logId, setLogId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  // Signup details
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Timer for OTP expiry
  useEffect(() => {
    if (otpExpiry > 0) {
      const timer = setTimeout(() => setOtpExpiry(otpExpiry - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpExpiry]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      if (cleanPhone.length < 10) {
        setError('Please enter a valid 10-digit phone number');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: cleanPhone,
          countryCode: '91',
          purpose: mode === 'signin' ? 'signin' : 'signup',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        setIsLoading(false);
        return;
      }

      setLogId(data.logId);
      setOtpExpiry(600); // 10 minutes
      setSuccess('OTP sent successfully! Check your phone.');
      setStep('otp');
    } catch (err) {
      setError('Error sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (otp.length < 4) {
        setError('Please enter a valid OTP');
        setIsLoading(false);
        return;
      }

      // For signup, show details form first
      if (mode === 'signup') {
        setStep('signup-details');
        setIsLoading(false);
        return;
      }

      // For signin, verify OTP directly
      const payload = {
        otp,
        logId,
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        purpose: 'signin',
      };

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid OTP');
        setAttemptsRemaining(data.attemptsRemaining || 0);
        setIsLoading(false);
        return;
      }

      // Sign in with NextAuth using phone-otp provider
      const signInResult = await signIn('phone-otp', {
        phone: phoneNumber.replace(/\D/g, ''),
        userId: data.user.id,
        redirect: false,
      });

      if (!signInResult?.ok) {
        setError('Failed to create session');
        setIsLoading(false);
        return;
      }

      setSuccess('OTP verified successfully!');
      setStep('success');

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate signup details
      if (!signupData.firstName.trim()) {
        setError('Please enter your first name');
        setIsLoading(false);
        return;
      }
      if (!signupData.lastName.trim()) {
        setError('Please enter your last name');
        setIsLoading(false);
        return;
      }
      if (!signupData.email.trim()) {
        setError('Please enter your email');
        setIsLoading(false);
        return;
      }

      // Verify email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signupData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Now verify OTP with signup details
      const payload = {
        otp,
        logId,
        phoneNumber: phoneNumber.replace(/\D/g, ''),
        purpose: 'signup',
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
      };

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      // Sign in with NextAuth using phone-otp provider
      const signInResult = await signIn('phone-otp', {
        phone: phoneNumber.replace(/\D/g, ''),
        userId: data.user.id,
        redirect: false,
      });

      if (!signInResult?.ok) {
        setError('Failed to create session');
        setIsLoading(false);
        return;
      }

      setSuccess('Account created successfully!');
      setStep('success');

      // Call onSignupComplete with coupon code
      if (onSignupComplete && data.user.signupDiscountCode) {
        setTimeout(() => {
          onSignupComplete(data.user.signupDiscountCode);
        }, 1500);
      }

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError('Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setError('');
    setSuccess('');
    await handleSendOTP(new Event('submit') as any);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setStep('phone');
    setError('');
    setSuccess('');
    setPhoneNumber('');
    setOtp('');
    setLogId('');
    setSignupData({ firstName: '', lastName: '', email: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5 
              }}
              className="relative w-full max-w-4xl bg-jet-900 border border-white/20 overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sharp corner accents */}
              <div className="absolute top-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-t-[30px] border-t-primary-400/30"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-primary-400/30"></div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 text-white/60 hover:text-white z-10 p-2 bg-black/20 backdrop-blur-sm border border-white/10"
              >
                <X size={20} />
              </motion.button>

              <div className="grid lg:grid-cols-2 min-h-screen lg:min-h-[600px]">
                {/* Left Side - Branding (Hidden on mobile) */}
                <div className="hidden lg:flex relative bg-gradient-to-br from-black to-jet-800 p-12 flex-col justify-center overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '50px 50px'
                    }} />
                  </div>

                  {/* Animated Elements */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-20 left-20 w-1 h-16 bg-gradient-to-b from-primary-400/50 to-transparent"
                  />
                  <motion.div
                    animate={{
                      x: [0, 10, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute bottom-20 right-20 w-16 h-1 bg-gradient-to-r from-primary-400/50 to-transparent"
                  />

                  <div className="relative z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="mb-8"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img 
                            src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090440/agnishila/logo/WhatsApp_Image_2025-11-01_at_11.59.11_e8d2c796-removebg-preview.png' 
                            alt="Agnishila Logo" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <img 
                            src='https://res.cloudinary.com/dsejv31js/image/upload/v1767090439/agnishila/logo/name.png' 
                            alt="Agnishila" 
                            className="h-6 object-contain mb-1"
                          />
                          <div className="text-xs text-primary-400 uppercase tracking-[0.2em]">Ignite the fire within</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                    >
                      {mode === 'signin' ? 'WELCOME' : 'JOIN THE'}
                      <span className="block text-primary-400">
                        {mode === 'signin' ? 'BACK' : 'AGNISHILA'}
                      </span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="text-gray-300 text-lg mb-8 font-light leading-relaxed"
                    >
                      {mode === 'signin' 
                        ? 'Access your Agnishila account and continue your wellness journey with premium Himalayan Shilajit.'
                        : 'Join thousands of high-performance individuals who trust Agnishila for their premium wellness needs.'
                      }
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="grid grid-cols-2 gap-6"
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <Shield className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Secure Access</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <Zap className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Premium Benefits</div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-jet-950 w-full">
                  <motion.div
                    key={mode + step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 uppercase tracking-wider flex items-center space-x-2">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 flex-shrink-0" />
                        <span>
                          {step === 'phone' && (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                          {step === 'otp' && 'Verify OTP'}
                          {step === 'signup-details' && 'Complete Profile'}
                          {step === 'success' && 'Welcome!'}
                        </span>
                      </h3>
                      <p className="text-gray-400 font-light text-sm sm:text-base">
                        {step === 'phone' && 'Enter your phone number to continue'}
                        {step === 'otp' && 'Enter the OTP sent to your phone'}
                        {step === 'signup-details' && 'Tell us about yourself'}
                        {step === 'success' && 'Account created successfully!'}
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm flex items-start space-x-2"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm flex items-start space-x-2"
                      >
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{success}</span>
                      </motion.div>
                    )}

                    <form onSubmit={step === 'signup-details' ? handleSignupDetails : (step === 'otp' ? handleVerifyOTP : handleSendOTP)} className="space-y-6">
                      {/* Phone Step */}
                      {step === 'phone' && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                            Phone Number
                          </label>
                          <div className="flex items-center space-x-2 bg-black/50 border border-white/10 rounded px-4 py-3 focus-within:border-primary-400 transition-colors">
                            <span className="text-gray-400 font-medium">+91</span>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 10-digit phone number"
                              className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
                              maxLength={10}
                              required
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* OTP Step */}
                      {step === 'otp' && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                              Enter OTP
                            </label>
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 4-6 digit OTP"
                              className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none placeholder-gray-500 focus:border-primary-400 transition-colors text-center text-2xl tracking-widest"
                              maxLength={6}
                              required
                            />
                          </div>

                          {/* Timer */}
                          <div className="text-center text-sm text-gray-400">
                            OTP expires in: <span className="text-primary-400 font-bold">{formatTime(otpExpiry)}</span>
                          </div>

                          {/* Attempts */}
                          {attemptsRemaining < 5 && (
                            <div className="text-center text-sm text-yellow-400">
                              Attempts remaining: {attemptsRemaining}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Signup Details Step */}
                      {step === 'signup-details' && mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                                First Name
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                  type="text"
                                  value={signupData.firstName}
                                  onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 transition-all duration-300"
                                  placeholder="John"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                                Last Name
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                  type="text"
                                  value={signupData.lastName}
                                  onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 transition-all duration-300"
                                  placeholder="Doe"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2 uppercase tracking-wider">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="email"
                                value={signupData.email}
                                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 transition-all duration-300"
                                placeholder="your.email@company.com"
                                required
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Success Step */}
                      {step === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center space-y-4 py-8"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                          </motion.div>
                          <p className="text-gray-300">
                            {mode === 'signin' ? 'Signed in successfully!' : 'Account created successfully!'}
                          </p>
                          <p className="text-sm text-gray-400">Redirecting...</p>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      {step !== 'success' && (
                        <div className="space-y-4 pt-4">
                          {step === 'phone' && (
                            <motion.button
                              type="submit"
                              disabled={isLoading || phoneNumber.length < 10}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-primary-400 text-black font-bold py-3 px-4 rounded uppercase tracking-wider text-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  <span>Sending OTP...</span>
                                </>
                              ) : (
                                <>
                                  <span>Send OTP</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </motion.button>
                          )}

                          {step === 'otp' && (
                            <motion.button
                              type="submit"
                              disabled={isLoading || otp.length < 4}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-primary-400 text-black font-bold py-3 px-4 rounded uppercase tracking-wider text-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  <span>Verifying...</span>
                                </>
                              ) : (
                                <>
                                  <span>Verify OTP</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </motion.button>
                          )}

                          {step === 'signup-details' && (
                            <motion.button
                              type="submit"
                              disabled={isLoading || !signupData.firstName.trim() || !signupData.lastName.trim() || !signupData.email.trim()}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-primary-400 text-black font-bold py-3 px-4 rounded uppercase tracking-wider text-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  <span>Creating Account...</span>
                                </>
                              ) : (
                                <>
                                  <span>Create Account</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </motion.button>
                          )}

                          {step === 'signup-details' && (
                            <motion.button
                              type="button"
                              onClick={() => {
                                setStep('otp');
                                setError('');
                                setSuccess('');
                              }}
                              className="w-full text-primary-400 hover:text-primary-500 font-medium text-sm py-2"
                            >
                              Back to OTP
                            </motion.button>
                          )}

                          {/* Resend OTP */}
                          {step === 'otp' && (
                            <div className="text-center text-sm text-gray-400">
                              Didn't receive OTP?{' '}
                              <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isLoading}
                                className="text-primary-400 hover:text-primary-500 font-medium disabled:opacity-50"
                              >
                                Resend
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Switch Mode */}
                      {step === 'phone' && (
                        <div className="text-center pt-6 border-t border-white/10">
                          <p className="text-gray-400 mb-4">
                            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                          </p>
                          <motion.button
                            type="button"
                            onClick={switchMode}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-primary-400 hover:text-primary-300 font-bold uppercase tracking-wider transition-colors"
                          >
                            {mode === 'signin' ? 'Create Account' : 'Sign In'}
                          </motion.button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
