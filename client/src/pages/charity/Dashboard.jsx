import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiDollarSign, FiTrendingUp, FiHeart,
  FiPlus, FiEdit, FiEye, FiArrowRight
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { charityAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { StatsCardSkeleton, ChartSkeleton, DonationItemSkeleton } from '../../components/Skeleton';

const CharityDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationTrend, setDonationTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, donationsRes] = await Promise.all([
        charityAPI.getStats(),
        charityAPI.getReceivedDonations({ limit: 5 })
      ]);

      setStats(statsRes.data.data);
      setRecentDonations(donationsRes.data.data.donations || []);
      
      // Process monthly trend
      const donations = donationsRes.data.data.donations || [];
      setDonationTrend(processTrendData(donations));
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const processTrendData = (donations) => {
    const months = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = { month: key, amount: 0, count: 0 };
    }

    donations.forEach(d => {
      const date = new Date(d.createdAt);
      const key = date.toLocaleString('default', { month: 'short' });
      if (months[key]) {
        months[key].amount += d.amount;
        months[key].count += 1;
      }
    });

    return Object.values(months);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <ChartSkeleton />
            <div className="card space-y-4">
              <div className="skeleton h-6 w-40 mb-4" />
              <DonationItemSkeleton />
              <DonationItemSkeleton />
              <DonationItemSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Charity Dashboard</h1>
            <p className="text-gray-600">Manage your organization and track donations</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link to="/charity/profile" className="btn-outline flex items-center">
              <FiEdit className="mr-2" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(stats?.totalReceived || 0).toLocaleString()}
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
                <p className="text-gray-500 text-sm">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalDonors || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(stats?.thisMonth || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.profileViews || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiEye className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Donation Trend */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Donation Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'amount' ? `₹${value.toLocaleString()}` : value,
                        name === 'amount' ? 'Amount' : 'Donations'
                      ]} 
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verification Status */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${stats?.verified ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className="text-sm text-gray-600">Profile Status</p>
                  <p className={`font-semibold ${stats?.verified ? 'text-green-700' : 'text-yellow-700'}`}>
                    {stats?.verified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${stats?.is80G ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600">80G Certificate</p>
                  <p className={`font-semibold ${stats?.is80G ? 'text-green-700' : 'text-gray-500'}`}>
                    {stats?.is80G ? 'Certified' : 'Not Registered'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${stats?.fcra ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600">FCRA Status</p>
                  <p className={`font-semibold ${stats?.fcra ? 'text-green-700' : 'text-gray-500'}`}>
                    {stats?.fcra ? 'Registered' : 'Not Registered'}
                  </p>
                </div>
              </div>
              {!stats?.verified && (
                <p className="text-sm text-yellow-600 mt-4">
                  Complete your profile and upload documents to get verified and increase visibility.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Donations */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h2>
              {recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {donation.isAnonymous ? 'Anonymous' : donation.donor?.name || 'Donor'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-green-600">
                        +₹{donation.amount?.toLocaleString()}
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
                <Link 
                  to="/charity/profile" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center text-gray-700">
                    <FiEdit className="mr-3" /> Update Profile
                  </span>
                  <FiArrowRight className="text-gray-400" />
                </Link>
                <button
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center text-gray-700">
                    <FiPlus className="mr-3" /> Add Project
                  </span>
                  <FiArrowRight className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="card bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Tips to Get More Donations</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Complete your profile with images and stories</li>
                <li>• Get 80G certification for tax benefits</li>
                <li>• Post regular updates on your projects</li>
                <li>• Share your profile on social media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard;
