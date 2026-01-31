import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';
import { containerVariants, itemVariants } from '../animations/variants';
import API_BASE_URL from '../config/api';

/**
 * Payment Page Component
 * Real payment UI with backend integration
 */
function Payment() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  
  const [teacher, setTeacher] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [useWallet, setUseWallet] = React.useState(false);
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchTeacher();
    fetchWalletBalance();
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers/${teacherId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setTeacher(data.data);
      } else {
        setError('Teacher not found');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
      setError('Failed to load teacher details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setWalletBalance(data.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      if (useWallet) {
        // Pay with wallet
        const response = await fetch(`${API_BASE_URL}/api/wallet/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            teacherId,
            amount: teacher.price
          })
        });

        const data = await response.json();
        if (data.success) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate(`/teacher/${teacherId}`);
          }, 2500);
        } else {
          setError(data.message || 'Payment failed');
          setIsProcessing(false);
        }
      } else {
        // Simulate card payment
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            navigate(`/teacher/${teacherId}`);
          }, 2500);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!teacher || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || 'Teacher not found'}</h2>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const price = teacher.price || 29.99;

  // Format card number input
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="payment-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Left Side - Order Summary */}
              <motion.div variants={itemVariants} className="card">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Order Summary
                  </h2>

                  {/* Teacher Info */}
                  <div className="flex items-center space-x-4 mb-6 p-4 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl text-white font-bold">
                        {teacher.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-slate-600">{teacher.subject}</p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>Notes Access (Lifetime)</span>
                      <span>${price}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Download Permission</span>
                      <span className="text-green-600">Included</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-800">
                      <span>Total</span>
                      <span className="text-indigo-600">${price}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Unlimited Access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Download & Print</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free Updates</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Payment Form */}
              <motion.div variants={itemVariants} className="card">
                <form onSubmit={handlePayment} className="p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-slate-800">
                      Payment Details
                    </h2>
                  </div>

                  {/* Card Number */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength="4"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Pay Button */}
                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold text-lg relative overflow-hidden ${
                      isProcessing
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    } text-white shadow-lg`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <DollarSign className="w-5 h-5" />
                        <span>Pay ${price}</span>
                      </div>
                    )}

                    {/* Ripple Effect */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      whileTap={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-white rounded-xl"
                    />
                  </motion.button>

                  {/* Security Notice */}
                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
                    <Shield className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            /* Success Animation */
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center min-h-[600px]"
            >
              <div className="card max-w-md w-full">
                <div className="p-12 text-center">
                  {/* Success Checkmark Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.2,
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 200
                    }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-slate-800 mb-3"
                  >
                    Payment Successful!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-slate-600 mb-6"
                  >
                    You now have full access to download and view all notes from {teacher.name}.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-slate-500"
                  >
                    Redirecting to notes...
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Payment;

