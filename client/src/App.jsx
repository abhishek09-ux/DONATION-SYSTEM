import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import Chatbot from './components/ChatbotAI'; // Smart AI Chatbot
import AccessibilityPanel from './components/AccessibilityPanel';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Charities from './pages/Charities';
import CharityDetails from './pages/CharityDetails';
import About from './pages/About';
import CampaignsPage from './pages/CampaignsPage';
import GiftCardsPage from './pages/GiftCardsPage';

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';
import MyDonations from './pages/donor/MyDonations';
import Recommendations from './pages/donor/Recommendations';
import TaxReportsPage from './pages/TaxReportsPage';

// Charity Pages
import CharityDashboard from './pages/charity/Dashboard';
import CharityProfile from './pages/charity/Profile';
import CharityRegister from './pages/charity/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageCharities from './pages/admin/ManageCharities';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDonations from './pages/admin/ManageDonations';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <PageTransition>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/charities" element={<Charities />} />
              <Route path="/charities/:id" element={<CharityDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/gift-cards" element={<GiftCardsPage />} />

              {/* Donor Routes */}
              <Route path="/donor" element={
                <ProtectedRoute role="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/donor/profile" element={
                <ProtectedRoute role="donor">
                  <DonorProfile />
                </ProtectedRoute>
              } />
              <Route path="/donor/donations" element={
                <ProtectedRoute role="donor">
                  <MyDonations />
                </ProtectedRoute>
              } />
              <Route path="/donor/recommendations" element={
                <ProtectedRoute role="donor">
                  <Recommendations />
                </ProtectedRoute>
              } />
              <Route path="/donor/tax-reports" element={
                <ProtectedRoute role="donor">
                  <TaxReportsPage />
                </ProtectedRoute>
              } />

              {/* Charity Routes */}
              <Route path="/charity" element={
                <ProtectedRoute role="charity">
                  <CharityDashboard />
                </ProtectedRoute>
              } />
              <Route path="/charity/profile" element={
                <ProtectedRoute role="charity">
                  <CharityProfile />
                </ProtectedRoute>
              } />
              <Route path="/charity/register" element={
                <ProtectedRoute role="charity">
                  <CharityRegister />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/charities" element={
                <ProtectedRoute role="admin">
                  <ManageCharities />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/donations" element={
                <ProtectedRoute role="admin">
                  <ManageDonations />
                </ProtectedRoute>
              } />
              </Routes>
              </PageTransition>
            </main>
          <Footer />
          <Chatbot />
          <AccessibilityPanel />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'slide-in-right',
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
              style: {
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              },
            },
            error: {
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
              style: {
                background: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
