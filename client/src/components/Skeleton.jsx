// Reusable Skeleton Components for Loading States

// Base skeleton element
export const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const baseClass = 'skeleton rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    thumbnail: 'h-24 w-24 rounded-lg',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-48 w-full rounded-xl',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`${baseClass} ${variantClasses[variant] || ''} ${className}`}
      style={style}
    />
  );
};

// Charity Card Skeleton
export const CharityCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      {/* Header row with logo */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 rounded-lg skeleton" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
      
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      
      {/* Stats row */}
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
      
      {/* Progress bar */}
      <div className="skeleton h-2 w-full rounded-full mb-2" />
      <div className="flex justify-between">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-12" />
      </div>
      
      {/* Button */}
      <div className="skeleton h-10 w-full rounded-lg mt-4" />
    </div>
  );
};

// Donation List Item Skeleton
export const DonationItemSkeleton = () => {
  return (
    <div className="card flex items-center justify-between animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-48" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-3 w-16" />
      </div>
    </div>
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton = () => {
  return (
    <div className="card text-center animate-pulse">
      <div className="skeleton h-8 w-24 mx-auto mb-2" />
      <div className="skeleton h-4 w-20 mx-auto" />
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 rounded-full skeleton" />
        <div className="space-y-2">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-4/6" />
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="skeleton h-4 w-full" />
        </td>
      ))}
    </tr>
  );
};

// Chart Skeleton
export const ChartSkeleton = ({ height = 'h-64' }) => {
  return (
    <div className={`card animate-pulse ${height}`}>
      <div className="skeleton h-6 w-40 mb-4" />
      <div className="flex items-end justify-between h-48 gap-2">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className="skeleton flex-1 rounded-t"
            style={{ height: `${Math.random() * 70 + 30}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// List Skeleton - renders multiple items
export const ListSkeleton = ({ count = 3, ItemComponent = DonationItemSkeleton }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <ItemComponent key={i} />
      ))}
    </div>
  );
};

// Grid Skeleton - renders multiple cards
export const GridSkeleton = ({ count = 6, columns = 3 }) => {
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridClass[columns] || gridClass[3]}`}>
      {[...Array(count)].map((_, i) => (
        <CharityCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
