import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiFilter, FiMapPin, FiX, FiColumns } from 'react-icons/fi';
import { charityAPI, matchingAPI } from '../services/api';
import CharityCard from '../components/CharityCard';
import { GridSkeleton } from '../components/Skeleton';
import CharityComparison from '../components/CharityComparison';

const Charities = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCauses, setSelectedCauses] = useState(
    searchParams.get('cause')?.split(',') || []
  );
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchCharities();
  }, [searchParams]);

  const fetchFilters = async () => {
    try {
      const response = await matchingAPI.getFilters();
      setFilters(response.data.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchCharities = async () => {
    setLoading(true);
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
        search: searchParams.get('search'),
        cause: searchParams.get('cause'),
        city: searchParams.get('city'),
        state: searchParams.get('state')
      };

      const response = await charityAPI.getAll(params);
      setCharities(response.data.data.charities || []);
      setPagination(response.data.data.pagination || { current: 1, total: 1 });
    } catch (error) {
      console.error('Error fetching charities:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCauses.length) params.set('cause', selectedCauses.join(','));
    if (selectedCity) params.set('city', selectedCity);
    if (selectedState) params.set('state', selectedState);
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCauses([]);
    setSelectedCity('');
    setSelectedState('');
    setSearchParams({});
  };

  const toggleCause = (causeId) => {
    setSelectedCauses(prev =>
      prev.includes(causeId)
        ? prev.filter(c => c !== causeId)
        : [...prev, causeId]
    );
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const hasActiveFilters = searchQuery || selectedCauses.length || selectedCity || selectedState;

  const toggleCompare = (charity) => {
    setCompareList(prev => {
      const exists = prev.find(c => c._id === charity._id);
      if (exists) {
        return prev.filter(c => c._id !== charity._id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, charity];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('charities.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('charities.subtitle')}</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('common.filter', 'Filters')}</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="label">{t('common.search')}</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Causes */}
              <div className="mb-6">
                <label className="label">{t('causes', 'Causes')}</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filters?.causes?.map((cause) => (
                    <label key={cause.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCauses.includes(cause.id)}
                        onChange={() => toggleCause(cause.id)}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {cause.icon} {cause.name}
                      </span>
                      {cause.count > 0 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">({cause.count})</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="label">{t('state', 'State')}</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('allStates', 'All States')}</option>
                  {filters?.states?.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="label">{t('city', 'City')}</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('allCities', 'All Cities')}</option>
                  {filters?.cities?.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button onClick={applyFilters} className="btn-primary w-full">
                  {t('applyFilters', 'Apply Filters')}
                </button>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-outline w-full">
                    {t('clearAll', 'Clear All')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(true)}
                className="btn-outline flex items-center"
              >
                <FiFilter className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                    {[searchQuery, selectedCauses.length, selectedCity, selectedState].filter(Boolean).length}
                  </span>
                )}
              </button>
              <span className="text-gray-500 dark:text-gray-400">{pagination.count || 0} results</span>
            </div>

            {/* Active Filters Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchQuery && (
                  <span className="badge badge-primary flex items-center">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-1">
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {selectedCauses.map((causeId) => {
                  const cause = filters?.causes?.find(c => c.id === causeId);
                  return (
                    <span key={causeId} className="badge badge-primary flex items-center">
                      {cause?.icon} {cause?.name}
                      <button onClick={() => toggleCause(causeId)} className="ml-1">
                        <FiX size={14} />
                      </button>
                    </span>
                  );
                })}
                {selectedState && (
                  <span className="badge badge-primary flex items-center">
                    <FiMapPin className="mr-1" size={12} />
                    {selectedState}
                    <button onClick={() => setSelectedState('')} className="ml-1">
                      <FiX size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Results */}
            {loading ? (
              <GridSkeleton count={12} columns={3} />
            ) : charities.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No charities found matching your criteria</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {charities.map((charity) => (
                    <CharityCard 
                      key={charity._id} 
                      charity={charity}
                      showCompare={true}
                      isSelected={compareList.some(c => c._id === charity._id)}
                      onCompareToggle={() => toggleCompare(charity)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: pagination.total }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === pagination.current
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-600 dark:text-gray-400">
                <FiX size={24} />
              </button>
            </div>

            {/* Same filters as desktop */}
            <div className="mb-6">
              <label className="label">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="input-field"
              />
            </div>

            <div className="mb-6">
              <label className="label">Causes</label>
              <div className="space-y-2">
                {filters?.causes?.slice(0, 10).map((cause) => (
                  <label key={cause.id} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedCauses.includes(cause.id)}
                      onChange={() => toggleCause(cause.id)}
                      className="rounded"
                    />
                    <span>{cause.icon} {cause.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={applyFilters} className="btn-primary w-full">
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-outline w-full">
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Floating Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="bg-white dark:bg-slate-800 rounded-full shadow-2xl border dark:border-slate-700 px-6 py-3 flex items-center gap-4">
            <div className="flex -space-x-2">
              {compareList.map((charity) => (
                <div
                  key={charity._id}
                  className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 overflow-hidden"
                >
                  {charity.logo ? (
                    <img src={charity.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                      {charity.organizationName?.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {compareList.length} selected
            </span>
            <button
              onClick={() => setShowComparison(true)}
              className="btn-primary py-2 px-4 flex items-center gap-2"
            >
              <FiColumns size={16} />
              Compare
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Charity Comparison Modal */}
      <CharityComparison
        charities={compareList}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onRemove={(id) => setCompareList(prev => prev.filter(c => c._id !== id))}
      />
    </div>
  );
};

export default Charities;
