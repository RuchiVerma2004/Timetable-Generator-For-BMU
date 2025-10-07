import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BMULogo from '../assets/bmu_logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking on links or pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Main Header */}
      <div className="flex justify-between items-center px-4 py-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <img src={BMULogo} alt="BMU Logo" className="h-8 w-auto md:h-10" />
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">BMU TimeMaster</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/about" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            About
          </Link>
          <Link 
            to="/features" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Features
          </Link>
          <Link 
            to="/login" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-200 font-medium"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 z-60"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMenu}
          />
        )}

        {/* Mobile Navigation Menu - Fixed Position */}
        <div className={`
          fixed top-0 left-0 w-full h-screen bg-white z-50
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Menu Header */}
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img src={BMULogo} alt="BMU Logo" className="h-8 w-auto" />
              <h1 className="text-xl font-bold text-blue-800">BMU TimeMaster</h1>
            </div>
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col p-4 space-y-2">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg font-medium"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/features" 
              className="text-gray-700 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg font-medium"
              onClick={closeMenu}
            >
              Features
            </Link>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg font-medium"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-800 text-white px-4 py-4 rounded-lg hover:bg-blue-900 transition-colors duration-200 text-center font-medium text-lg mt-4"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}