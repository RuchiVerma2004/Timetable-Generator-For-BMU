import { Link } from "react-router-dom";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Features from '../components/Features.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-5xl font-bold mb-6 text-blue-900 leading-tight">
          Smart Timetable Automation for BMU
        </h2>
        <p className="text-lg mb-8 max-w-2xl text-gray-600">
          An AI-powered platform tailored for BML Munjal University to automate class schedules, room allocations, and faculty assignments — made for administrators, professors, and students.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-50 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </section>

      {/* Features Component */}
      <Features />

      {/* About Section */}
      <section className="text-center py-16 px-6 bg-white">
        <h3 className="text-3xl font-bold text-blue-900 mb-4">Built for BMU, by BMU</h3>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
          This is the official timetable platform for BML Munjal University — designed to reflect the brand identity of BMU while streamlining academic scheduling for all departments.  
        </p>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}