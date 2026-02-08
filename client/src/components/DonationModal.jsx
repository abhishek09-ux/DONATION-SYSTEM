import { useState } from 'react';
import { FiX, FiHeart, FiCheck } from 'react-icons/fi';
import { paymentAPI, donationAPI } from '../services/api';
import toast from 'react-hot-toast';
import ImpactCalculator from './ImpactCalculator';
import Confetti, { useConfetti } from './Confetti';

const DonationModal = ({ charity, isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showConfetti, triggerConfetti, handleComplete } = useConfetti();

  const presetAmounts = [100, 500, 1000, 2500, 5000, 10000];

  if (!isOpen) return null;

  const selectedAmount = amount === 'custom' ? customAmount : amount;

  const handleDonate = async () => {
    const donationAmount = parseInt(selectedAmount);
    
    if (!donationAmount || donationAmount < (charity.minimumDonation || 100)) {
      toast.error(`Minimum donation is ₹${charity.minimumDonation || 100}`);
      return;
    }

    setLoading(true);

    try {
      // Create donation and get Razorpay order
      const response = await paymentAPI.quickDonate({
        charityId: charity._id,
        amount: donationAmount,
        isAnonymous,
        message
      });

      const { donation, payment } = response.data.data;

      // Initialize Razorpay
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: 'DonateMatch',
        description: `Donation to ${charity.organizationName}`,
        order_id: payment.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId: donation.id
            });

            toast.success('Donation successful! Thank you for your generosity.');
            triggerConfetti(); // Launch confetti!
            onSuccess?.();
            setTimeout(() => onClose(), 2000); // Delay close to show confetti
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.response?.data?.message || 'Failed to process donation');
      setLoading(false);
    }
  };

  return (
    <>
      <Confetti active={showConfetti} onComplete={handleComplete} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <FiHeart className="text-primary-600 dark:text-primary-400 text-xl heart-beat" />
              </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Make a Donation</h2>
              <p className="text-sm text-gray-500">{charity.organizationName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="label">Select Amount (₹)</label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount('');
                  }}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    amount === preset
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ₹{preset.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                }}
                className="input-field pl-8"
                min={charity.minimumDonation || 100}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Minimum donation: ₹{charity.minimumDonation || 100}
            </p>
          </div>

          {/* Impact Calculator */}
          {parseInt(selectedAmount) > 0 && (
            <ImpactCalculator 
              amount={parseInt(selectedAmount)} 
              cause={charity.causes?.[0] || 'default'}
            />
          )}

          {/* Message */}
          <div>
            <label className="label">Add a message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message of support..."
              className="input-field resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                isAnonymous 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : 'border-gray-300'
              }`}
            >
              {isAnonymous && <FiCheck size={14} />}
            </button>
            <label className="text-sm text-gray-700 cursor-pointer" onClick={() => setIsAnonymous(!isAnonymous)}>
              Donate anonymously
            </label>
          </div>

          {/* 80G Notice */}
          {charity.is80GRegistered && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>Tax Benefits:</strong> This organization is 80G certified. 
                You can claim tax deductions for this donation.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <button
            onClick={handleDonate}
            disabled={loading || !selectedAmount}
            className="btn-primary w-full py-3 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed btn-hover-lift"
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <>
                <FiHeart className="mr-2" />
                Donate {selectedAmount ? `₹${parseInt(selectedAmount).toLocaleString()}` : ''}
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-400 mt-3">
            Secured by Razorpay. 100% secure payment.
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default DonationModal;
