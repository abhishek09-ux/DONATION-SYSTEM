import { useState } from 'react';
import { FiCalendar, FiRefreshCw, FiCheck, FiCreditCard, FiPause, FiPlay, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ImpactCalculator from './ImpactCalculator';

// Recurring donation setup component
export const RecurringDonationSetup = ({ 
  charity, 
  onSubmit, 
  initialAmount = 500,
  className = '' 
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const frequencies = [
    { value: 'weekly', label: 'Weekly', multiplier: 52 },
    { value: 'monthly', label: 'Monthly', multiplier: 12 },
    { value: 'quarterly', label: 'Quarterly', multiplier: 4 },
    { value: 'yearly', label: 'Yearly', multiplier: 1 },
  ];

  const presetAmounts = [500, 1000, 2000, 5000];

  const selectedFrequency = frequencies.find(f => f.value === frequency);
  const yearlyImpact = amount * (selectedFrequency?.multiplier || 12);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.({ amount, frequency, startDate });
      toast.success('Recurring donation set up successfully!');
    } catch (error) {
      toast.error('Failed to set up recurring donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <FiRefreshCw size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Set Up Monthly Giving</h2>
            <p className="text-secondary-100 text-sm">Make a lasting impact with regular donations</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="label">Donation Amount (₹)</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`py-3 rounded-lg border-2 font-medium transition-all ${
                  amount === preset
                    ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                }`}
              >
                ₹{preset.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input-field"
            min={100}
            placeholder="Custom amount"
          />
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="label">Donation Frequency</label>
          <div className="grid grid-cols-2 gap-3">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => setFrequency(freq.value)}
                className={`py-3 px-4 rounded-lg border-2 text-left transition-all ${
                  frequency === freq.value
                    ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                }`}
              >
                <span className={`font-medium ${
                  frequency === freq.value 
                    ? 'text-secondary-600 dark:text-secondary-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {freq.label}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {freq.multiplier}x per year
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="label">Start Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Impact Preview */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Your Yearly Impact
          </h4>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
            ₹{yearlyImpact.toLocaleString()}/year
          </p>
          <p className="text-sm text-green-600 dark:text-green-500">
            {selectedFrequency?.multiplier} donations × ₹{amount.toLocaleString()}
          </p>
        </div>

        {/* Impact Calculator */}
        {amount > 0 && (
          <ImpactCalculator 
            amount={yearlyImpact} 
            cause={charity?.causes?.[0] || 'default'}
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || amount < 100}
          className="btn-secondary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 btn-hover-lift"
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <FiRefreshCw />
              Start {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Giving
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          You can pause or cancel anytime. Payments are processed securely.
        </p>
      </form>
    </div>
  );
};

// Active recurring donations list
export const RecurringDonationsList = ({ donations = [], onPause, onResume, onCancel, onEdit }) => {
  if (donations.length === 0) {
    return (
      <div className="text-center py-8">
        <FiRefreshCw className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No recurring donations yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Set up monthly giving to make a lasting impact
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div
          key={donation._id}
          className={`bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4 ${
            donation.status === 'paused' ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                donation.status === 'active' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
              }`}>
                <FiRefreshCw />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {donation.charity?.organizationName || 'Charity'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{donation.amount?.toLocaleString()} / {donation.frequency}
                </p>
              </div>
            </div>

            <span className={`text-xs px-2 py-1 rounded-full ${
              donation.status === 'active'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
            }`}>
              {donation.status === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total donated: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{donation.totalDonated?.toLocaleString() || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Next: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(donation.nextDate).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t dark:border-slate-700">
            {donation.status === 'active' ? (
              <button
                onClick={() => onPause?.(donation._id)}
                className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FiPause size={14} />
                Pause
              </button>
            ) : (
              <button
                onClick={() => onResume?.(donation._id)}
                className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FiPlay size={14} />
                Resume
              </button>
            )}
            <button
              onClick={() => onEdit?.(donation)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FiEdit2 size={14} />
              Edit
            </button>
            <button
              onClick={() => onCancel?.(donation._id)}
              className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FiTrash2 size={14} />
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Small badge showing recurring donor status
export const RecurringBadge = ({ frequency = 'monthly' }) => {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 px-2 py-1 rounded-full">
      <FiRefreshCw size={10} />
      {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Donor
    </span>
  );
};

export default {
  RecurringDonationSetup,
  RecurringDonationsList,
  RecurringBadge
};
