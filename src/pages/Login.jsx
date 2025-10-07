import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-800 rounded-full flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-blue-900">
              Sign in to BMU TimeMaster
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your timetable and academic schedule
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-md" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["student", "professor", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                      formData.role === role
                        ? "bg-blue-800 text-white border-blue-800"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData({ ...formData, role })}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                BMU Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="username@bmu.edu.in"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-800 hover:text-blue-700">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign in to BMU TimeMaster
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-blue-800 hover:text-blue-700">
                  Sign up here
                </Link>
              </span>
            </div>
          </form>

          {/* Demo Accounts Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Student: student@bmu.edu.in / password</p>
              <p>Professor: prof@bmu.edu.in / password</p>
              <p>Admin: admin@bmu.edu.in / password</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}