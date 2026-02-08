import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiSearch, FiFilter, FiCheck, FiX, FiEye, 
  FiChevronLeft, FiChevronRight, FiTrash2
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageCharities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: '',
    is80G: ''
  });

  useEffect(() => {
    fetchCharities();
  }, [page, filters.status, filters.is80G]);

  const fetchCharities = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(filters.status && { verificationStatus: filters.status }),
        ...(filters.is80G && { is80GRegistered: filters.is80G === 'yes' }),
        ...(filters.search && { search: filters.search })
      };

      const res = await adminAPI.getCharities(params);
      setCharities(res.data.data.charities || []);
      setTotalPages(res.data.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching charities:', error);
      toast.error('Failed to load charities');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCharities();
  };

  const updateVerification = async (charityId, status) => {
    try {
      await adminAPI.updateCharityVerification(charityId, { status });
      toast.success(`Charity ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
      fetchCharities();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const deleteCharity = async (charityId) => {
    if (!window.confirm('Are you sure you want to delete this charity?')) return;
    
    try {
      await adminAPI.deleteCharity(charityId);
      toast.success('Charity deleted successfully');
      fetchCharities();
    } catch (error) {
      toast.error('Failed to delete charity');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Charities</h1>
          <p className="text-gray-600">Review and manage registered organizations</p>
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
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setSearchParams(e.target.value ? { status: e.target.value } : {});
                }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">80G Status</label>
              <select
                className="input"
                value={filters.is80G}
                onChange={(e) => setFilters({ ...filters, is80G: e.target.value })}
              >
                <option value="">All</option>
                <option value="yes">80G Registered</option>
                <option value="no">Not Registered</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">
              <FiFilter className="mr-2" /> Filter
            </button>
          </form>
        </div>

        {/* Charities Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner" />
            </div>
          ) : charities.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        80G
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Donations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {charities.map((charity) => (
                      <tr key={charity._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              {charity.logo ? (
                                <img src={charity.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-gray-500 font-bold">
                                  {charity.organizationName?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{charity.organizationName}</p>
                              <p className="text-xs text-gray-500">{charity.causes?.slice(0, 2).join(', ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {charity.location?.city}, {charity.location?.state}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(charity.verificationStatus)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {charity.is80GRegistered ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          ₹{(charity.stats?.totalDonationsReceived || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/charities/${charity._id}`}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="View"
                            >
                              <FiEye size={18} />
                            </Link>
                            {charity.verificationStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateVerification(charity._id, 'verified')}
                                  className="p-2 text-green-500 hover:text-green-700"
                                  title="Verify"
                                >
                                  <FiCheck size={18} />
                                </button>
                                <button
                                  onClick={() => updateVerification(charity._id, 'rejected')}
                                  className="p-2 text-red-500 hover:text-red-700"
                                  title="Reject"
                                >
                                  <FiX size={18} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteCharity(charity._id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
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
              <p className="text-gray-500">No charities found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCharities;
