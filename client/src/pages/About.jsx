import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiTarget, FiShield, FiAward, FiGlobe } from 'react-icons/fi';

const About = () => {
  const stats = [
    { icon: FiUsers, value: '10,000+', label: 'Donors' },
    { icon: FiHeart, value: '500+', label: 'Charities' },
    { icon: FiTarget, value: '₹50Cr+', label: 'Donated' },
    { icon: FiGlobe, value: '28', label: 'States Covered' },
  ];

  const team = [
    { name: 'Priya Sharma', role: 'Founder & CEO', image: 'https://via.placeholder.com/150' },
    { name: 'Rahul Verma', role: 'CTO', image: 'https://via.placeholder.com/150' },
    { name: 'Anita Patel', role: 'Head of Partnerships', image: 'https://via.placeholder.com/150' },
    { name: 'Vikram Singh', role: 'Head of Operations', image: 'https://via.placeholder.com/150' },
  ];

  const values = [
    {
      icon: FiShield,
      title: 'Transparency',
      description: 'Every rupee is tracked. We provide complete visibility into how your donations are used.'
    },
    {
      icon: FiHeart,
      title: 'Trust',
      description: 'All charities are verified with 80G certification. Your contributions are in safe hands.'
    },
    {
      icon: FiTarget,
      title: 'Impact',
      description: 'AI-powered matching ensures your donations create maximum positive change.'
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'We continuously improve our platform to better serve donors and charities.'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About DaanMatch
            </h1>
            <p className="text-xl text-primary-100">
              We're on a mission to revolutionize charitable giving in India by connecting 
              generous donors with verified causes through intelligent matching.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="text-primary-600 dark:text-primary-400 text-3xl mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  DaanMatch was born from a simple observation: many people want to donate but 
                  struggle to find causes that align with their values. At the same time, 
                  countless deserving charities struggle to reach potential donors.
                </p>
                <p>
                  Founded in 2023, we set out to bridge this gap using technology. Our AI-powered 
                  platform analyzes donor preferences and charity profiles to create meaningful 
                  connections that maximize impact.
                </p>
                <p>
                  Today, we're proud to have facilitated millions in donations, helping thousands 
                  of charities expand their reach and millions of beneficiaries receive support.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <FiHeart className="text-primary-600 text-8xl mx-auto mb-4" />
                <p className="text-2xl font-bold text-primary-800">Making Giving Smarter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core principles guide everything we do at DaanMatch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-primary-600 dark:text-primary-400 text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How DaanMatch Works</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Verify Charities</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every charity on our platform undergoes rigorous verification. We check 80G status, 
                    FCRA registration, financial records, and track record before listing them.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Understand Donor Preferences</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    When you sign up, we learn about your interests, preferred causes, location preferences, 
                    and giving capacity to build your donor profile.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">AI-Powered Matching</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our algorithm analyzes your preferences against charity profiles to recommend 
                    organizations where your donation will have the most meaningful impact.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Secure Donations</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Donate seamlessly through UPI, cards, or net banking via our secure Razorpay integration. 
                    Get instant 80G tax receipts and track your contribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are using smart technology to maximize their impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3">
              Start Donating
            </Link>
            <Link to="/charities" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3">
              Browse Charities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
