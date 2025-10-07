import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-center py-8 border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">BMU TimeMaster</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Smart timetable automation platform for BML Munjal University. Streamlining academic scheduling with AI-powered solutions.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-800 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-800 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-800 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-800 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-800 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-900">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-800 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-900">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  BML Munjal University<br />
                  67th Km Stone, NH-48<br />
                  Sidhrawali, Gurugram, Haryana 122413
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-600 text-sm">info@bmu.edu.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500">
            © {new Date().getFullYear()} BMU TimeMaster — Developed by{" "}
            <span className="text-blue-800 font-semibold">Students</span> for BML Munjal University
          </p>
        </div>
      </div>
    </footer>
  );
}