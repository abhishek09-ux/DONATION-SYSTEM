import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiUsers, FiTarget, FiTrendingUp, FiArrowRight, FiShield } from 'react-icons/fi';
import { matchingAPI, donationAPI, charityAPI } from '../services/api';
import CharityCard from '../components/CharityCard';
import AnimatedCounter from '../components/AnimatedCounter';
import ScrollReveal from '../components/ScrollReveal';
import { GridSkeleton, DonationItemSkeleton, ListSkeleton } from '../components/Skeleton';

const Home = () => {
  const [trendingCharities, setTrendingCharities] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trendingRes, donationsRes, causesRes] = await Promise.all([
        matchingAPI.getTrending({ limit: 6 }),
        donationAPI.getPublicRecent({ limit: 5 }),
        charityAPI.getCauses()
      ]);

      setTrendingCharities(trendingRes.data.data || []);
      setRecentDonations(donationsRes.data.data || []);
      setCauses(causesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: FiHeart, value: 50000000, label: 'Total Donated', prefix: '₹', suffix: '+' },
    { icon: FiUsers, value: 10000, label: 'Happy Donors', suffix: '+' },
    { icon: FiTarget, value: 500, label: 'Verified Charities', suffix: '+' },
    { icon: FiTrendingUp, value: 95, label: 'Impact Rate', suffix: '%' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-custom py-20 lg:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Find Your Perfect
              <span className="block gradient-text">Charity Match</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              AI-powered platform that connects you with verified Indian charities. 
              Make donations that create real impact.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search charities, causes, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 rounded-xl text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all duration-300 focus:shadow-xl"
                />
                <Link
                  to={`/charities?search=${searchQuery}`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-secondary px-6 btn-hover-lift ripple"
                >
                  Search
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link to="/charities" className="btn-outline bg-white/10 border-white text-white hover:bg-white hover:text-primary-700 btn-hover-lift ripple">
                Browse Charities
              </Link>
              <Link to="/register" className="btn-secondary flex items-center btn-hover-lift ripple glow-hover">
                Get Started
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="h-16 bg-gray-50 dark:bg-slate-900" style={{
          clipPath: 'ellipse(70% 100% at 50% 100%)'
        }} />
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-slate-900 -mt-8 pb-12">
        <div className="container-custom">
          <ScrollReveal animation="stagger" className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center card-hover group">
                <stat.icon className="mx-auto text-primary-600 dark:text-primary-400 mb-3 icon-bounce group-hover:scale-110 transition-transform" size={32} />
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.prefix || ''}<AnimatedCounter end={stat.value} duration={2500} />{stat.suffix || ''}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Popular Causes */}
      <section className="section-padding bg-white dark:bg-slate-800">
        <div className="container-custom">
          <ScrollReveal animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Popular Causes</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose a cause close to your heart and make a difference today
            </p>
          </ScrollReveal>

          <ScrollReveal animation="stagger" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {causes.slice(0, 7).map((cause) => (
              <Link
                key={cause.id}
                to={`/charities?cause=${cause.id}`}
                className="card text-center hover:bg-primary-50 dark:hover:bg-slate-700 transition-all group card-hover"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{cause.icon}</div>
                <div className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {cause.name}
                </div>
              </Link>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gray-50 dark:bg-slate-900">
        <div className="container-custom">
          <ScrollReveal animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered system makes donating easy, transparent, and impactful
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-up" delay={0} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold pulse">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your interests, location, and donation preferences
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150} className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold pulse" style={{ animationDelay: '0.5s' }}>
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get AI Matches</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI finds charities that match your values with 80%+ accuracy
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300} className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold pulse" style={{ animationDelay: '1s' }}>
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Donate & Track</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Make secure donations and see the real impact of your contribution
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trending Charities */}
      <section className="section-padding bg-white dark:bg-slate-800">
        <div className="container-custom">
          <ScrollReveal animation="fade-up" className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trending Charities</h2>
              <p className="text-gray-600 dark:text-gray-400">Most active and impactful organizations</p>
            </div>
            <Link to="/charities" className="btn-outline flex items-center btn-hover-lift">
              View All
              <FiArrowRight className="ml-2" />
            </Link>
          </ScrollReveal>

          {loading ? (
            <GridSkeleton count={6} columns={3} />
          ) : (
            <ScrollReveal animation="stagger">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingCharities.map((charity) => (
                  <div key={charity._id} className="card-hover">
                    <CharityCard charity={charity} />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Recent Donations */}
      <section className="section-padding bg-gray-50 dark:bg-slate-900">
        <div className="container-custom">
          <ScrollReveal animation="fade-up" className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recent Donations</h2>
            <p className="text-gray-600 dark:text-gray-400">Join these generous donors making a difference</p>
          </ScrollReveal>

          <ScrollReveal animation="stagger" className="max-w-2xl mx-auto space-y-4">
            {recentDonations.map((donation, index) => (
              <div key={index} className="card flex items-center justify-between card-hover">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center icon-bounce">
                    <FiHeart className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{donation.donor}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Donated to {donation.charity?.organizationName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600 dark:text-primary-400">₹{donation.amount?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding bg-primary-600 text-white overflow-hidden">
        <div className="container-custom">
          <ScrollReveal animation="scale" className="max-w-4xl mx-auto text-center">
            <FiShield className="mx-auto text-5xl mb-6 float" />
            <h2 className="text-3xl font-bold mb-4">100% Secure & Transparent</h2>
            <p className="text-blue-100 mb-8 text-lg">
              All charities are verified by our team. Every donation is tracked and you receive 
              impact reports showing exactly how your money is being used.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
                <FiShield />
                <span>Verified NGOs</span>
              </div>
              <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
                <FiShield />
                <span>80G Certified</span>
              </div>
              <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
                <FiShield />
                <span>Razorpay Secured</span>
              </div>
              <div className="flex items-center space-x-2 hover:scale-110 transition-transform">
                <FiShield />
                <span>Impact Tracking</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white dark:bg-slate-800">
        <div className="container-custom">
          <ScrollReveal animation="fade-up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 gradient-text">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of donors who are creating real impact in India.
              Start your giving journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3 btn-hover-lift glow-hover">
                Start Donating
              </Link>
              <Link to="/register?role=charity" className="btn-outline text-lg px-8 py-3 btn-hover-lift">
                Register Your NGO
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
