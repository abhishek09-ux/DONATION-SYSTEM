import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
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

const CharityRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    description: '',
    mission: '',
    causes: [],
    foundedYear: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    registration80G: '',
    fcraNumber: '',
    minimumDonation: 500
  });

  const steps = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Causes & Mission' },
    { num: 3, title: 'Location' },
    { num: 4, title: 'Verification' }
  ];

  const handleSubmit = async () => {
    if (!formData.organizationName || !formData.description || formData.causes.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await charityAPI.registerCharity(formData);
      toast.success('Organization registered successfully!');
      navigate('/charity/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleCause = (cause) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.includes(cause)
        ? prev.causes.filter(c => c !== cause)
        : [...prev.causes, cause]
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.organizationName) {
      toast.error('Organization name is required');
      return;
    }
    if (step === 2 && formData.causes.length === 0) {
      toast.error('Select at least one cause');
      return;
    }
    setStep(s => Math.min(4, s + 1));
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register Your Organization</h1>
          <p className="text-gray-600 mt-2">Complete your profile to start receiving donations</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold
                ${step >= s.num 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : 'border-gray-300 text-gray-400'}`}
              >
                {step > s.num ? <FiCheck /> : s.num}
              </div>
              <span className={`ml-2 text-sm hidden md:block ${step >= s.num ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Enter your NGO/charity name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="NGO registration number"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    className="input"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Causes & Mission */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Causes & Mission</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="input min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell donors about your organization and what you do..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                <textarea
                  className="input"
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Causes You Work On *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CAUSES.map(cause => (
                    <button
                      key={cause}
                      type="button"
                      onClick={() => toggleCause(cause)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.causes.includes(cause)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {formData.causes.includes(cause) && <FiCheck className="inline mr-1" />}
                      {cause.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Location Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="input"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                  placeholder="Street address"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    className="input"
                    value={formData.location.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value }
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
                    value={formData.location.pincode}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, pincode: e.target.value }
                    })}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Verification & Tax Exemption</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-700">
                  80G and FCRA certificates help build donor trust and enable tax benefits. 
                  You can add these later if you don't have them now.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  80G Certificate Number
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.registration80G}
                  onChange={(e) => setFormData({ ...formData, registration80G: e.target.value })}
                  placeholder="For tax-exempt donations"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FCRA Registration Number
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.fcraNumber}
                  onChange={(e) => setFormData({ ...formData, fcraNumber: e.target.value })}
                  placeholder="Required for foreign donations"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Donation Amount (₹)
                </label>
                <input
                  type="number"
                  className="input"
                  value={formData.minimumDonation}
                  onChange={(e) => setFormData({ ...formData, minimumDonation: parseInt(e.target.value) || 100 })}
                  min={100}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button onClick={prevStep} className="btn-outline flex items-center">
                <FiArrowLeft className="mr-2" /> Back
              </button>
            ) : (
              <div />
            )}
            
            {step < 4 ? (
              <button onClick={nextStep} className="btn-primary flex items-center">
                Next <FiArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" /> Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityRegister;
