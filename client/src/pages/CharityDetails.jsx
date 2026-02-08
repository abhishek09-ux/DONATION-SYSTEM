import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMapPin, FiStar, FiHeart, FiShare2, FiExternalLink, 
  FiCalendar, FiUsers, FiAward, FiCheck, FiArrowLeft 
} from 'react-icons/fi';
import { charityAPI, matchingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DonationModal from '../components/DonationModal';
import CharityCard from '../components/CharityCard';

const CharityDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [charity, setCharity] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [similarCharities, setSimilarCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchCharity();
  }, [id]);

  const fetchCharity = async () => {
    setLoading(true);
    try {
      const [charityRes, similarRes] = await Promise.all([
        charityAPI.getById(id),
        matchingAPI.getSimilar(id, { limit: 3 })
      ]);

      setCharity(charityRes.data.data.charity);
      setRecentDonations(charityRes.data.data.recentDonations || []);
      setSimilarCharities(similarRes.data.data || []);
    } catch (error) {
      console.error('Error fetching charity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Charity not found</h2>
          <Link to="/charities" className="btn-primary">
            Browse Charities
          </Link>
        </div>
      </div>
    );
  }

  const fundingProgress = charity.fundingNeeds?.totalRequired
    ? Math.round((charity.fundingNeeds.totalRaised / charity.fundingNeeds.totalRequired) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="h-64 md:h-80 bg-gradient-to-r from-primary-600 to-primary-800 relative">
        {charity.coverImage && (
          <img
            src={charity.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link
            to="/charities"
            className="flex items-center space-x-2 text-white bg-black/30 px-4 py-2 rounded-lg hover:bg-black/50 transition-colors"
          >
            <FiArrowLeft />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="container-custom -mt-20 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Logo */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {charity.logo ? (
                    <img src={charity.logo} alt={charity.organizationName} className="w-full h-full object-cover" />
                  ) : (
                    <FiHeart className="text-primary-500 text-4xl" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {charity.organizationName}
                    </h1>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <FiShare2 size={20} />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {charity.verificationStatus === 'verified' && (
                      <span className="badge badge-success flex items-center">
                        <FiCheck className="mr-1" /> Verified
                      </span>
                    )}
                    {charity.is80GRegistered && (
                      <span className="badge badge-primary">80G Certified</span>
                    )}
                    {charity.fcraRegistered && (
                      <span className="badge badge-primary">FCRA Registered</span>
                    )}
                  </div>

                  {/* Location & Stats */}
                  <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                    {charity.location && (
                      <div className="flex items-center">
                        <FiMapPin className="mr-1" />
                        {charity.location.city}, {charity.location.state}
                      </div>
                    )}
                    {charity.foundedYear && (
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        Since {charity.foundedYear}
                      </div>
                    )}
                    <div className="flex items-center">
                      <FiStar className="mr-1 text-yellow-400" />
                      {charity.rating?.average?.toFixed(1) || 'N/A'} ({charity.rating?.count || 0} reviews)
                    </div>
                  </div>
                </div>
              </div>

              {/* Causes */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {charity.causes?.map((cause, index) => (
                    <span key={index} className="badge bg-primary-50 text-primary-700 px-3 py-1">
                      {cause.replace(/_/g, ' ').charAt(0).toUpperCase() + cause.slice(1).replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="flex border-b mb-6">
                {['about', 'projects', 'impact', 'gallery'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium capitalize transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">About Us</h3>
                    <p className="text-gray-600 whitespace-pre-line">{charity.description}</p>
                  </div>

                  {charity.mission && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Our Mission</h3>
                      <p className="text-gray-600">{charity.mission}</p>
                    </div>
                  )}

                  {charity.vision && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Our Vision</h3>
                      <p className="text-gray-600">{charity.vision}</p>
                    </div>
                  )}

                  {charity.website && (
                    <a
                      href={charity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:underline"
                    >
                      <FiExternalLink className="mr-2" />
                      Visit Website
                    </a>
                  )}
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {charity.activeProjects?.length > 0 ? (
                    charity.activeProjects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                        <div className="flex justify-between text-sm mb-2">
                          <span>₹{project.raisedAmount?.toLocaleString() || 0} raised</span>
                          <span>Goal: ₹{project.targetAmount?.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min((project.raisedAmount / project.targetAmount) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No active projects</p>
                  )}
                </div>
              )}

              {activeTab === 'impact' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {charity.stats?.beneficiariesHelped?.toLocaleString() || '1000+'}
                      </div>
                      <div className="text-sm text-gray-600">Lives Impacted</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{(charity.stats?.totalDonationsReceived || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Raised</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {charity.stats?.totalDonors || 0}
                      </div>
                      <div className="text-sm text-gray-600">Donors</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {charity.stats?.projectsCompleted || 0}
                      </div>
                      <div className="text-sm text-gray-600">Projects Done</div>
                    </div>
                  </div>

                  {charity.impactReports?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Impact Reports</h3>
                      <div className="space-y-3">
                        {charity.impactReports.map((report, index) => (
                          <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{report.title}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(report.date).toLocaleDateString()}
                              </p>
                            </div>
                            {report.fileUrl && (
                              <a
                                href={report.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline text-sm"
                              >
                                View Report
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {charity.gallery?.length > 0 ? (
                    charity.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center py-8">
                      No gallery images
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Support This Cause</h3>

              {/* Funding Progress */}
              {charity.fundingNeeds?.totalRequired > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">
                      ₹{(charity.fundingNeeds.totalRaised || 0).toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      of ₹{charity.fundingNeeds.totalRequired.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{fundingProgress}% funded</p>
                </div>
              )}

              <button
                onClick={() => setShowDonationModal(true)}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center"
              >
                <FiHeart className="mr-2" />
                Donate Now
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                Minimum donation: ₹{charity.minimumDonation || 100}
              </p>
            </div>

            {/* Recent Donations */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Donations</h3>
              {recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {recentDonations.slice(0, 5).map((donation, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-primary-600">
                        ₹{donation.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Be the first to donate!
                </p>
              )}
            </div>

            {/* Similar Charities */}
            {similarCharities.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Similar Charities</h3>
                <div className="space-y-4">
                  {similarCharities.map((similar) => (
                    <Link
                      key={similar._id}
                      to={`/charities/${similar._id}`}
                      className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {similar.logo ? (
                          <img src={similar.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <FiHeart className="text-primary-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {similar.organizationName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {similar.location?.city}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        charity={charity}
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSuccess={() => {
          fetchCharity();
        }}
      />
    </div>
  );
};

export default CharityDetails;
