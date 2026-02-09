import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';

const GiftCardsPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState('select'); // select, customize, payment, success
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('hearts');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [giftCard, setGiftCard] = useState(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemResult, setRedeemResult] = useState(null);

  const amounts = [500, 1000, 2000, 5000, 10000];
  
  const designs = [
    { id: 'hearts', name: 'Hearts', emoji: '❤️', color: 'from-pink-500 to-red-500' },
    { id: 'celebration', name: 'Celebration', emoji: '🎉', color: 'from-yellow-500 to-orange-500' },
    { id: 'nature', name: 'Nature', emoji: '🌿', color: 'from-green-500 to-teal-500' },
    { id: 'stars', name: 'Stars', emoji: '⭐', color: 'from-blue-500 to-purple-500' },
    { id: 'flowers', name: 'Flowers', emoji: '🌸', color: 'from-pink-400 to-purple-400' },
    { id: 'earth', name: 'Earth', emoji: '🌍', color: 'from-cyan-500 to-blue-500' }
  ];

  const selectedDesignData = designs.find(d => d.id === selectedDesign);
  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handlePurchase = async () => {
    if (!recipientEmail || !recipientName) {
      toast.error('Please fill in recipient details');
      return;
    }

    if (finalAmount < 100) {
      toast.error('Minimum gift card amount is ₹100');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/giftcards/purchase', {
        amount: finalAmount,
        recipientEmail,
        recipientName,
        senderName,
        message,
        design: selectedDesign,
        deliveryDate: deliveryDate || new Date().toISOString()
      });

      setGiftCard(response.data.giftCard);
      setStep('success');
      toast.success('Gift card purchased successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to purchase gift card');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckBalance = async () => {
    if (!redeemCode.trim()) {
      toast.error('Please enter a gift card code');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/giftcards/check/${redeemCode.trim()}`);
      setRedeemResult(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid gift card code');
      setRedeemResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎁 Donation Gift Cards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Give the gift of giving. Let your loved ones choose a charity that matters to them.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gift Card Creation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Buy a Gift Card
            </h2>

            {step === 'select' && (
              <div className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {amounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          selectedAmount === amount && !customAmount
                            ? 'bg-primary-600 text-white scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="number"
                      placeholder="Or enter custom amount (min ₹100)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="100"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Design Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Choose Design
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {designs.map((design) => (
                      <button
                        key={design.id}
                        onClick={() => setSelectedDesign(design.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          selectedDesign === design.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{design.emoji}</span>
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{design.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('customize')}
                  className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 'customize' && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep('select')}
                  className="text-sm text-primary-600 hover:text-primary-700 mb-4"
                >
                  ← Back to amount
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Who is this gift for?"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@email.com"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Personal Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message (optional)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={loading || !recipientName || !recipientEmail}
                  className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Purchase Gift Card - ₹{finalAmount.toLocaleString()}</>
                  )}
                </button>
              </div>
            )}

            {step === 'success' && giftCard && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gift Card Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your gift card has been emailed to {recipientEmail}
                </p>
                <div className={`bg-gradient-to-r ${selectedDesignData.color} rounded-xl p-6 text-white mb-6`}>
                  <p className="text-sm opacity-80 mb-2">Gift Card Code</p>
                  <p className="text-2xl font-mono font-bold">{giftCard.code}</p>
                  <p className="text-3xl font-bold mt-4">₹{finalAmount.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => {
                    setStep('select');
                    setRecipientName('');
                    setRecipientEmail('');
                    setMessage('');
                    setGiftCard(null);
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Buy Another Gift Card
                </button>
              </div>
            )}
          </div>

          {/* Preview & Redeem Section */}
          <div className="space-y-6">
            {/* Card Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
              <div className={`bg-gradient-to-r ${selectedDesignData?.color || 'from-primary-500 to-secondary-500'} rounded-2xl p-6 text-white aspect-[1.6/1] flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80">Donation Gift Card</p>
                    <p className="text-4xl font-bold mt-2">₹{finalAmount.toLocaleString()}</p>
                  </div>
                  <span className="text-4xl">{selectedDesignData?.emoji}</span>
                </div>
                <div>
                  {recipientName && (
                    <p className="text-sm">For: {recipientName}</p>
                  )}
                  {senderName && (
                    <p className="text-sm opacity-80">From: {senderName}</p>
                  )}
                  {message && (
                    <p className="text-xs mt-2 italic opacity-80">"{message}"</p>
                  )}
                </div>
              </div>
            </div>

            {/* Redeem Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Have a Gift Card?
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="Enter gift card code"
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                />
                <button
                  onClick={handleCheckBalance}
                  disabled={loading}
                  className="px-6 py-3 bg-secondary-600 text-white font-semibold rounded-xl hover:bg-secondary-700 transition-colors disabled:opacity-50"
                >
                  Check
                </button>
              </div>
              
              {redeemResult && (
                <div className={`mt-4 p-4 rounded-xl ${
                  redeemResult.status === 'active' 
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                    : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{redeemResult.balance?.toLocaleString() || redeemResult.amount?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      redeemResult.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      {redeemResult.status}
                    </span>
                  </div>
                  {redeemResult.status === 'active' && (
                    <a
                      href="/charities"
                      className="mt-4 block text-center w-full py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Use Gift Card Now
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Why Gift Cards?
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: '🎯', text: 'Let them choose their favorite cause' },
                  { icon: '📧', text: 'Instant email delivery' },
                  { icon: '⏰', text: 'Schedule for birthdays & occasions' },
                  { icon: '💝', text: 'Personalized message included' },
                  { icon: '🔒', text: 'Never expires' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsPage;
