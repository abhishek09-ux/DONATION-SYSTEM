import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiHeart, FiDollarSign, FiTrendingUp,
  FiAlertCircle, FiCheckCircle, FiClock, FiArrowRight
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { adminAPI } from '../../services/api';
import { StatsCardSkeleton, ChartSkeleton, DonationItemSkeleton } from '../../components/Skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingCharities, setPendingCharities] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationTrend, setDonationTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, charitiesRes, donationsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingCharities(),
        adminAPI.getRecentDonations({ limit: 5 })
      ]);

      setStats(statsRes.data.data);
      setPendingCharities(charitiesRes.data.data || []);
      setRecentDonations(donationsRes.data.data || []);
      setDonationTrend(statsRes.data.data.monthlyTrend || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-4 w-64 mb-8" />
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats?.newUsersThisMonth || 0} this month
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
                <p className="text-gray-500 text-sm">Total Charities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalCharities || 0}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {stats?.pendingVerification || 0} pending verification
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiHeart className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(stats?.totalDonationAmount || 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats?.totalDonations || 0} transactions
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
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(stats?.thisMonthAmount || 0).toLocaleString()}
                </p>
                <p className={`text-xs mt-1 ${stats?.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.growthPercentage >= 0 ? '+' : ''}{stats?.growthPercentage || 0}% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-orange-600 text-xl" />
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
                  <AreaChart data={donationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      fill="#93c5fd"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending Verifications */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiClock className="mr-2 text-yellow-500" />
                  Pending Verifications
                </h2>
                <Link to="/admin/charities?status=pending" className="text-primary-600 text-sm hover:underline flex items-center">
                  View All <FiArrowRight className="ml-1" />
                </Link>
              </div>
              {pendingCharities.length > 0 ? (
                <div className="space-y-4">
                  {pendingCharities.slice(0, 5).map((charity) => (
                    <div key={charity._id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{charity.organizationName}</p>
                        <p className="text-sm text-gray-500">
                          {charity.location?.city}, {charity.location?.state} • 
                          Applied {new Date(charity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/admin/charities/${charity._id}`}
                        className="btn-primary text-sm"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-2" />
                  <p>All charities verified!</p>
                </div>
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
                          {donation.donor?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          to {donation.charity?.organizationName}
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
                <p className="text-gray-500 text-center py-4">No recent donations</p>
              )}
              <Link
                to="/admin/donations"
                className="block text-center text-primary-600 text-sm mt-4 hover:underline"
              >
                View All Donations
              </Link>
            </div>

            {/* Quick Links */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/admin/charities" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-gray-700">Manage Charities</span>
                  <FiArrowRight className="text-gray-400" />
                </Link>
                <Link 
                  to="/admin/users" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-gray-700">Manage Users</span>
                  <FiArrowRight className="text-gray-400" />
                </Link>
                <Link 
                  to="/admin/donations" 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-gray-700">View Donations</span>
                  <FiArrowRight className="text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Alerts */}
            {(stats?.pendingVerification > 0 || stats?.failedPayments > 0) && (
              <div className="card bg-red-50 border border-red-100">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                  <FiAlertCircle className="mr-2" />
                  Attention Required
                </h3>
                <ul className="text-sm text-red-700 space-y-2">
                  {stats?.pendingVerification > 0 && (
                    <li>• {stats.pendingVerification} charities awaiting verification</li>
                  )}
                  {stats?.failedPayments > 0 && (
                    <li>• {stats.failedPayments} failed payment transactions</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
