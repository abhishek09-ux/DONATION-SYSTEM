import { useState } from 'react';
import { FiSearch, FiFilter, FiX, FiStar, FiMapPin, FiTarget, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AdvancedFilters = ({
  filters,
  searchQuery,
  setSearchQuery,
  selectedCauses,
  toggleCause,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedRating,
  setSelectedRating,
  fundingRange,
  setFundingRange,
  sortBy,
  setSortBy,
  applyFilters,
  clearFilters,
  hasActiveFilters,
  isOpen,
  onClose,
  isMobile = false
}) => {
  const [expandedSections, setExpandedSections] = useState({
    causes: true,
    location: true,
    rating: false,
    funding: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
  ];

  const fundingOptions = [
    { value: '', label: 'Any Progress' },
    { value: '0-25', label: 'Just Started (0-25%)' },
    { value: '25-50', label: 'Growing (25-50%)' },
    { value: '50-75', label: 'Halfway (50-75%)' },
    { value: '75-100', label: 'Almost There (75%+)' },
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'donations', label: 'Most Donations' },
    { value: 'newest', label: 'Newly Added' },
    { value: 'funding', label: 'Funding Progress' },
  ];

  const FilterSection = ({ title, icon: Icon, name, children }) => (
    <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(name)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <div className="flex items-center gap-2">
          <Icon className="text-gray-400" size={16} />
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
        {expandedSections[name] ? (
          <FiChevronUp className="text-gray-400" />
        ) : (
          <FiChevronDown className="text-gray-400" />
        )}
      </button>
      {expandedSections[name] && children}
    </div>
  );

  const content = (
    <div className={`${isMobile ? 'p-4' : ''}`}>
      {/* Search */}
      <div className="mb-6">
        <label className="label">Search</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search charities..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="label">Sort By</label>
        <select
          value={sortBy || 'trending'}
          onChange={(e) => setSortBy?.(e.target.value)}
          className="input-field"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Causes Section */}
      <FilterSection title="Causes" icon={FiTarget} name="causes">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {filters?.causes?.map((cause) => (
            <label key={cause.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCauses.includes(cause.id)}
                  onChange={() => toggleCause(cause.id)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {cause.icon} {cause.name}
                </span>
              </div>
              {cause.count > 0 && (
                <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {cause.count}
                </span>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Location Section */}
      <FilterSection title="Location" icon={FiMapPin} name="location">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="input-field text-sm"
            >
              <option value="">All States</option>
              {filters?.states?.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input-field text-sm"
            >
              <option value="">All Cities</option>
              {filters?.cities?.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Rating Section */}
      <FilterSection title="Rating" icon={FiStar} name="rating">
        <div className="space-y-2">
          {ratingOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                value={value}
                checked={selectedRating === value}
                onChange={(e) => setSelectedRating?.(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex items-center gap-1">
                {label}
                {value && <FiStar className="text-yellow-400 fill-yellow-400" size={12} />}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Funding Progress Section */}
      <FilterSection title="Funding Progress" icon={FiTarget} name="funding">
        <div className="space-y-2">
          {fundingOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="radio"
                name="funding"
                value={value}
                checked={fundingRange === value}
                onChange={(e) => setFundingRange?.(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Actions */}
      <div className="space-y-3 mt-6">
        <button onClick={applyFilters} className="btn-primary w-full btn-hover-lift">
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn-outline w-full">
            Clear All
          </button>
        )}
      </div>
    </div>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div className={`absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiFilter />
              Filters
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto h-[calc(100%-64px)]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="card sticky top-24">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FiFilter />
        Filters
      </h3>
      {content}
    </div>
  );
};

export default AdvancedFilters;
