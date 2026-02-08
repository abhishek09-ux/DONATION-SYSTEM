import { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { FiTrendingUp, FiCalendar, FiPieChart, FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3 border dark:border-slate-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Donation Trend Chart
export const DonationTrendChart = ({ data, height = 300, showArea = true }) => {
  const formatAmount = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiTrendingUp className="text-primary-500" />
          Donation Trends
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
            <XAxis 
              dataKey="month" 
              className="text-gray-500 dark:text-gray-400"
              tick={{ fill: 'currentColor', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatAmount}
              className="text-gray-500 dark:text-gray-400"
              tick={{ fill: 'currentColor', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip formatter={formatAmount} />} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#colorAmount)" 
              name="Total Donations"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis tickFormatter={formatAmount} tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip formatter={formatAmount} />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              name="Total Donations"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// Cause Distribution Pie Chart
export const CauseDistributionChart = ({ data, height = 300 }) => {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiPieChart className="text-secondary-500" />
          Donations by Cause
        </h3>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 min-w-[150px]">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Monthly Comparison Bar Chart
export const MonthlyComparisonChart = ({ data, height = 300 }) => {
  const formatAmount = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiBarChart2 className="text-accent-500" />
          Monthly Comparison
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-700" />
          <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <YAxis tickFormatter={formatAmount} tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip formatter={formatAmount} />} />
          <Legend />
          <Bar dataKey="thisYear" name="This Year" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="lastYear" name="Last Year" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Stats Summary Cards
export const StatsSummary = ({ stats }) => {
  const formatValue = (stat) => {
    if (stat.prefix === '₹') {
      if (stat.value >= 10000000) return `₹${(stat.value / 10000000).toFixed(1)}Cr`;
      if (stat.value >= 100000) return `₹${(stat.value / 100000).toFixed(1)}L`;
      return `₹${stat.value.toLocaleString()}`;
    }
    return stat.value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`text-2xl ${stat.color || 'text-primary-500'}`} />
            {stat.change && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change > 0 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(stat)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

// Combined Analytics Dashboard
const AnalyticsDashboard = ({ 
  trendData, 
  causeData, 
  comparisonData, 
  stats,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'causes', label: 'By Cause', icon: FiPieChart },
    { id: 'comparison', label: 'Comparison', icon: FiBarChart2 },
  ];

  return (
    <div className={className}>
      {/* Stats Summary */}
      {stats && <StatsSummary stats={stats} />}

      {/* Tab Navigation */}
      <div className="flex gap-2 mt-6 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {activeTab === 'overview' && trendData && (
          <DonationTrendChart data={trendData} />
        )}
        {activeTab === 'causes' && causeData && (
          <CauseDistributionChart data={causeData} />
        )}
        {activeTab === 'comparison' && comparisonData && (
          <MonthlyComparisonChart data={comparisonData} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
