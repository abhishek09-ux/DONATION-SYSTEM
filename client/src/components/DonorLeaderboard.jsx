import { useState, useEffect } from 'react';
import { FiAward, FiTrendingUp, FiHeart, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { donationAPI } from '../services/api';

const rankBadges = {
  1: { emoji: '🥇', color: 'from-yellow-400 to-amber-500', label: 'Gold' },
  2: { emoji: '🥈', color: 'from-gray-300 to-gray-400', label: 'Silver' },
  3: { emoji: '🥉', color: 'from-amber-600 to-amber-700', label: 'Bronze' },
};

const DonorLeaderboard = ({ limit = 10, period = 'all', className = '' }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedPeriod]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // This would be an API call in production
      // const response = await donationAPI.getLeaderboard({ period: selectedPeriod, limit });
      // setLeaders(response.data.data);
      
      // Mock data for demonstration
      const mockLeaders = [
        { rank: 1, name: 'Rajesh Kumar', amount: 250000, donations: 15, anonymous: false },
        { rank: 2, name: 'Priya Sharma', amount: 180000, donations: 12, anonymous: false },
        { rank: 3, name: 'Anonymous', amount: 150000, donations: 8, anonymous: true },
        { rank: 4, name: 'Amit Patel', amount: 120000, donations: 20, anonymous: false },
        { rank: 5, name: 'Sunita Reddy', amount: 100000, donations: 18, anonymous: false },
        { rank: 6, name: 'Anonymous', amount: 85000, donations: 5, anonymous: true },
        { rank: 7, name: 'Vikram Singh', amount: 75000, donations: 10, anonymous: false },
        { rank: 8, name: 'Meera Nair', amount: 65000, donations: 8, anonymous: false },
        { rank: 9, name: 'Karthik Iyer', amount: 55000, donations: 6, anonymous: false },
        { rank: 10, name: 'Ananya Das', amount: 50000, donations: 12, anonymous: false },
      ];
      setLeaders(mockLeaders.slice(0, limit));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  const formatAmount = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiAward size={28} />
            <div>
              <h2 className="text-xl font-bold">Top Donors</h2>
              <p className="text-primary-200 text-sm">Celebrating generosity</p>
            </div>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/20 border-0 rounded-lg text-sm text-white py-2 px-3 focus:ring-2 focus:ring-white/50"
          >
            {periodOptions.map(({ value, label }) => (
              <option key={value} value={value} className="text-gray-900">{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y dark:divide-slate-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto" />
          </div>
        ) : (
          leaders.map((donor, index) => {
            const badge = rankBadges[donor.rank];
            const isTopThree = donor.rank <= 3;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                  isTopThree ? 'bg-gradient-to-r from-transparent to-yellow-50/50 dark:to-yellow-900/10' : ''
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center">
                  {badge ? (
                    <span className="text-2xl">{badge.emoji}</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">#{donor.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  badge 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : 'bg-gray-400 dark:bg-slate-600'
                }`}>
                  {donor.anonymous ? '?' : getInitials(donor.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    donor.anonymous ? 'text-gray-500 dark:text-gray-400 italic' : 'text-gray-900 dark:text-white'
                  }`}>
                    {donor.name}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiHeart size={12} />
                      {donor.donations} donations
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`font-bold ${
                    isTopThree 
                      ? 'text-lg text-primary-600 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatAmount(donor.amount)}
                  </p>
                  {isTopThree && (
                    <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
                      <FiTrendingUp size={10} />
                      Top {donor.rank}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 dark:bg-slate-900/50 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Every donation counts! Start your giving journey today. 💙
        </p>
      </div>
    </div>
  );
};

// Mini leaderboard for sidebar/widgets
export const MiniLeaderboard = ({ limit = 5 }) => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Mock data - replace with API call
    setLeaders([
      { name: 'Rajesh K.', amount: 250000 },
      { name: 'Priya S.', amount: 180000 },
      { name: 'Anonymous', amount: 150000 },
      { name: 'Amit P.', amount: 120000 },
      { name: 'Sunita R.', amount: 100000 },
    ].slice(0, limit));
  }, [limit]);

  const formatAmount = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-3">
      {leaders.map((donor, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            index < 3 
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' 
              : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
          }`}>
            {index + 1}
          </div>
          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
            {donor.name}
          </span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {formatAmount(donor.amount)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DonorLeaderboard;
