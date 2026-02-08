import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiDownload, FiFilter, FiSearch, FiCalendar, 
  FiChevronLeft, FiChevronRight, FiExternalLink 
} from 'react-icons/fi';
import { donorAPI, donationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    taxDeductible: 0
  });

  useEffect(() => {
    fetchDonations();
  }, [page, filters.status, filters.startDate, filters.endDate]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      };

      const [donationsRes, statsRes] = await Promise.all([
        donorAPI.getDonations(params),
        donorAPI.getStats()
      ]);

      setDonations(donationsRes.data.data.donations || []);
      setTotalPages(donationsRes.data.data.pagination?.pages || 1);
      setStats({
        totalDonated: statsRes.data.data.totalDonated || 0,
        totalDonations: statsRes.data.data.totalDonations || 0,
        taxDeductible: statsRes.data.data.taxDeductible || 0
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (donationId) => {
    try {
      const res = await donationAPI.getReceipt(donationId);
      window.open(res.data.data.receiptUrl, '_blank');
    } catch (error) {
      toast.error('Receipt not available');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="text-gray-600">Track and manage your donation history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-500 text-sm">Total Donated</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.totalDonated.toLocaleString()}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Total Donations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Tax Deductible (80G)</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{stats.taxDeductible.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                className="input"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                className="input"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <button
              onClick={() => setFilters({ status: '', startDate: '', endDate: '', search: '' })}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Donations Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner" />
            </div>
          ) : donations.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Charity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        80G
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/charities/${donation.charity?._id}`}
                            className="text-primary-600 hover:underline font-medium"
                          >
                            {donation.charity?.organizationName || 'Unknown'}
                          </Link>
                          {donation.project && (
                            <p className="text-xs text-gray-500">{donation.project}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            ₹{donation.amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(donation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {donation.is80GEligible ? (
                            <span className="text-green-600">Eligible</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {donation.status === 'completed' && (
                              <button
                                onClick={() => downloadReceipt(donation._id)}
                                className="text-primary-600 hover:text-primary-700"
                                title="Download Receipt"
                              >
                                <FiDownload size={18} />
                              </button>
                            )}
                            <Link
                              to={`/charities/${donation.charity?._id}`}
                              className="text-gray-400 hover:text-gray-600"
                              title="View Charity"
                            >
                              <FiExternalLink size={18} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-outline p-2 disabled:opacity-50"
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-outline p-2 disabled:opacity-50"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto text-gray-300 text-5xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-500 mb-4">Start your giving journey today!</p>
              <Link to="/charities" className="btn-primary">
                Find Charities
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;
