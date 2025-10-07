import { useState } from "react";
import { Users, Calendar, Settings, BarChart3, Plus, Download, Filter } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const systemStats = {
    totalStudents: 1247,
    totalFaculty: 89,
    totalCourses: 56,
    scheduledClasses: 287
  };

  const recentActivities = [
    { action: "Timetable generated", user: "System", time: "2 hours ago", type: "success" },
    { action: "Room conflict detected", user: "Automation", time: "4 hours ago", type: "warning" },
    { action: "New faculty added", user: "Admin", time: "1 day ago", type: "info" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Administrator Dashboard</h1>
                <p className="text-gray-600 mt-2">System Overview & Management</p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <button className="flex items-center space-x-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900">
                  <Plus size={18} />
                  <span>Generate Timetable</span>
                </button>
                <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalStudents}</p>
                </div>
                <Users className="text-blue-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faculty Members</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalFaculty}</p>
                </div>
                <Users className="text-green-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalCourses}</p>
                </div>
                <BarChart3 className="text-purple-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.scheduledClasses}</p>
                </div>
                <Calendar className="text-orange-500" size={32} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex space-x-4 border-b border-gray-200 mb-6">
                  {["overview", "conflicts", "reports"].map((tab) => (
                    <button
                      key={tab}
                      className={`pb-4 px-2 font-medium ${
                        activeTab === tab
                          ? "text-blue-800 border-b-2 border-blue-800"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">System Overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <span className="text-green-800 font-medium">System Status: Operational</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">All Systems Normal</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-600">Last Timetable Generation</p>
                          <p className="font-semibold text-blue-800">2 hours ago</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600">Active Users</p>
                          <p className="font-semibold text-purple-800">47 Online</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Recent Activities */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">By {activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <p className="font-medium text-blue-800">Manage Users</p>
                    <p className="text-sm text-blue-600">Add/remove students and faculty</p>
                  </button>
                  <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <p className="font-medium text-green-800">Room Management</p>
                    <p className="text-sm text-green-600">View and manage room allocations</p>
                  </button>
                  <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <p className="font-medium text-purple-800">Generate Reports</p>
                    <p className="text-sm text-purple-600">Export system analytics</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}