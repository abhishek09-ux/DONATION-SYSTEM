const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const Charity = require('./models/Charity');
const DonorProfile = require('./models/DonorProfile');
const Campaign = require('./models/Campaign');

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
    await Campaign.deleteMany({});
    console.log('Cleared existing data');

    // Create charity users (15 total)
    const charityUsers = [
      { email: 'hope@example.com', password: 'password123', name: 'Hope Foundation Admin', role: 'charity' },
      { email: 'education@example.com', password: 'password123', name: 'Vidya Foundation Admin', role: 'charity' },
      { email: 'health@example.com', password: 'password123', name: 'Swasthya Health Admin', role: 'charity' },
      { email: 'environment@example.com', password: 'password123', name: 'Green Earth Admin', role: 'charity' },
      { email: 'animals@example.com', password: 'password123', name: 'Animal Rescue Admin', role: 'charity' },
      { email: 'women@example.com', password: 'password123', name: 'Shakti Women Admin', role: 'charity' },
      { email: 'elderly@example.com', password: 'password123', name: 'Silver Care Admin', role: 'charity' },
      { email: 'disaster@example.com', password: 'password123', name: 'Rapid Relief Admin', role: 'charity' },
      { email: 'rural@example.com', password: 'password123', name: 'Gramin Vikas Admin', role: 'charity' },
      { email: 'disability@example.com', password: 'password123', name: 'Samarthan Admin', role: 'charity' },
      { email: 'cancer@example.com', password: 'password123', name: 'Cancer Care Admin', role: 'charity' },
      { email: 'blind@example.com', password: 'password123', name: 'Vision Foundation Admin', role: 'charity' },
      { email: 'hunger@example.com', password: 'password123', name: 'Annapurna Admin', role: 'charity' },
      { email: 'water@example.com', password: 'password123', name: 'Jal Foundation Admin', role: 'charity' },
      { email: 'skill@example.com', password: 'password123', name: 'Kaushal Bharat Admin', role: 'charity' },
    ];

    const createdUsers = [];
    for (const userData of charityUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('Created charity users');

    // Sample charities data (15 charities)
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
      },
      // NEW CHARITIES
      {
        user: createdUsers[5]._id,
        organizationName: 'Shakti Women Empowerment',
        registrationNumber: 'NGO/UP/2011/55555',
        description: 'Shakti empowers women through vocational training, financial literacy, and self-help groups. We help women become entrepreneurs and break the cycle of poverty.',
        mission: 'Empowering women to become financially independent.',
        vision: 'A society where every woman is self-reliant and respected.',
        causes: ['women_empowerment', 'poverty_alleviation', 'education'],
        location: { address: '34 Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010', coordinates: { latitude: 26.8467, longitude: 80.9462 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2018/55555',
        foundedYear: 2011,
        website: 'https://shaktiwomen.org',
        contactEmail: 'support@shaktiwomen.org',
        contactPhone: '+91 9876543215',
        rating: { average: 4.7, count: 198 },
        minimumDonation: 300,
        stats: { totalDonationsReceived: 2800000, totalDonors: 410, beneficiariesHelped: 12000 },
        fundingNeeds: { totalRequired: 4500000, totalRaised: 2800000 }
      },
      {
        user: createdUsers[6]._id,
        organizationName: 'Silver Care Foundation',
        registrationNumber: 'NGO/GJ/2013/66666',
        description: 'Silver Care provides shelter, medical care, and companionship to abandoned elderly. We run old-age homes and day-care centers for senior citizens.',
        mission: 'Ensuring dignity and care for every senior citizen.',
        vision: 'No elderly person should feel abandoned or alone.',
        causes: ['elderly_care', 'health'],
        location: { address: '89 Satellite Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', coordinates: { latitude: 23.0225, longitude: 72.5714 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2017/66666',
        foundedYear: 2013,
        website: 'https://silvercare.org.in',
        contactEmail: 'care@silvercare.org.in',
        contactPhone: '+91 9876543216',
        rating: { average: 4.8, count: 167 },
        minimumDonation: 500,
        stats: { totalDonationsReceived: 1950000, totalDonors: 290, beneficiariesHelped: 2500 },
        fundingNeeds: { totalRequired: 3500000, totalRaised: 1950000 }
      },
      {
        user: createdUsers[7]._id,
        organizationName: 'Rapid Relief India',
        registrationNumber: 'NGO/OR/2009/77777',
        description: 'Rapid Relief provides immediate assistance during natural disasters. We specialize in flood relief, cyclone response, and earthquake rehabilitation.',
        mission: 'First responders for disaster-affected communities.',
        vision: 'Building resilient communities that recover faster from disasters.',
        causes: ['disaster_relief', 'poverty_alleviation'],
        location: { address: '12 Bhubaneswar Road', city: 'Bhubaneswar', state: 'Odisha', pincode: '751001', coordinates: { latitude: 20.2961, longitude: 85.8245 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2015/77777',
        fcraRegistered: true,
        fcraNumber: 'FCRA/2018/77777',
        foundedYear: 2009,
        website: 'https://rapidrelief.org',
        contactEmail: 'help@rapidrelief.org',
        contactPhone: '+91 9876543217',
        rating: { average: 4.9, count: 312 },
        minimumDonation: 100,
        stats: { totalDonationsReceived: 8500000, totalDonors: 1200, beneficiariesHelped: 50000 },
        fundingNeeds: { totalRequired: 15000000, totalRaised: 8500000 }
      },
      {
        user: createdUsers[8]._id,
        organizationName: 'Gramin Vikas Sansthan',
        registrationNumber: 'NGO/MP/2007/88888',
        description: 'Gramin Vikas works on rural development through sustainable agriculture, water conservation, and livelihood creation for farmers.',
        mission: 'Transforming rural India through sustainable development.',
        vision: 'Prosperous villages where farmers thrive.',
        causes: ['rural_development', 'environment', 'poverty_alleviation'],
        location: { address: '67 MP Nagar', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462011', coordinates: { latitude: 23.2599, longitude: 77.4126 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2014/88888',
        foundedYear: 2007,
        website: 'https://graminvikas.org',
        contactEmail: 'info@graminvikas.org',
        contactPhone: '+91 9876543218',
        rating: { average: 4.6, count: 143 },
        minimumDonation: 200,
        stats: { totalDonationsReceived: 3200000, totalDonors: 380, beneficiariesHelped: 25000 },
        fundingNeeds: { totalRequired: 6000000, totalRaised: 3200000 }
      },
      {
        user: createdUsers[9]._id,
        organizationName: 'Samarthan Disability Support',
        registrationNumber: 'NGO/PB/2012/99999',
        description: 'Samarthan provides educational support, skill training, and assistive devices to persons with disabilities. We advocate for inclusive society.',
        mission: 'Enabling differently-abled individuals to live with dignity.',
        vision: 'An inclusive India where disability is not inability.',
        causes: ['child_welfare', 'education', 'health'],
        location: { address: '45 Sector 17', city: 'Chandigarh', state: 'Punjab', pincode: '160017', coordinates: { latitude: 30.7333, longitude: 76.7794 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2016/99999',
        foundedYear: 2012,
        website: 'https://samarthan.org',
        contactEmail: 'support@samarthan.org',
        contactPhone: '+91 9876543219',
        rating: { average: 4.8, count: 189 },
        minimumDonation: 250,
        stats: { totalDonationsReceived: 2100000, totalDonors: 350, beneficiariesHelped: 4500 },
        fundingNeeds: { totalRequired: 4000000, totalRaised: 2100000 }
      },
      {
        user: createdUsers[10]._id,
        organizationName: 'Cancer Care Trust',
        registrationNumber: 'NGO/WB/2010/10101',
        description: 'Cancer Care provides financial assistance for cancer treatment, palliative care, and emotional support to patients and families fighting cancer.',
        mission: 'No one should face cancer alone or without treatment.',
        vision: 'Accessible cancer care for all Indians.',
        causes: ['health', 'poverty_alleviation'],
        location: { address: '23 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016', coordinates: { latitude: 22.5726, longitude: 88.3639 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2015/10101',
        fcraRegistered: true,
        fcraNumber: 'FCRA/2019/10101',
        foundedYear: 2010,
        website: 'https://cancercare.org.in',
        contactEmail: 'help@cancercare.org.in',
        contactPhone: '+91 9876543220',
        rating: { average: 4.9, count: 278 },
        minimumDonation: 500,
        stats: { totalDonationsReceived: 6500000, totalDonors: 890, beneficiariesHelped: 3200 },
        fundingNeeds: { totalRequired: 12000000, totalRaised: 6500000 }
      },
      {
        user: createdUsers[11]._id,
        organizationName: 'Vision Foundation India',
        registrationNumber: 'NGO/AP/2011/20202',
        description: 'Vision Foundation provides free eye care, surgeries, and sight restoration to the visually impaired. We have performed over 50,000 cataract surgeries.',
        mission: 'Restoring sight and hope to the visually impaired.',
        vision: 'A world where no one is blind due to curable conditions.',
        causes: ['health', 'poverty_alleviation'],
        location: { address: '78 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', coordinates: { latitude: 17.385, longitude: 78.4867 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2016/20202',
        foundedYear: 2011,
        website: 'https://visionfoundation.org.in',
        contactEmail: 'info@visionfoundation.org.in',
        contactPhone: '+91 9876543221',
        rating: { average: 4.7, count: 234 },
        minimumDonation: 200,
        stats: { totalDonationsReceived: 4800000, totalDonors: 620, beneficiariesHelped: 52000 },
        fundingNeeds: { totalRequired: 8000000, totalRaised: 4800000 }
      },
      {
        user: createdUsers[12]._id,
        organizationName: 'Annapurna Hunger Relief',
        registrationNumber: 'NGO/KL/2014/30303',
        description: 'Annapurna runs community kitchens and food distribution programs to fight hunger. We serve over 10,000 meals daily to the homeless and poor.',
        mission: 'Ending hunger, one meal at a time.',
        vision: 'An India where no one goes to bed hungry.',
        causes: ['poverty_alleviation', 'child_welfare'],
        location: { address: '34 MG Road', city: 'Kochi', state: 'Kerala', pincode: '682011', coordinates: { latitude: 9.9312, longitude: 76.2673 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2018/30303',
        foundedYear: 2014,
        website: 'https://annapurna.org.in',
        contactEmail: 'meals@annapurna.org.in',
        contactPhone: '+91 9876543222',
        rating: { average: 4.8, count: 345 },
        minimumDonation: 50,
        stats: { totalDonationsReceived: 3600000, totalDonors: 950, beneficiariesHelped: 185000 },
        fundingNeeds: { totalRequired: 6000000, totalRaised: 3600000 }
      },
      {
        user: createdUsers[13]._id,
        organizationName: 'Jal Foundation',
        registrationNumber: 'NGO/HR/2013/40404',
        description: 'Jal Foundation works on water conservation, building wells, and providing clean drinking water to villages facing water scarcity.',
        mission: 'Clean water access for every village in India.',
        vision: 'No village should suffer from water scarcity.',
        causes: ['environment', 'rural_development', 'health'],
        location: { address: '56 Sector 14', city: 'Gurgaon', state: 'Haryana', pincode: '122001', coordinates: { latitude: 28.4595, longitude: 77.0266 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2017/40404',
        foundedYear: 2013,
        website: 'https://jalfoundation.org',
        contactEmail: 'water@jalfoundation.org',
        contactPhone: '+91 9876543223',
        rating: { average: 4.7, count: 198 },
        minimumDonation: 300,
        stats: { totalDonationsReceived: 5200000, totalDonors: 480, beneficiariesHelped: 120000 },
        fundingNeeds: { totalRequired: 10000000, totalRaised: 5200000 }
      },
      {
        user: createdUsers[14]._id,
        organizationName: 'Kaushal Bharat Foundation',
        registrationNumber: 'NGO/BR/2016/50505',
        description: 'Kaushal Bharat provides skill training and employment placement for unemployed youth. We offer courses in IT, hospitality, and manufacturing.',
        mission: 'Skilling youth for a better tomorrow.',
        vision: 'Every Indian youth empowered with employable skills.',
        causes: ['education', 'poverty_alleviation', 'women_empowerment'],
        location: { address: '89 Bailey Road', city: 'Patna', state: 'Bihar', pincode: '800001', coordinates: { latitude: 25.5941, longitude: 85.1376 } },
        verificationStatus: 'verified',
        is80GRegistered: true,
        registration80G: '80G/2019/50505',
        foundedYear: 2016,
        website: 'https://kaushalbharat.org',
        contactEmail: 'learn@kaushalbharat.org',
        contactPhone: '+91 9876543224',
        rating: { average: 4.6, count: 156 },
        minimumDonation: 200,
        stats: { totalDonationsReceived: 1800000, totalDonors: 280, beneficiariesHelped: 8500 },
        fundingNeeds: { totalRequired: 3500000, totalRaised: 1800000 }
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

    // Create sample campaigns
    const createdCharities = await Charity.find();
    const campaigns = [
      {
        title: 'Kerala Flood Relief 2026',
        description: 'Massive floods have devastated Kerala affecting over 50,000 families. Help us provide emergency relief including food, clean water, medicines, and temporary shelters. Every donation directly reaches the affected families through our ground volunteers.',
        shortDescription: 'Emergency flood relief for 50,000 affected families in Kerala',
        charity: createdCharities[7]._id, // Rapid Relief India
        createdBy: createdUsers[7]._id,
        goalAmount: 5000000,
        raisedAmount: 3250000,
        donorCount: 1847,
        category: 'disaster-relief',
        coverImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-03-15'),
        status: 'active',
        featured: true,
        updates: [
          { title: 'Relief materials distributed', content: 'We have distributed relief kits to 15,000 families so far.', postedAt: new Date('2026-01-25') },
          { title: 'Medical camps setup', content: '10 medical camps are now operational across affected districts.', postedAt: new Date('2026-02-01') }
        ]
      },
      {
        title: 'Heart Surgery for 50 Children',
        description: 'Help us save 50 children suffering from congenital heart defects. Each surgery costs approximately ₹2,50,000 and these families cannot afford the treatment. Your donation can give a child a second chance at life.',
        shortDescription: 'Fund life-saving heart surgeries for underprivileged children',
        charity: createdCharities[2]._id, // Swasthya Health
        createdBy: createdUsers[2]._id,
        goalAmount: 2500000,
        raisedAmount: 1875000,
        donorCount: 923,
        category: 'healthcare',
        coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-04-30'),
        status: 'active',
        featured: true,
        updates: [
          { title: '18 surgeries completed', content: 'Thanks to your support, 18 children have successfully undergone surgery.', postedAt: new Date('2026-02-05') }
        ],
        milestones: [
          { title: '10 surgeries', amount: 500000, reached: true },
          { title: '25 surgeries', amount: 1250000, reached: true },
          { title: '50 surgeries', amount: 2500000, reached: false }
        ]
      },
      {
        title: 'Build a School in Rural Bihar',
        description: 'Children in Madhubani district walk 8km daily to reach the nearest school. Help us build a proper school building with 10 classrooms, a library, computer lab, and playground. Education is the key to breaking the cycle of poverty.',
        shortDescription: 'Construct a school for 500+ children in rural Bihar',
        charity: createdCharities[1]._id, // Vidya Education Trust
        createdBy: createdUsers[1]._id,
        goalAmount: 1500000,
        raisedAmount: 890000,
        donorCount: 456,
        category: 'education',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-05-31'),
        status: 'active',
        featured: true,
        updates: [
          { title: 'Land acquired', content: 'We have successfully acquired 2 acres of land for the school.', postedAt: new Date('2026-01-10') },
          { title: 'Foundation laid', content: 'Foundation stone was laid with presence of village panchayat.', postedAt: new Date('2026-01-28') }
        ]
      },
      {
        title: 'Plant 10,000 Trees in Maharashtra',
        description: 'Join our massive reforestation campaign across drought-prone regions of Maharashtra. Each tree planted helps combat climate change, prevents soil erosion, and creates habitat for wildlife. Tree saplings will be planted and maintained for 3 years.',
        shortDescription: 'Combat climate change by planting 10,000 native trees',
        charity: createdCharities[3]._id, // Green Earth Foundation
        createdBy: createdUsers[3]._id,
        goalAmount: 500000,
        raisedAmount: 425000,
        donorCount: 1234,
        category: 'environment',
        coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        status: 'active',
        featured: false,
        updates: [
          { title: '7,500 saplings planted', content: 'Plantation drive completed in 5 villages with local community participation.', postedAt: new Date('2026-01-30') }
        ]
      },
      {
        title: 'Rescue & Shelter for 100 Stray Dogs',
        description: 'Help us rescue, vaccinate, sterilize, and shelter 100 stray dogs from the streets. Each dog receives medical treatment, nutritious food, and a safe place to stay while we find them forever homes.',
        shortDescription: 'Rescue and rehabilitate stray dogs from city streets',
        charity: createdCharities[4]._id, // Paws & Claws
        createdBy: createdUsers[4]._id,
        goalAmount: 300000,
        raisedAmount: 185000,
        donorCount: 567,
        category: 'animals',
        coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-04-10'),
        status: 'active',
        featured: false,
        updates: [
          { title: '45 dogs rescued', content: 'We have rescued 45 dogs so far, all vaccinated and healthy.', postedAt: new Date('2026-02-01') }
        ]
      },
      {
        title: 'Skill Training for 200 Women',
        description: 'Empower 200 women from underprivileged backgrounds with vocational skills in tailoring, beautician courses, and computer literacy. Each woman receives 6 months of training plus placement assistance to start earning.',
        shortDescription: 'Vocational training program for women empowerment',
        charity: createdCharities[5]._id, // Shakti Women
        createdBy: createdUsers[5]._id,
        goalAmount: 800000,
        raisedAmount: 520000,
        donorCount: 312,
        category: 'community',
        coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-07-31'),
        status: 'active',
        featured: false,
        updates: [
          { title: 'First batch graduated', content: '50 women completed training and 35 already placed in jobs.', postedAt: new Date('2026-02-05') }
        ]
      },
      {
        title: 'Clean Water Wells for 5 Villages',
        description: 'Five villages in Rajasthan face severe water scarcity. Women and children walk miles daily to fetch contaminated water. Help us dig bore wells and install hand pumps to provide clean drinking water to 3,000+ villagers.',
        shortDescription: 'Provide clean drinking water to drought-affected villages',
        charity: createdCharities[13]._id, // Jal Foundation
        createdBy: createdUsers[13]._id,
        goalAmount: 1200000,
        raisedAmount: 780000,
        donorCount: 445,
        category: 'community',
        coverImage: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800',
        startDate: new Date('2025-11-15'),
        endDate: new Date('2026-03-31'),
        status: 'active',
        featured: true,
        updates: [
          { title: '3 wells completed', content: 'Three villages now have access to clean water!', postedAt: new Date('2026-01-20') }
        ]
      },
      {
        title: 'Cancer Treatment Support Fund',
        description: 'Help us support 25 cancer patients from economically weaker sections who cannot afford treatment. Funds cover chemotherapy, radiation, medicines, and travel expenses for patients and caregivers.',
        shortDescription: 'Financial aid for cancer patients needing treatment',
        charity: createdCharities[10]._id, // Cancer Care Trust
        createdBy: createdUsers[10]._id,
        goalAmount: 2000000,
        raisedAmount: 1450000,
        donorCount: 678,
        category: 'healthcare',
        coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
        startDate: new Date('2025-12-15'),
        endDate: new Date('2026-06-15'),
        status: 'active',
        featured: false,
        updates: [
          { title: '12 patients receiving treatment', content: 'Treatment has begun for 12 patients across 4 hospitals.', postedAt: new Date('2026-01-15') }
        ]
      },
      {
        title: 'Free Eye Surgeries for 500 Elders',
        description: 'Cataract blindness is 100% curable but many elderly people cannot afford the ₹10,000 surgery cost. Help us restore vision to 500 senior citizens through free cataract surgeries.',
        shortDescription: 'Restore sight through free cataract surgeries',
        charity: createdCharities[11]._id, // Vision Foundation
        createdBy: createdUsers[11]._id,
        goalAmount: 500000,
        raisedAmount: 385000,
        donorCount: 534,
        category: 'healthcare',
        coverImage: 'https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-04-30'),
        status: 'active',
        featured: false,
        updates: [
          { title: '280 surgeries completed', content: 'Eye camps conducted in 8 villages, 280 surgeries done successfully.', postedAt: new Date('2026-02-01') }
        ]
      },
      {
        title: 'Daily Meals for 1000 Homeless',
        description: 'Help us provide two nutritious meals daily to 1000 homeless people in Kochi for 3 months. Our community kitchen ensures no one sleeps hungry. ₹30 feeds one person for a day.',
        shortDescription: 'Feed the homeless with nutritious daily meals',
        charity: createdCharities[12]._id, // Annapurna
        createdBy: createdUsers[12]._id,
        goalAmount: 270000,
        raisedAmount: 195000,
        donorCount: 423,
        category: 'community',
        coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        status: 'active',
        featured: false
      },
      {
        title: 'Digital Education Lab for Rural School',
        description: 'Set up a computer lab with 20 computers, projector, and internet connectivity in a government school serving 800 tribal students. Bridge the digital divide and prepare students for the future.',
        shortDescription: 'Computer lab setup for tribal school students',
        charity: createdCharities[0]._id, // Hope Foundation
        createdBy: createdUsers[0]._id,
        goalAmount: 600000,
        raisedAmount: 320000,
        donorCount: 234,
        category: 'education',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-05-15'),
        status: 'active',
        featured: false
      },
      {
        title: 'Wheelchairs for 100 Disabled',
        description: 'Provide custom-fitted wheelchairs to 100 physically disabled individuals who cannot afford mobility aids. Each wheelchair restores independence and dignity.',
        shortDescription: 'Mobility aids for physically disabled individuals',
        charity: createdCharities[9]._id, // Samarthan
        createdBy: createdUsers[9]._id,
        goalAmount: 400000,
        raisedAmount: 280000,
        donorCount: 189,
        category: 'healthcare',
        coverImage: 'https://images.unsplash.com/photo-1576765608866-5b51046452be?w=800',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-04-30'),
        status: 'active',
        featured: false,
        updates: [
          { title: '55 wheelchairs distributed', content: 'Assessment camps held, 55 beneficiaries received wheelchairs.', postedAt: new Date('2026-02-03') }
        ]
      }
    ];

    await Campaign.insertMany(campaigns);
    console.log('Created sample campaigns');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest accounts:');
    console.log('- Donor: donor@example.com / password123');
    console.log('- Admin: admin@daanmatch.com / admin123');
    console.log('- Charity: hope@example.com / password123');
    console.log('\n📊 Created:');
    console.log('- 15 Charities');
    console.log('- 12 Campaigns');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
