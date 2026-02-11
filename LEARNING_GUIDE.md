# 📚 Learning Guide - DonateMatch

A comprehensive guide to understanding every technology used in this project.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend Technologies](#frontend-technologies)
3. [Backend Technologies](#backend-technologies)
4. [Database](#database)
5. [Authentication & Security](#authentication--security)
6. [Payment Integration](#payment-integration)
7. [Internationalization (i18n)](#internationalization-i18n)
8. [Real-time Features](#real-time-features)
9. [Architecture Patterns](#architecture-patterns)
10. [How Features Work Together](#how-features-work-together)
11. [Learning Resources](#learning-resources)

---

## Project Overview

### What is DonateMatch?

DonateMatch is a **full-stack MERN application** (MongoDB, Express, React, Node.js) that connects donors with verified charities in India using AI-powered matching.

### Why This Tech Stack?

| Requirement | Solution | Why? |
|-------------|----------|------|
| Modern UI | React | Component-based, reusable, large ecosystem |
| Fast Development | Vite | 10x faster than Create React App |
| Styling | Tailwind CSS | Utility-first, no CSS files to manage |
| Backend API | Express.js | Minimal, flexible, huge middleware ecosystem |
| Database | MongoDB | Flexible schema, JSON-like documents |
| Indian Payments | Razorpay | Best Indian payment gateway, UPI support |
| Multi-language | i18next | Industry standard, easy translations |

---

## Frontend Technologies

### 1. React 18

**What is it?**
React is a JavaScript library for building user interfaces using components.

**Key Concepts Used:**

```jsx
// 1. Functional Components
const CharityCard = ({ charity }) => {
  return (
    <div className="card">
      <h3>{charity.name}</h3>
    </div>
  );
};

// 2. useState - Managing component state
const [donations, setDonations] = useState([]);
const [loading, setLoading] = useState(true);

// 3. useEffect - Side effects (API calls, subscriptions)
useEffect(() => {
  fetchDonations();
}, []); // Empty array = run once on mount

// 4. useContext - Global state without prop drilling
const { user, login, logout } = useAuth();

// 5. Custom Hooks - Reusable logic
const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
```

**Why React?**
- Virtual DOM = Fast updates
- Component reusability
- Huge ecosystem (React Router, Redux, etc.)
- Strong community support

**Files to study:**
- [client/src/App.jsx](client/src/App.jsx) - Main app component
- [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx) - Auth context
- [client/src/components/CharityCard.jsx](client/src/components/CharityCard.jsx) - Example component

---

### 2. Vite

**What is it?**
A modern build tool that's significantly faster than Create React App.

**How it works:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward /api requests to Express server
      '/api': 'http://localhost:5000'
    }
  }
});
```

**Why Vite over CRA?**
| Feature | Vite | Create React App |
|---------|------|------------------|
| Dev server start | ~300ms | ~30s |
| Hot Module Reload | Instant | 2-5s |
| Build size | Smaller | Larger |
| Configuration | Simple | Complex (eject) |

---

### 3. Tailwind CSS

**What is it?**
A utility-first CSS framework where you style by combining utility classes.

**Traditional CSS vs Tailwind:**

```css
/* Traditional CSS */
.button {
  background-color: #3B82F6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
}
.button:hover {
  background-color: #2563EB;
}
```

```jsx
// Tailwind - No separate CSS file!
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600">
  Donate
</button>
```

**Key Classes Used:**

| Class | What it does |
|-------|--------------|
| `flex` | Display: flex |
| `grid grid-cols-3` | 3-column grid |
| `p-4` | Padding: 1rem |
| `mx-auto` | Margin left/right: auto (center) |
| `text-xl` | Font size: 1.25rem |
| `bg-primary-600` | Background: custom primary color |
| `hover:bg-blue-700` | Background on hover |
| `dark:bg-slate-800` | Dark mode background |
| `md:flex` | Display flex on medium screens+ |

**Dark Mode:**
```jsx
// ThemeContext handles dark mode
<html className="dark">
  <div className="bg-white dark:bg-slate-900">
    {/* Automatically switches colors */}
  </div>
</html>
```

**File to study:** [client/tailwind.config.js](client/tailwind.config.js)

---

### 4. React Router v6

**What is it?**
Client-side routing library for React single-page applications.

**How it works:**

```jsx
// App.jsx - Route definitions
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/charities/:id" element={<CharityDetails />} />
        
        {/* Protected routes - require login */}
        <Route path="/donor/dashboard" element={
          <ProtectedRoute>
            <DonorDashboard />
          </ProtectedRoute>
        } />
        
        {/* Nested routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="charities" element={<CharityManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

**Key hooks:**
```jsx
// useNavigate - Programmatic navigation
const navigate = useNavigate();
navigate('/dashboard'); // Go to dashboard
navigate(-1); // Go back

// useParams - Get URL parameters
const { id } = useParams(); // /charities/:id → id = "123"

// useLocation - Current URL info
const location = useLocation();
console.log(location.pathname); // "/charities/123"

// useSearchParams - Query string
const [searchParams] = useSearchParams();
const page = searchParams.get('page'); // ?page=2 → "2"
```

---

### 5. Axios

**What is it?**
Promise-based HTTP client for making API requests.

**Why Axios over fetch?**
| Feature | Axios | Fetch |
|---------|-------|-------|
| JSON auto-parsing | ✅ | ❌ (manual) |
| Request interceptors | ✅ | ❌ |
| Timeout support | ✅ | ❌ |
| Error handling | Better | Basic |

**How we use it:**

```javascript
// services/api.js - Centralized API configuration
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Usage in components:**
```jsx
// Fetching data
const fetchCharities = async () => {
  try {
    setLoading(true);
    const response = await api.get('/charities');
    setCharities(response.data);
  } catch (error) {
    toast.error('Failed to load charities');
  } finally {
    setLoading(false);
  }
};

// Posting data
const createDonation = async (donationData) => {
  const response = await api.post('/donations', donationData);
  return response.data;
};
```

---

### 6. Recharts

**What is it?**
A React charting library built on D3.js with declarative components.

**Example - Analytics Dashboard:**

```jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DonationChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="#8884d8" 
          fill="url(#colorAmount)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
```

**File to study:** [client/src/components/AnalyticsDashboard.jsx](client/src/components/AnalyticsDashboard.jsx)

---

## Backend Technologies

### 1. Node.js

**What is it?**
JavaScript runtime built on Chrome's V8 engine. Allows running JavaScript on the server.

**Why Node.js?**
- Same language (JavaScript) for frontend and backend
- Non-blocking I/O = handles many connections
- NPM = largest package ecosystem
- Great for real-time applications

**Event Loop (Key Concept):**
```javascript
// Node.js is single-threaded but handles async operations efficiently
console.log('1. Start');

setTimeout(() => {
  console.log('3. Timeout callback'); // Async - executed later
}, 0);

console.log('2. End');

// Output: 1. Start → 2. End → 3. Timeout callback
```

---

### 2. Express.js

**What is it?**
Minimal and flexible Node.js web framework for building APIs.

**Basic structure:**

```javascript
// server/index.js
const express = require('express');
const app = express();

// Middleware - runs on every request
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/charities', require('./routes/charities'));
app.use('/api/donations', require('./routes/donations'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

**Route structure:**

```javascript
// server/routes/charities.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/charities - Public route
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find({ verificationStatus: 'verified' });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/charities - Protected route
router.post('/', auth, async (req, res) => {
  // auth middleware checks JWT token
  const charity = new Charity({
    ...req.body,
    user: req.user.id // From auth middleware
  });
  await charity.save();
  res.status(201).json(charity);
});

module.exports = router;
```

**Middleware concept:**

```javascript
// Middleware flows: Request → Middleware1 → Middleware2 → Route Handler → Response

// Auth middleware example
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    next(); // Pass to next middleware/route
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

---

### 3. REST API Design

**What is REST?**
Representational State Transfer - architectural style for APIs using HTTP methods.

**HTTP Methods:**
| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read data | GET /api/charities |
| POST | Create data | POST /api/donations |
| PUT | Update entire resource | PUT /api/charities/123 |
| PATCH | Partial update | PATCH /api/user/profile |
| DELETE | Remove data | DELETE /api/campaigns/123 |

**Response patterns used:**

```javascript
// Success responses
res.json(data);                    // 200 OK
res.status(201).json(newItem);    // 201 Created

// Error responses
res.status(400).json({ message: 'Invalid input' });     // Bad request
res.status(401).json({ message: 'Not authorized' });    // Unauthorized
res.status(404).json({ message: 'Charity not found' }); // Not found
res.status(500).json({ message: 'Server error' });      // Internal error
```

---

## Database

### MongoDB

**What is it?**
NoSQL document database that stores data in JSON-like documents.

**SQL vs MongoDB:**
| SQL | MongoDB |
|-----|---------|
| Tables | Collections |
| Rows | Documents |
| Columns | Fields |
| Foreign Keys | References |
| Joins | $lookup / populate |

**Why MongoDB for this project?**
- Flexible schema - charities can have different fields
- JSON-native - works naturally with JavaScript
- Horizontal scaling for growth
- MongoDB Atlas free tier

### Mongoose

**What is it?**
ODM (Object Document Mapper) for MongoDB - provides schema validation and helpful methods.

**Schema definition:**

```javascript
// server/models/Charity.js
const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  // Reference to User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  
  causes: [{
    type: String,
    enum: ['education', 'health', 'poverty', 'environment', 'animals', 'disaster']
  }],
  
  // Embedded document (nested object)
  location: {
    city: String,
    state: String,
    pincode: String
  },
  
  // Computed field with default
  stats: {
    totalDonationsReceived: { type: Number, default: 0 },
    totalDonors: { type: Number, default: 0 }
  },
  
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
charitySchema.index({ verificationStatus: 1, causes: 1 });

// Virtual field (computed, not stored)
charitySchema.virtual('isVerified').get(function() {
  return this.verificationStatus === 'verified';
});

module.exports = mongoose.model('Charity', charitySchema);
```

**Common queries:**

```javascript
// Find all verified charities
const charities = await Charity.find({ verificationStatus: 'verified' });

// Find by ID with related user data
const charity = await Charity.findById(id).populate('user', 'name email');

// Find with multiple conditions
const charities = await Charity.find({
  causes: { $in: ['education', 'health'] },
  'location.state': 'Maharashtra'
}).sort({ createdAt: -1 }).limit(10);

// Update document
await Charity.findByIdAndUpdate(id, {
  $inc: { 'stats.totalDonationsReceived': amount }
});

// Aggregation pipeline
const stats = await Donation.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$charity', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } }
]);
```

---

## Authentication & Security

### JWT (JSON Web Tokens)

**What is it?**
A compact, URL-safe token format for secure information exchange.

**How it works:**

```
1. User logs in with email/password
2. Server validates credentials
3. Server creates JWT with user data
4. Client stores token in localStorage
5. Client sends token with every request
6. Server verifies token and extracts user
```

**Token structure:**
```
xxxxx.yyyyy.zzzzz
 ↓       ↓      ↓
Header.Payload.Signature
```

**Implementation:**

```javascript
// Creating token (login)
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: user._id },           // Payload
  process.env.JWT_SECRET,     // Secret key
  { expiresIn: '7d' }        // Options
);

// Verifying token (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// decoded = { id: "user_id", iat: 1234567890, exp: 1235172690 }
```

### bcrypt - Password Hashing

**Why hash passwords?**
- Never store plain text passwords
- Even if database is compromised, passwords are safe
- bcrypt is intentionally slow (prevents brute force)

```javascript
const bcrypt = require('bcryptjs');

// Hashing password (registration)
const salt = await bcrypt.genSalt(10); // 10 rounds
const hashedPassword = await bcrypt.hash('userPassword123', salt);
// Result: $2a$10$X7kJ3...random...hash

// Comparing password (login)
const isMatch = await bcrypt.compare('userPassword123', hashedPassword);
// Returns true or false
```

### Two-Factor Authentication (2FA)

**What is it?**
Extra security layer requiring a time-based code from an authenticator app.

**Libraries used:**
- `speakeasy` - Generate and verify TOTP codes
- `qrcode` - Generate QR codes for authenticator apps

**Flow:**

```javascript
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// 1. Generate secret for user
const secret = speakeasy.generateSecret({
  name: 'DonateMatch:user@email.com'
});

// 2. Generate QR code for Google Authenticator
const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

// 3. User scans QR, gets 6-digit code every 30 seconds

// 4. Verify code on login
const verified = speakeasy.totp.verify({
  secret: user.twoFactorSecret,
  encoding: 'base32',
  token: userProvidedCode, // e.g., "123456"
  window: 1 // Allow 1 step before/after (timing tolerance)
});
```

---

## Payment Integration

### Razorpay

**What is it?**
India's leading payment gateway supporting UPI, cards, net banking, wallets.

**Payment Flow:**

```
1. Frontend: User clicks "Pay ₹500"
2. Backend: Create Razorpay order
3. Backend: Return order ID to frontend
4. Frontend: Open Razorpay checkout popup
5. User: Completes payment (UPI/Card/etc.)
6. Razorpay: Returns payment ID
7. Frontend: Send payment details to backend
8. Backend: Verify signature
9. Backend: Update donation status
10. Frontend: Show success message
```

**Backend - Create Order:**

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', auth, async (req, res) => {
  const { amount, charityId } = req.body;
  
  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay uses paise
    currency: 'INR',
    receipt: `donation_${Date.now()}`,
    notes: {
      charityId,
      donorId: req.user.id
    }
  });
  
  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  });
});
```

**Frontend - Open Checkout:**

```javascript
const handlePayment = async () => {
  // 1. Create order on backend
  const { data } = await api.post('/payments/create-order', {
    amount: donationAmount,
    charityId: selectedCharity
  });
  
  // 2. Configure Razorpay options
  const options = {
    key: 'rzp_test_xxxxx',
    amount: data.amount,
    currency: data.currency,
    order_id: data.orderId,
    name: 'DonateMatch',
    description: 'Donation',
    handler: async (response) => {
      // 3. Verify on backend
      await api.post('/payments/verify', {
        orderId: data.orderId,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      });
      toast.success('Donation successful!');
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone
    }
  };
  
  // 4. Open payment popup
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

**Backend - Verify Payment:**

```javascript
const crypto = require('crypto');

router.post('/verify', auth, async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  
  // Create signature verification string
  const body = orderId + '|' + paymentId;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }
  
  // Payment verified - update database
  await Donation.findOneAndUpdate(
    { razorpayOrderId: orderId },
    { 
      status: 'completed',
      razorpayPaymentId: paymentId 
    }
  );
  
  res.json({ success: true });
});
```

---

## Internationalization (i18n)

### react-i18next

**What is it?**
Internationalization framework for React applications.

**How it works:**

```javascript
// i18n/index.js - Setup
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        charities: 'Charities',
        donate: 'Donate Now'
      },
      home: {
        title: 'Make Every Donation Count',
        subtitle: 'Connecting donors with verified charities'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        charities: 'चैरिटी',
        donate: 'अभी दान करें'
      },
      home: {
        title: 'हर दान को सार्थक बनाएं',
        subtitle: 'दाताओं को सत्यापित चैरिटी से जोड़ना'
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Connect to React
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
```

**Usage in components:**

```jsx
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <nav>
      <a href="/">{t('nav.home')}</a>
      <a href="/charities">{t('nav.charities')}</a>
      <button>{t('nav.donate')}</button>
      
      {/* Change language */}
      <button onClick={() => i18n.changeLanguage('hi')}>
        हिन्दी
      </button>
    </nav>
  );
};
```

**Interpolation (dynamic values):**

```jsx
// Translation: "Welcome, {{name}}!"
// Hindi: "स्वागत है, {{name}}!"

{t('dashboard.welcome', { name: user.name })}
// Output: "Welcome, John!" or "स्वागत है, John!"
```

---

## Architecture Patterns

### Component Architecture

```
App.jsx
├── Layout Components
│   ├── Navbar (navigation + language + theme)
│   ├── Footer
│   └── Sidebar (admin)
│
├── Page Components (routes)
│   ├── Home
│   ├── Charities
│   ├── DonorDashboard
│   └── AdminDashboard
│
├── Feature Components
│   ├── DonationModal
│   ├── CharityCard
│   ├── AnalyticsDashboard
│   └── Chatbot
│
└── Context Providers
    ├── AuthContext (user state)
    ├── ThemeContext (dark mode)
    └── AccessibilityContext
```

### State Management

```
┌─────────────────────────────────────────────┐
│              React Application              │
├─────────────────────────────────────────────┤
│  Context API (Global State)                 │
│  ├── AuthContext (user, token, login/logout)│
│  ├── ThemeContext (dark mode)              │
│  └── AccessibilityContext (a11y settings)  │
├─────────────────────────────────────────────┤
│  Component Local State (useState)           │
│  ├── Form inputs                           │
│  ├── UI state (modals, dropdowns)          │
│  └── Temporary data                        │
├─────────────────────────────────────────────┤
│  Server State (API data)                   │
│  ├── Fetched via axios                     │
│  ├── Stored in component state             │
│  └── Refreshed as needed                   │
└─────────────────────────────────────────────┘
```

### API Route Structure

```
server/routes/
├── auth.js         - Login, register, password reset
├── 2fa.js          - Two-factor authentication
├── charities.js    - Charity CRUD operations
├── donations.js    - Donation management
├── payments.js     - Razorpay integration
├── campaigns.js    - Crowdfunding campaigns
├── matching.js     - AI matching algorithm
├── recommendations.js - Personalized suggestions
├── taxReports.js   - 80G certificate generation
├── giftcards.js    - Donation gift cards
├── referrals.js    - Referral program
├── chatbot.js      - AI chatbot responses
├── fraudDetection.js - Security checks
├── forum.js        - Community discussions
├── volunteers.js   - Volunteer management
├── corporate.js    - Corporate donations
├── impactStories.js - Success stories
├── admin.js        - Admin operations
└── donors.js       - Donor profile management
```

---

## How Features Work Together

### Complete Donation Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. DISCOVERY                                                 │
├──────────────────────────────────────────────────────────────┤
│ User visits /charities                                       │
│   ↓                                                          │
│ Frontend calls GET /api/charities                            │
│   ↓                                                          │
│ Server queries MongoDB: Charity.find({ verified: true })     │
│   ↓                                                          │
│ CharityCard components render with charity data              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. AI MATCHING                                               │
├──────────────────────────────────────────────────────────────┤
│ GET /api/matching/recommendations                            │
│   ↓                                                          │
│ Server gets user's preferences from DonorProfile             │
│   ↓                                                          │
│ Matching algorithm scores each charity:                      │
│   • Cause alignment (35%)                                    │
│   • Location match (20%)                                     │
│   • Rating (15%)                                             │
│   • Verification (15%)                                       │
│   • Impact score (10%)                                       │
│   • Activity (5%)                                            │
│   ↓                                                          │
│ Return sorted charities with match percentages               │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. DONATION                                                  │
├──────────────────────────────────────────────────────────────┤
│ User clicks "Donate Now" on CharityCard                      │
│   ↓                                                          │
│ DonationModal opens with amount selection                    │
│   ↓                                                          │
│ POST /api/payments/create-order { amount, charityId }        │
│   ↓                                                          │
│ Server creates Razorpay order                                │
│   ↓                                                          │
│ Frontend opens Razorpay checkout popup                       │
│   ↓                                                          │
│ User completes payment (UPI/Card)                            │
│   ↓                                                          │
│ POST /api/payments/verify { signature, paymentId }           │
│   ↓                                                          │
│ Server verifies signature                                    │
│   ↓                                                          │
│ Donation record created in MongoDB                           │
│   ↓                                                          │
│ Charity stats updated (totalDonationsReceived)               │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. POST-DONATION                                             │
├──────────────────────────────────────────────────────────────┤
│ 80G Certificate generated (PDFKit)                           │
│   ↓                                                          │
│ Email sent to donor with receipt (Nodemailer)                │
│   ↓                                                          │
│ Donor dashboard updated with new donation                    │
│   ↓                                                          │
│ Impact calculator shows contribution effect                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Learning Resources

### Official Documentation

| Technology | Link |
|------------|------|
| React | [react.dev](https://react.dev) |
| Vite | [vitejs.dev](https://vitejs.dev) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Express.js | [expressjs.com](https://expressjs.com) |
| MongoDB | [mongodb.com/docs](https://mongodb.com/docs) |
| Mongoose | [mongoosejs.com/docs](https://mongoosejs.com/docs) |
| Razorpay | [razorpay.com/docs](https://razorpay.com/docs) |
| react-i18next | [react.i18next.com](https://react.i18next.com) |

### Recommended Courses

1. **React** - [React Official Tutorial](https://react.dev/learn)
2. **Node.js** - [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
3. **MongoDB** - [MongoDB University](https://university.mongodb.com)
4. **Tailwind** - [Tailwind CSS YouTube Series](https://youtube.com/@TailwindLabs)

### Practice Projects

After understanding this codebase, try:

1. Add email verification on registration
2. Implement password reset flow
3. Add social login (Google, Facebook)
4. Build admin analytics with more charts
5. Add push notifications
6. Implement real-time donation updates (Socket.io)

---

## Quick Reference

### Common Commands

```bash
# Start development
npm run dev                 # Start both client and server

# Start individually
cd client && npm run dev    # Frontend only
cd server && npm run dev    # Backend only

# Build for production
cd client && npm run build

# Seed database
cd server && npm run seed

# Install all dependencies
npm run install:all
```

### File Quick Reference

| What you need | Where to find it |
|---------------|------------------|
| Main React entry | [client/src/main.jsx](client/src/main.jsx) |
| Routes | [client/src/App.jsx](client/src/App.jsx) |
| Auth context | [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx) |
| API service | [client/src/services/api.js](client/src/services/api.js) |
| Translations | [client/src/i18n/index.js](client/src/i18n/index.js) |
| Server entry | [server/index.js](server/index.js) |
| Auth routes | [server/routes/auth.js](server/routes/auth.js) |
| User model | [server/models/User.js](server/models/User.js) |
| JWT middleware | [server/middleware/auth.js](server/middleware/auth.js) |

---

<div align="center">

**Happy Learning! 🎓**

*Questions? Open an issue on GitHub!*

</div>
