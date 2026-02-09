import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const CampaignsPage = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/campaigns', { params });
      setCampaigns(response.data.campaigns || response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-primary-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getDaysRemaining = (endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Ended';
    if (days === 0) return 'Last day!';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Crowdfunding Campaigns
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Support specific causes and projects. Your donation helps reach fundraising goals for meaningful impact.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'ending-soon'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Ending Soon'}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => {
              const progress = campaign.goalAmount > 0 
                ? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100) 
                : 0;
              
              return (
                <Link
                  key={campaign._id}
                  to={`/campaigns/${campaign._id}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.images?.[0] || '/placeholder-campaign.jpg'}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Campaign'; }}
                    />
                    {campaign.matchingEnabled && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        🎯 Matching Enabled
                      </div>
                    )}
                    {campaign.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category & Time */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                        {campaign.category || 'General'}
                      </span>
                      <span className={`text-xs font-medium ${
                        getDaysRemaining(campaign.endDate) === 'Ended' 
                          ? 'text-red-500' 
                          : getDaysRemaining(campaign.endDate).includes('day left') || getDaysRemaining(campaign.endDate) === 'Last day!'
                          ? 'text-orange-500'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {getDaysRemaining(campaign.endDate)}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {campaign.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Charity */}
                    {campaign.charity && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                        by {campaign.charity.name || 'Unknown Charity'}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(progress)} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{campaign.raisedAmount?.toLocaleString('en-IN') || '0'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          of ₹{campaign.goalAmount?.toLocaleString('en-IN') || '0'} goal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {Math.round(progress)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.donorCount || 0} donors
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Start Your Own Campaign</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Are you a registered charity? Create a crowdfunding campaign to raise funds for your cause and reach more supporters.
          </p>
          <Link
            to="/campaigns/create"
            className="inline-block px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Create Campaign
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
