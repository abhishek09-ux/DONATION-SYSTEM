import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, FiFilter, FiDownload, FiEye,
  FiChevronLeft, FiChevronRight, FiRefreshCw
} from 'react-icons/fi';
import { adminAPI, donationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    fetchDonations();
  }, [page, filters.status, filters.startDate, filters.endDate]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search })
      };

      const [donationsRes, statsRes] = await Promise.all([
        adminAPI.getAllDonations(params),
        adminAPI.getDonationStats()
      ]);

      setDonations(donationsRes.data.data.donations || []);
      setTotalPages(donationsRes.data.data.pagination?.pages || 1);
      setStats(statsRes.data.data || stats);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const exportToCSV = async () => {
    try {
      const res = await adminAPI.exportDonations(filters);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Export downloaded');
    } catch (error) {
      toast.error('Failed to export donations');
    }
  };

  const retryPayment = async (donationId) => {
    try {
      await donationAPI.retryPayment(donationId);
      toast.success('Payment retry initiated');
      fetchDonations();
    } catch (error) {
      toast.error('Failed to retry payment');
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Donations</h1>
            <p className="text-gray-600">Track and manage all platform donations</p>
          </div>
          <button onClick={exportToCSV} className="btn-outline mt-4 md:mt-0 flex items-center">
            <FiDownload className="mr-2" /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(stats.total || 0).toLocaleString()}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed || 0}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending || 0}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-500 text-sm">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.failed || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search donor or charity..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="w-[150px]">
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
            <div className="w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                className="input"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                className="input"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">
              <FiFilter className="mr-2" /> Filter
            </button>
            <button 
              type="button"
              onClick={() => setFilters({ status: '', startDate: '', endDate: '', search: '' })}
              className="btn-outline"
            >
              Clear
            </button>
          </form>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Donor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Charity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-400">
                            {new Date(donation.createdAt).toLocaleTimeString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            {donation.isAnonymous ? 'Anonymous' : donation.donor?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">{donation.donor?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/charities/${donation.charity?._id}`}
                            className="text-sm text-primary-600 hover:underline"
                          >
                            {donation.charity?.organizationName || 'Unknown'}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900">
                            ₹{donation.amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {donation.paymentMethod || 'Razorpay'}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(donation.status)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/charities/${donation.charity?._id}`}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="View Charity"
                            >
                              <FiEye size={16} />
                            </Link>
                            {donation.status === 'failed' && (
                              <button
                                onClick={() => retryPayment(donation._id)}
                                className="p-2 text-yellow-500 hover:text-yellow-700"
                                title="Retry Payment"
                              >
                                <FiRefreshCw size={16} />
                              </button>
                            )}
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
              <p className="text-gray-500">No donations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDonations;
