import { useState, useEffect } from 'react';
import { 
  FiSave, FiUpload, FiPlus, FiTrash2, FiMapPin, 
  FiGlobe, FiPhone, FiMail, FiFileText
} from 'react-icons/fi';
import { charityAPI } from '../../services/api';
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

const CharityProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    organizationName: '',
    description: '',
    mission: '',
    vision: '',
    registrationNumber: '',
    foundedYear: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    causes: [],
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    registration80G: '',
    fcraNumber: '',
    minimumDonation: 100,
    fundingNeeds: {
      totalRequired: 0,
      description: ''
    },
    activeProjects: []
  });

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    targetAmount: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await charityAPI.getProfile();
      if (res.data.data) {
        setProfile(prev => ({
          ...prev,
          ...res.data.data,
          location: { ...prev.location, ...res.data.data.location },
          fundingNeeds: { ...prev.fundingNeeds, ...res.data.data.fundingNeeds }
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
      await charityAPI.updateProfile(profile);
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
      causes: prev.causes.includes(cause)
        ? prev.causes.filter(c => c !== cause)
        : [...prev.causes, cause]
    }));
  };

  const addProject = () => {
    if (!newProject.title || !newProject.targetAmount) {
      toast.error('Please fill project title and target amount');
      return;
    }
    setProfile(prev => ({
      ...prev,
      activeProjects: [...prev.activeProjects, {
        ...newProject,
        targetAmount: parseInt(newProject.targetAmount),
        raisedAmount: 0
      }]
    }));
    setNewProject({ title: '', description: '', targetAmount: '' });
  };

  const removeProject = (index) => {
    setProfile(prev => ({
      ...prev,
      activeProjects: prev.activeProjects.filter((_, i) => i !== index)
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
          <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
          <p className="text-gray-600">Keep your profile updated to attract more donors</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.organizationName}
                  onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="input min-h-[120px]"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  placeholder="Tell donors about your organization..."
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                  <textarea
                    className="input"
                    value={profile.mission}
                    onChange={(e) => setProfile({ ...profile, mission: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
                  <textarea
                    className="input"
                    value={profile.vision}
                    onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={profile.foundedYear}
                    onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Causes */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Focus Areas *</h2>
            <p className="text-gray-500 text-sm mb-4">Select the causes your organization works on</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CAUSES.map(cause => (
                <button
                  key={cause}
                  type="button"
                  onClick={() => toggleCause(cause)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    profile.causes.includes(cause)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {cause.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiPhone className="mr-2" /> Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={profile.contactEmail}
                  onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={profile.contactPhone}
                  onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiMapPin className="mr-2" /> Location
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="input"
                  value={profile.location.address}
                  onChange={(e) => setProfile({
                    ...profile,
                    location: { ...profile.location, address: e.target.value }
                  })}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="input"
                    value={profile.location.city}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, city: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    className="input"
                    value={profile.location.state}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, state: e.target.value }
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
                    value={profile.location.pincode}
                    onChange={(e) => setProfile({
                      ...profile,
                      location: { ...profile.location, pincode: e.target.value }
                    })}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registration */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiFileText className="mr-2" /> Registration Details
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.registrationNumber}
                  onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  80G Certificate Number
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.registration80G}
                  onChange={(e) => setProfile({ ...profile, registration80G: e.target.value })}
                  placeholder="For tax exemption"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FCRA Number
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.fcraNumber}
                  onChange={(e) => setProfile({ ...profile, fcraNumber: e.target.value })}
                  placeholder="For foreign donations"
                />
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h2>
            
            {/* Existing Projects */}
            {profile.activeProjects.length > 0 && (
              <div className="space-y-3 mb-6">
                {profile.activeProjects.map((project, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-500">{project.description}</p>
                      <p className="text-sm text-primary-600 mt-1">
                        Target: ₹{project.targetAmount?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Project */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Add New Project</h4>
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  className="input"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Target Amount (₹)"
                  value={newProject.targetAmount}
                  onChange={(e) => setNewProject({ ...newProject, targetAmount: e.target.value })}
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="btn-outline flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Add Project
                </button>
              </div>
              <input
                type="text"
                className="input"
                placeholder="Project Description (optional)"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
          </div>

          {/* Funding Needs */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Funding Goal</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Required (₹)
                </label>
                <input
                  type="number"
                  className="input"
                  value={profile.fundingNeeds.totalRequired}
                  onChange={(e) => setProfile({
                    ...profile,
                    fundingNeeds: { ...profile.fundingNeeds, totalRequired: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Donation (₹)
                </label>
                <input
                  type="number"
                  className="input"
                  value={profile.minimumDonation}
                  onChange={(e) => setProfile({ ...profile, minimumDonation: parseInt(e.target.value) || 100 })}
                  min={100}
                />
              </div>
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

export default CharityProfile;
