import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiRefreshCw, FiSliders, FiInfo } from 'react-icons/fi';
import { matchingAPI } from '../../services/api';
import CharityCard from '../../components/CharityCard';
import toast from 'react-hot-toast';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await matchingAPI.getRecommendations({ limit: 12 });
      setRecommendations(res.data.data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiTarget className="mr-3 text-primary-600" />
              AI Recommendations
            </h1>
            <p className="text-gray-600 mt-1">
              Charities matched to your preferences
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="btn-outline flex items-center"
            >
              <FiInfo className="mr-2" />
              How it Works
            </button>
            <button
              onClick={() => fetchRecommendations(true)}
              disabled={refreshing}
              className="btn-primary flex items-center"
            >
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="card mb-8 bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">How AI Matching Works</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Cause Matching (35%)</span>
                <p className="text-blue-600">Aligns charities with causes you care about</p>
              </div>
              <div>
                <span className="font-medium">Location (20%)</span>
                <p className="text-blue-600">Prioritizes your preferred geographic regions</p>
              </div>
              <div>
                <span className="font-medium">Budget Fit (15%)</span>
                <p className="text-blue-600">Matches charities within your donation range</p>
              </div>
              <div>
                <span className="font-medium">Verification (10%)</span>
                <p className="text-blue-600">Boosts verified and 80G certified organizations</p>
              </div>
              <div>
                <span className="font-medium">Rating (10%)</span>
                <p className="text-blue-600">Considers community ratings and reviews</p>
              </div>
              <div>
                <span className="font-medium">Activity (5%)</span>
                <p className="text-blue-600">Prioritizes actively operating charities</p>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-4">
              Update your <Link to="/donor/profile" className="underline">profile preferences</Link> to improve recommendations
            </p>
          </div>
        )}

        {/* Recommendations */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="spinner mb-4" />
              <p className="text-gray-500">Analyzing your preferences...</p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <>
            {/* High Match Section */}
            {recommendations.filter(r => r.matchScore >= 80).length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Excellent Matches (80%+)
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations
                    .filter(r => r.matchScore >= 80)
                    .map((rec) => (
                      <div key={rec.charity._id} className="relative">
                        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(rec.matchScore)}`}>
                          {Math.round(rec.matchScore)}% Match
                        </div>
                        <CharityCard charity={rec.charity} />
                        {rec.matchReasons && (
                          <div className="mt-2 px-4">
                            <p className="text-xs text-gray-500">
                              Matched on: {rec.matchReasons.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Good Match Section */}
            {recommendations.filter(r => r.matchScore >= 60 && r.matchScore < 80).length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Good Matches (60-79%)
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations
                    .filter(r => r.matchScore >= 60 && r.matchScore < 80)
                    .map((rec) => (
                      <div key={rec.charity._id} className="relative">
                        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(rec.matchScore)}`}>
                          {Math.round(rec.matchScore)}% Match
                        </div>
                        <CharityCard charity={rec.charity} />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Other Recommendations */}
            {recommendations.filter(r => r.matchScore < 60).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Other Suggestions
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations
                    .filter(r => r.matchScore < 60)
                    .map((rec) => (
                      <div key={rec.charity._id} className="relative">
                        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(rec.matchScore)}`}>
                          {Math.round(rec.matchScore)}% Match
                        </div>
                        <CharityCard charity={rec.charity} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-16">
            <FiSliders className="mx-auto text-gray-300 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Personalized Recommendations Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete your profile with your preferred causes and locations to get AI-powered charity recommendations tailored to you.
            </p>
            <Link to="/donor/profile" className="btn-primary">
              Complete Your Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
