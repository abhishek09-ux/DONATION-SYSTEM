/**
 * AI Matching Algorithm for Donation System
 * Uses weighted scoring to match donors with charities
 */

const DonorProfile = require('../models/DonorProfile');
const Charity = require('../models/Charity');

// Weights for different matching factors
const WEIGHTS = {
  CAUSE_MATCH: 35,      // Matching causes/interests
  LOCATION: 20,         // Geographic proximity
  BUDGET: 15,           // Budget compatibility
  VERIFICATION: 10,     // Charity verification status
  RATING: 10,           // Charity rating
  ACTIVITY: 5,          // Charity activity level
  IMPACT: 5             // Impact score
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate cause matching score
 */
function calculateCauseScore(donorInterests, charityCauses) {
  if (!donorInterests?.length || !charityCauses?.length) return 0;
  
  const matchingCauses = donorInterests.filter(interest => 
    charityCauses.includes(interest)
  );
  
  // Higher score for more matches
  const matchRatio = matchingCauses.length / Math.max(donorInterests.length, 1);
  return matchRatio * WEIGHTS.CAUSE_MATCH;
}

/**
 * Calculate location score
 */
function calculateLocationScore(donorLocation, charityLocation, preferredDistance) {
  if (!donorLocation?.coordinates || !charityLocation?.coordinates) {
    // If no coordinates, match by city/state
    if (donorLocation?.city === charityLocation?.city) return WEIGHTS.LOCATION;
    if (donorLocation?.state === charityLocation?.state) return WEIGHTS.LOCATION * 0.5;
    return 0;
  }
  
  const distance = calculateDistance(
    donorLocation.coordinates.lat,
    donorLocation.coordinates.lng,
    charityLocation.coordinates.lat,
    charityLocation.coordinates.lng
  );
  
  const maxDistance = preferredDistance || 100; // Default 100km
  
  if (distance <= maxDistance) {
    // Linear decay based on distance
    return WEIGHTS.LOCATION * (1 - distance / maxDistance);
  }
  
  return 0;
}

/**
 * Calculate budget compatibility score
 */
function calculateBudgetScore(donorBudget, charityMinDonation) {
  if (!donorBudget) return WEIGHTS.BUDGET * 0.5; // Neutral if no budget set
  
  if (donorBudget >= charityMinDonation) {
    return WEIGHTS.BUDGET;
  }
  
  // Partial score if close to minimum
  const ratio = donorBudget / charityMinDonation;
  return WEIGHTS.BUDGET * Math.min(ratio, 1);
}

/**
 * Calculate verification score
 */
function calculateVerificationScore(verificationStatus, is80G, fcra) {
  let score = 0;
  
  if (verificationStatus === 'verified') score += WEIGHTS.VERIFICATION * 0.6;
  if (is80G) score += WEIGHTS.VERIFICATION * 0.2;
  if (fcra) score += WEIGHTS.VERIFICATION * 0.2;
  
  return score;
}

/**
 * Calculate rating score
 */
function calculateRatingScore(rating) {
  if (!rating?.average) return WEIGHTS.RATING * 0.5;
  
  // Normalize to 0-1 (assuming 5-star rating)
  return WEIGHTS.RATING * (rating.average / 5);
}

/**
 * Calculate activity score based on recent donations and updates
 */
function calculateActivityScore(charity) {
  let score = 0;
  
  // Has active projects
  const activeProjects = charity.activeProjects?.filter(p => p.status === 'active') || [];
  if (activeProjects.length > 0) score += WEIGHTS.ACTIVITY * 0.5;
  
  // Has recent impact reports
  const recentReports = charity.impactReports?.filter(r => {
    const reportDate = new Date(r.date);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return reportDate >= sixMonthsAgo;
  }) || [];
  
  if (recentReports.length > 0) score += WEIGHTS.ACTIVITY * 0.5;
  
  return score;
}

/**
 * Calculate overall match score
 */
function calculateMatchScore(donor, charity) {
  const scores = {
    cause: calculateCauseScore(donor.interests, charity.causes),
    location: calculateLocationScore(
      donor.location, 
      charity.location, 
      donor.preferredDistanceKm
    ),
    budget: calculateBudgetScore(donor.monthlyBudget, charity.minimumDonation),
    verification: calculateVerificationScore(
      charity.verificationStatus,
      charity.is80GRegistered,
      charity.fcraRegistered
    ),
    rating: calculateRatingScore(charity.rating),
    activity: calculateActivityScore(charity)
  };
  
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  return {
    totalScore: Math.round(totalScore),
    breakdown: scores,
    matchPercentage: Math.round(totalScore)
  };
}

/**
 * Get top matching charities for a donor
 */
async function getMatchingCharities(donorId, options = {}) {
  const {
    limit = 5,
    minScore = 0,
    causes = null,
    city = null,
    state = null
  } = options;
  
  // Get donor profile
  const donorProfile = await DonorProfile.findOne({ user: donorId });
  
  if (!donorProfile) {
    throw new Error('Donor profile not found');
  }
  
  // Build charity query
  const charityQuery = {
    verificationStatus: 'verified'
  };
  
  // Apply filters
  if (causes?.length) {
    charityQuery.causes = { $in: causes };
  } else if (donorProfile.interests?.length) {
    // Prefer charities matching donor interests
    charityQuery.causes = { $in: donorProfile.interests };
  }
  
  if (city) {
    charityQuery['location.city'] = new RegExp(city, 'i');
  }
  
  if (state) {
    charityQuery['location.state'] = new RegExp(state, 'i');
  }
  
  // Get charities
  let charities = await Charity.find(charityQuery)
    .populate('user', 'name email')
    .select('-bankDetails -documents');
  
  // If no charities found with strict filter, broaden search
  if (charities.length === 0) {
    charities = await Charity.find({ verificationStatus: 'verified' })
      .populate('user', 'name email')
      .select('-bankDetails -documents');
  }
  
  // Calculate match scores
  const matchResults = charities.map(charity => {
    const matchData = calculateMatchScore(donorProfile, charity);
    return {
      charity: charity.toObject(),
      ...matchData
    };
  });
  
  // Sort by score and filter
  const sortedResults = matchResults
    .filter(result => result.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
  
  return sortedResults;
}

/**
 * Get quick recommendations without full matching
 */
async function getQuickRecommendations(donorInterests, limit = 3) {
  const query = {
    verificationStatus: 'verified'
  };
  
  if (donorInterests?.length) {
    query.causes = { $in: donorInterests };
  }
  
  const charities = await Charity.find(query)
    .sort({ 'rating.average': -1, 'stats.totalDonationsReceived': -1 })
    .limit(limit)
    .select('organizationName logo causes location rating fundingNeeds');
  
  return charities;
}

/**
 * Find similar charities
 */
async function findSimilarCharities(charityId, limit = 5) {
  const charity = await Charity.findById(charityId);
  
  if (!charity) {
    throw new Error('Charity not found');
  }
  
  const similarCharities = await Charity.find({
    _id: { $ne: charityId },
    verificationStatus: 'verified',
    $or: [
      { causes: { $in: charity.causes } },
      { 'location.state': charity.location?.state }
    ]
  })
  .sort({ 'rating.average': -1 })
  .limit(limit)
  .select('organizationName logo causes location rating');
  
  return similarCharities;
}

module.exports = {
  calculateMatchScore,
  getMatchingCharities,
  getQuickRecommendations,
  findSimilarCharities,
  calculateDistance,
  WEIGHTS
};
