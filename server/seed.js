const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const Charity = require('./models/Charity');
const DonorProfile = require('./models/DonorProfile');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Charity.deleteMany({});
    await DonorProfile.deleteMany({});
    console.log('Cleared existing data');

    // Create charity users
    const charityUsers = [
      { email: 'hope@example.com', password: 'password123', name: 'Hope Foundation Admin', role: 'charity' },
      { email: 'education@example.com', password: 'password123', name: 'Vidya Foundation Admin', role: 'charity' },
      { email: 'health@example.com', password: 'password123', name: 'Swasthya Health Admin', role: 'charity' },
      { email: 'environment@example.com', password: 'password123', name: 'Green Earth Admin', role: 'charity' },
      { email: 'animals@example.com', password: 'password123', name: 'Animal Rescue Admin', role: 'charity' },
    ];

    const createdUsers = [];
    for (const userData of charityUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('Created charity users');

    // Sample charities data
    const charities = [
      {
        user: createdUsers[0]._id,
        organizationName: 'Hope Foundation India',
        registrationNumber: 'NGO/MH/2010/12345',
        description: 'Hope Foundation works to uplift underprivileged children by providing education, nutrition, and healthcare. We believe every child deserves a chance to dream and achieve.',
        mission: 'To empower underprivileged children through education and holistic development.',
        vision: 'A world where every child has equal opportunities to succeed.',
        causes: ['education', 'child_welfare', 'poverty_alleviation'],
        location: { address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', coordinates: { latitude: 19.076, longitude: 72.8777 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2020/12345',
        foundedYear: 2010,
        website: 'https://hopefoundation.org',
        contactEmail: 'contact@hopefoundation.org',
        contactPhone: '+91 9876543210',
        rating: { average: 4.8, count: 156 },
        minimumDonation: 500,
        stats: { totalDonationsReceived: 2500000, totalDonors: 450, beneficiariesHelped: 5000 },
        fundingNeeds: { totalRequired: 5000000, totalRaised: 2500000 }
      },
      {
        user: createdUsers[1]._id,
        organizationName: 'Vidya Education Trust',
        registrationNumber: 'NGO/RJ/2015/67890',
        description: 'Vidya Education Trust provides quality education to children from rural areas. We run schools, provide scholarships, and support first-generation learners.',
        mission: 'Making quality education accessible to every child in rural India.',
        vision: 'An educated and empowered rural India.',
        causes: ['education', 'rural_development', 'women_empowerment'],
        location: { address: '45 Gandhi Nagar', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', coordinates: { latitude: 26.9124, longitude: 75.7873 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2019/67890',
        foundedYear: 2015,
        website: 'https://vidyatrust.org',
        contactEmail: 'info@vidyatrust.org',
        contactPhone: '+91 9876543211',
        rating: { average: 4.6, count: 89 },
        minimumDonation: 100,
        stats: { totalDonationsReceived: 1800000, totalDonors: 320, beneficiariesHelped: 3500 },
        fundingNeeds: { totalRequired: 3000000, totalRaised: 1800000 }
      },
      {
        user: createdUsers[2]._id,
        organizationName: 'Swasthya Health Initiative',
        registrationNumber: 'NGO/DL/2012/11111',
        description: 'Swasthya provides free healthcare services to underserved communities. We run mobile health clinics, conduct health camps, and provide medicines to those in need.',
        mission: 'Healthcare for all, regardless of economic status.',
        vision: 'A healthy India where no one is denied medical care due to poverty.',
        causes: ['health', 'poverty_alleviation', 'elderly_care'],
        location: { address: '78 Civil Lines', city: 'Delhi', state: 'Delhi', pincode: '110001', coordinates: { latitude: 28.6139, longitude: 77.209 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2018/11111',
        fcraRegistered: true,
        fcraNumber: 'FCRA/2020/22222',
        foundedYear: 2012,
        website: 'https://swasthya.org',
        contactEmail: 'help@swasthya.org',
        contactPhone: '+91 9876543212',
        rating: { average: 4.9, count: 234 },
        minimumDonation: 200,
        stats: { totalDonationsReceived: 4200000, totalDonors: 680, beneficiariesHelped: 15000 },
        fundingNeeds: { totalRequired: 8000000, totalRaised: 4200000 }
      },
      {
        user: createdUsers[3]._id,
        organizationName: 'Green Earth Foundation',
        registrationNumber: 'NGO/KA/2008/33333',
        description: 'Green Earth works on environmental conservation, tree plantation drives, and spreading awareness about climate change. We have planted over 1 million trees across India.',
        mission: 'To protect and restore natural ecosystems.',
        vision: 'A greener, sustainable planet for future generations.',
        causes: ['environment', 'rural_development'],
        location: { address: '22 Green Park', city: 'Bangalore', state: 'Karnataka', pincode: '560001', coordinates: { latitude: 12.9716, longitude: 77.5946 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2017/33333',
        foundedYear: 2008,
        website: 'https://greenearth.org.in',
        contactEmail: 'contact@greenearth.org.in',
        contactPhone: '+91 9876543213',
        rating: { average: 4.7, count: 178 },
        minimumDonation: 250,
        stats: { totalDonationsReceived: 3100000, totalDonors: 520, beneficiariesHelped: 100000 },
        fundingNeeds: { totalRequired: 5000000, totalRaised: 3100000 }
      },
      {
        user: createdUsers[4]._id,
        organizationName: 'Paws & Claws Animal Rescue',
        registrationNumber: 'NGO/TN/2014/44444',
        description: 'Paws & Claws rescues, rehabilitates, and rehomes stray and abandoned animals. We run shelters, conduct sterilization drives, and provide veterinary care.',
        mission: 'To rescue and care for animals in need.',
        vision: 'A compassionate world where no animal suffers.',
        causes: ['animal_welfare'],
        location: { address: '56 Lake View Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', coordinates: { latitude: 13.0827, longitude: 80.2707 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2016/44444',
        foundedYear: 2014,
        website: 'https://pawsclaws.org',
        contactEmail: 'rescue@pawsclaws.org',
        contactPhone: '+91 9876543214',
        rating: { average: 4.5, count: 145 },
        minimumDonation: 100,
        stats: { totalDonationsReceived: 980000, totalDonors: 280, beneficiariesHelped: 8000 },
        fundingNeeds: { totalRequired: 2000000, totalRaised: 980000 }
      }
    ];

    await Charity.insertMany(charities);
    console.log('Created sample charities');

    // Create a test donor
    const testDonor = new User({
      email: 'donor@example.com',
      password: 'password123',
      name: 'Test Donor',
      role: 'donor'
    });
    await testDonor.save();
    
    await DonorProfile.create({
      user: testDonor._id,
      preferences: {
        causes: ['education', 'health'],
        preferredLocations: ['Maharashtra', 'Delhi'],
        minDonation: 500,
        maxDonation: 10000
      }
    });
    console.log('Created test donor');

    // Create admin user
    const adminUser = new User({
      email: 'admin@daanmatch.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest accounts:');
    console.log('- Donor: donor@example.com / password123');
    console.log('- Admin: admin@daanmatch.com / admin123');
    console.log('- Charity: hope@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
