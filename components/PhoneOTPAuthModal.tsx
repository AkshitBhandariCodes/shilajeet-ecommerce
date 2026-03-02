'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Lock, User, Mail, ArrowRight, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PhoneOTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

type AuthStep = 'phone' | 'otp' | 'signup-details' | 'success';

export default function PhoneOTPAuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }: PhoneOTPAuthModalProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [logId, setLogId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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
        setError('Please enter a valid phone number');
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
      setOtpSent(true);
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

      setSuccess('Account created successfully!');
      setStep('success');

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-jet-900 border border-white/20 rounded-lg overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Phone className="w-6 h-6 text-primary-400" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </h2>
                </div>
                <p className="text-gray-400 text-sm">
                  {step === 'phone' && 'Enter your phone number to continue'}
                  {step === 'otp' && 'Enter the OTP sent to your phone'}
                  {step === 'signup-details' && 'Complete your profile to create account'}
                  {step === 'success' && 'Welcome to Agnishila!'}
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

              {/* Phone Step */}
              {step === 'phone' && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center space-x-2 bg-black/50 border border-white/10 rounded px-4 py-3">
                      <span className="text-gray-400">+91</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit phone number"
                        className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length < 10}
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
                  </button>

                  {/* Mode Toggle */}
                  <div className="text-center text-sm text-gray-400">
                    {mode === 'signin' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('signup');
                            setStep('phone');
                            setError('');
                            setSuccess('');
                          }}
                          className="text-primary-400 hover:text-primary-500 font-medium"
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('signin');
                            setStep('phone');
                            setError('');
                            setSuccess('');
                          }}
                          className="text-primary-400 hover:text-primary-500 font-medium"
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}

              {/* OTP Step */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-6 digit OTP"
                      className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none placeholder-gray-500 focus:border-primary-400 transition-colors text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  {/* Timer */}
                  <div className="text-center text-sm text-gray-400">
                    OTP expires in: <span className="text-primary-400 font-bold">{formatTime(otpExpiry)}</span>
                  </div>

                  {/* OTP Info */}
                  <div className="text-center text-xs text-gray-500 bg-black/50 p-2 rounded">
                    You will receive: "Use [OTP] as your OTP to access your Agnishila, OTP is confidential and valid for 5 mins This sms sent by authkey.io"
                  </div>

                  {/* Attempts */}
                  {attemptsRemaining < 5 && (
                    <div className="text-center text-sm text-yellow-400">
                      Attempts remaining: {attemptsRemaining}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 4}
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
                  </button>

                  {/* Resend OTP */}
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
                </form>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <div className="text-center space-y-4">
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
                </div>
              )}

              {/* Signup Details Step */}
              {step === 'signup-details' && (
                <form onSubmit={handleSignupDetails} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none placeholder-gray-500 focus:border-primary-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      placeholder="Enter your last name"
                      className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none placeholder-gray-500 focus:border-primary-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none placeholder-gray-500 focus:border-primary-400 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !signupData.firstName.trim() || !signupData.lastName.trim() || !signupData.email.trim()}
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
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('otp');
                      setError('');
                      setSuccess('');
                    }}
                    className="w-full text-primary-400 hover:text-primary-500 font-medium text-sm"
                  >
                    Back to OTP
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
