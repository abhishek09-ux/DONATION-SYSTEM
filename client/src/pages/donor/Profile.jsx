import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHeart, FiSave, FiCheck } from 'react-icons/fi';
import { donorAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CAUSES = [
  'education', 'healthcare', 'poverty_alleviation', 'environment',
  'animal_welfare', 'disaster_relief', 'women_empowerment', 'child_welfare',
  'elderly_care', 'rural_development', 'arts_culture', 'sports'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal'
];

const DonorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    phone: '',
    address: {
      city: '',
      state: '',
      pincode: ''
    },
    preferences: {
      causes: [],
      preferredLocations: [],
      minDonation: 100,
      maxDonation: 50000
    },
    taxInfo: {
      panNumber: ''
    },
    receiveUpdates: true,
    showPublicly: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await donorAPI.getProfile();
      if (res.data.data) {
        setProfile(prev => ({
          ...prev,
          ...res.data.data,
          preferences: { ...prev.preferences, ...res.data.data.preferences },
          address: { ...prev.address, ...res.data.data.address },
          taxInfo: { ...prev.taxInfo, ...res.data.data.taxInfo }
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await donorAPI.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleCause = (cause) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        causes: prev.preferences.causes.includes(cause)
          ? prev.preferences.causes.filter(c => c !== cause)
          : [...prev.preferences.causes, cause]
      }
    }));
  };

  const toggleLocation = (location) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredLocations: prev.preferences.preferredLocations.includes(location)
          ? prev.preferences.preferredLocations.filter(l => l !== location)
          : [...prev.preferences.preferredLocations, location]
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">Manage your preferences to get better charity recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiUser className="mr-2" /> Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  placeholder="How you want to appear"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiMapPin className="mr-2" /> Address
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  className="input"
                  value={profile.address.city}
                  onChange={(e) => setProfile({
                    ...profile,
                    address: { ...profile.address, city: e.target.value }
                  })}
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  className="input"
                  value={profile.address.state}
                  onChange={(e) => setProfile({
                    ...profile,
                    address: { ...profile.address, state: e.target.value }
                  })}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                <input
                  type="text"
                  className="input"
                  value={profile.address.pincode}
                  onChange={(e) => setProfile({
                    ...profile,
                    address: { ...profile.address, pincode: e.target.value }
                  })}
                  placeholder="XXXXXX"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Cause Preferences */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <FiHeart className="mr-2" /> Causes You Care About
            </h2>
            <p className="text-gray-500 text-sm mb-6">Select causes to get personalized charity recommendations</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {CAUSES.map(cause => (
                <button
                  key={cause}
                  type="button"
                  onClick={() => toggleCause(cause)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    profile.preferences.causes.includes(cause)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {profile.preferences.causes.includes(cause) && (
                    <FiCheck className="inline mr-1" />
                  )}
                  {cause.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Location Preferences */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <FiMapPin className="mr-2" /> Preferred Locations
            </h2>
            <p className="text-gray-500 text-sm mb-6">Select states where you'd like your donations to make impact</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INDIAN_STATES.map(state => (
                <button
                  key={state}
                  type="button"
                  onClick={() => toggleLocation(state)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    profile.preferences.preferredLocations.includes(state)
                      ? 'bg-primary-100 text-primary-700 border-primary-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Donation Range */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Donation Preferences</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Donation (₹)
                </label>
                <input
                  type="number"
                  className="input"
                  value={profile.preferences.minDonation}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, minDonation: parseInt(e.target.value) || 0 }
                  })}
                  min={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Donation (₹)
                </label>
                <input
                  type="number"
                  className="input"
                  value={profile.preferences.maxDonation}
                  onChange={(e) => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, maxDonation: parseInt(e.target.value) || 0 }
                  })}
                  min={100}
                />
              </div>
            </div>
          </div>

          {/* Tax Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Tax Information</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                className="input uppercase"
                value={profile.taxInfo.panNumber}
                onChange={(e) => setProfile({
                  ...profile,
                  taxInfo: { ...profile.taxInfo, panNumber: e.target.value.toUpperCase() }
                })}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-2">
                Required for 80G tax benefits. Your PAN will be kept secure.
              </p>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary-600 rounded"
                  checked={profile.receiveUpdates}
                  onChange={(e) => setProfile({ ...profile, receiveUpdates: e.target.checked })}
                />
                <span className="ml-3 text-gray-700">
                  Receive email updates about charities and donation impact
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary-600 rounded"
                  checked={profile.showPublicly}
                  onChange={(e) => setProfile({ ...profile, showPublicly: e.target.checked })}
                />
                <span className="ml-3 text-gray-700">
                  Show my name on charity pages when I donate
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-8 py-3 flex items-center"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorProfile;
