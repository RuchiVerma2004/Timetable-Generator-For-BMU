import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, BookOpen, User, Shield } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    studentId: "",
    department: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const roleIcons = {
    student: BookOpen,
    professor: User,
    admin: Shield
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-blue-900">
              Join BMU TimeMaster
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to access the timetable system
            </p>
          </div>

          {/* Registration Form */}
          <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-md" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["student", "professor", "admin"].map((role) => {
                  const IconComponent = roleIcons[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      className={`py-3 px-2 text-sm font-medium rounded-lg border transition-all ${
                        formData.role === role
                          ? "bg-blue-800 text-white border-blue-800 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => setFormData({ ...formData, role })}
                    >
                      <IconComponent className="mx-auto h-5 w-5 mb-1" />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Student/Professor Specific Fields */}
            {formData.role !== "admin" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                    {formData.role === "student" ? "Student ID" : "Employee ID"}
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={formData.role === "student" ? "BTECH001" : "EMP001"}
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    <option value="cse">Computer Science</option>
                    <option value="ece">Electronics & Communication</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="civil">Civil Engineering</option>
                    <option value="management">Management</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className={formData.role === "admin" ? "col-span-2" : ""}>
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
              {formData.role !== "admin" && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Create password"
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
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-800 hover:text-blue-700">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-800 hover:text-blue-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Create BMU TimeMaster Account
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-800 hover:text-blue-700">
                  Sign in here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}