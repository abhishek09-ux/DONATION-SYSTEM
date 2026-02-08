# DaanMatch - AI Donation Matching System

A smart AI-powered platform that connects donors with verified Indian charities and causes, featuring intelligent matching based on donor preferences.

## Features

### For Donors
- **AI-Powered Matching**: Get personalized charity recommendations based on causes you care about, preferred locations, and donation range (80%+ match accuracy)
- **Secure Payments**: Donate via Razorpay (UPI, Cards, Net Banking) with instant receipts
- **80G Tax Benefits**: Automatic tax-exemption receipts for eligible donations
- **Donation Tracking**: Complete history of all donations with download receipts
- **Impact Dashboard**: See how your donations are making a difference

### For Charities/NGOs
- **Profile Management**: Create detailed organization profiles with projects, mission, and impact reports
- **Verification System**: Get verified status and 80G certification badges
- **Donation Management**: Track received donations and donor statistics
- **Project Fundraising**: Create individual campaigns with funding goals

### For Admins
- **Dashboard Analytics**: Platform-wide statistics and donation trends
- **Charity Verification**: Review and approve/reject charity applications
- **User Management**: Manage all platform users and roles
- **Donation Oversight**: Monitor all transactions and handle failed payments

## Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Razorpay SDK** - Payment processing
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### AI Matching Algorithm

The matching algorithm uses weighted scoring across multiple factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| Cause Alignment | 35% | Matches donor's preferred causes with charity focus areas |
| Location | 20% | Prioritizes charities in donor's preferred regions |
| Budget Fit | 15% | Matches charity donation ranges with donor capacity |
| Verification | 10% | Boosts verified and 80G certified organizations |
| Rating | 10% | Considers community ratings and reviews |
| Activity | 5% | Prioritizes recently active charities |

**Formula**: `MatchScore = Σ(Factor × Weight) × 100`

## Project Structure

```
DONATION SYSTEM/
├── server/                     # Backend
│   ├── index.js               # Express server entry
│   ├── middleware/
│   │   └── auth.js            # JWT authentication & role guards
│   ├── models/
│   │   ├── User.js            # User authentication model
│   │   ├── DonorProfile.js    # Donor preferences & stats
│   │   ├── Charity.js         # Charity/NGO details
│   │   └── Donation.js        # Transaction records
│   ├── routes/
│   │   ├── auth.js            # Login/Register/Profile
│   │   ├── donors.js          # Donor operations
│   │   ├── charities.js       # Charity CRUD
│   │   ├── matching.js        # AI recommendations API
│   │   ├── donations.js       # Donation management
│   │   ├── payments.js        # Razorpay integration
│   │   └── admin.js           # Admin operations
│   └── utils/
│       └── matchingAlgorithm.js  # AI matching logic
│
├── client/                     # Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context (Auth)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Charities.jsx
│   │   │   ├── CharityDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── donor/         # Donor dashboard pages
│   │   │   ├── charity/       # Charity dashboard pages
│   │   │   └── admin/         # Admin dashboard pages
│   │   └── services/
│   │       └── api.js         # API client
│   ├── index.html
│   └── tailwind.config.js
│
└── package.json               # Root package
```

## Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (for payments)

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all
```

### 2. Environment Setup

Create `.env` file in `/server`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/daanmatch

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=30d

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

```bash
# Run both backend and frontend
npm run dev

# Or run separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 5173
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update user profile |

### Charities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/charities` | List all charities |
| GET | `/api/charities/:id` | Get charity details |
| POST | `/api/charities` | Register charity (charity role) |
| PUT | `/api/charities/:id` | Update charity profile |
| GET | `/api/charities/causes` | Get all cause categories |

### Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matching/recommendations` | Get AI recommendations |
| GET | `/api/matching/similar/:id` | Get similar charities |
| POST | `/api/matching/calculate` | Calculate match score |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donations` | Create donation |
| GET | `/api/donations/my` | Get donor's donations |
| GET | `/api/donations/:id/receipt` | Download receipt |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| POST | `/api/payments/webhook` | Razorpay webhook |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `JWT_EXPIRES_IN` | Token expiration | No (default: 30d) |
| `RAZORPAY_KEY_ID` | Razorpay API Key | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ for Indian charities and donors

<!-- mongodb id=arthur_31
mongodb pass= uGLdAujnWeTj0Wkd -->