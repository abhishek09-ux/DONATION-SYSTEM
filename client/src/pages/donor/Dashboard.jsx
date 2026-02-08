import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiTrendingUp, FiCalendar, FiDollarSign, 
  FiAward, FiStar, FiArrowRight, FiTarget 
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { donorAPI, matchingAPI } from '../../services/api';
import CharityCard from '../../components/CharityCard';
import { StatsCardSkeleton, ChartSkeleton, CharityCardSkeleton } from '../../components/Skeleton';

const DonorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recommendationsRes, donationsRes] = await Promise.all([
        donorAPI.getStats(),
        matchingAPI.getRecommendations({ limit: 3 }),
        donorAPI.getDonations({ limit: 5 })
      ]);

      setStats(statsRes.data.data);
      setRecommendations(recommendationsRes.data.data || []);
      setRecentDonations(donationsRes.data.data.donations || []);
      
      // Process donation history for chart
      const history = donationsRes.data.data.donations || [];
      const monthlyData = processMonthlyDonations(history);
      setDonationHistory(monthlyData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyDonations = (donations) => {
    const months = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = 0;
    }

    // Sum donations by month
    donations.forEach(d => {
      const date = new Date(d.createdAt);
      const key = date.toLocaleString('default', { month: 'short' });
      if (months[key] !== undefined) {
        months[key] += d.amount;
      }
    });

    return Object.entries(months).map(([month, amount]) => ({ month, amount }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <div className="skeleton h-8 w-48 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <CharityCardSkeleton />
            <CharityCardSkeleton />
            <CharityCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const causeDistribution = stats?.donationsByCause || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600">Here's an overview of your giving journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(stats?.totalDonated || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Charities Supported</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.charitiesSupported || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiHeart className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalDonations || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Impact Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.impactScore || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiAward className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Donation History Chart */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Donation History</h2>
                <Link to="/donor/donations" className="text-primary-600 text-sm hover:underline flex items-center">
                  View All <FiArrowRight className="ml-1" />
                </Link>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommended Charities */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  <FiTarget className="inline mr-2" />
                  Recommended For You
                </h2>
                <Link to="/donor/recommendations" className="text-primary-600 text-sm hover:underline flex items-center">
                  See All <FiArrowRight className="ml-1" />
                </Link>
              </div>
              {recommendations.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <CharityCard key={rec.charity._id} charity={rec.charity} compact />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiTarget className="text-4xl mx-auto mb-2" />
                  <p>Complete your profile to get personalized recommendations</p>
                  <Link to="/donor/profile" className="btn-primary mt-4 inline-block">
                    Update Profile
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Cause Distribution */}
            {causeDistribution.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Giving by Cause</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={causeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="amount"
                        nameKey="cause"
                      >
                        {causeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {causeDistribution.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-600 capitalize">{item.cause?.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="font-medium">₹{item.amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Donations */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h2>
              {recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">
                          {donation.charity?.organizationName || 'Unknown Charity'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-semibold text-sm ${
                        donation.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        ₹{donation.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No donations yet</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/charities" className="btn-primary w-full flex items-center justify-center">
                  <FiHeart className="mr-2" /> Find Charities
                </Link>
                <Link to="/donor/profile" className="btn-outline w-full flex items-center justify-center">
                  <FiStar className="mr-2" /> Update Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
