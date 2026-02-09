import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="h-10 w-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">DonateMatch</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered platform connecting donors with verified Indian charities for maximum impact.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/charities" className="text-gray-400 hover:text-white transition-colors">
                  Browse Charities
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/register?role=charity" className="text-gray-400 hover:text-white transition-colors">
                  Register NGO
                </Link>
              </li>
            </ul>
          </div>

          {/* Causes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Causes</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/charities?cause=education" className="text-gray-400 hover:text-white transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/charities?cause=health" className="text-gray-400 hover:text-white transition-colors">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link to="/charities?cause=environment" className="text-gray-400 hover:text-white transition-colors">
                  Environment
                </Link>
              </li>
              <li>
                <Link to="/charities?cause=child_welfare" className="text-gray-400 hover:text-white transition-colors">
                  Child Welfare
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <FiMapPin size={18} />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiMail size={18} />
                <a href="mailto:support@donatematch.in" className="hover:text-white transition-colors">
                  support@donatematch.in
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiPhone size={18} />
                <a href="tel:+911234567890" className="hover:text-white transition-colors">
                  +91 12345 67890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DonateMatch. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
