import { useState } from "react";
import { Users, Calendar, Settings, BarChart3, Plus, Download, Filter, Upload, FileText, Clock, Eye } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ExcelUpload from "../../components/ExcelUpload";
import TimetableGenerator from "../../components/TimetableGenerator";
import TimetableViewer from "../../components/TimetableViewer";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadedData, setUploadedData] = useState(null);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

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
                  {["overview", "upload", "generate", "view", "conflicts", "reports"].map((tab) => (
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
                          <p className="font-semibold text-blue-800">
                            {generatedTimetable ? new Date(generatedTimetable.generatedAt).toLocaleString() : 'Not generated yet'}
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-600">Data Status</p>
                          <p className="font-semibold text-purple-800">
                            {uploadedData ? 'Data Loaded' : 'No Data Uploaded'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "upload" && (
                  <div>
                    <ExcelUpload onDataProcessed={setUploadedData} />
                  </div>
                )}

                {activeTab === "generate" && (
                  <div>
                    <TimetableGenerator 
                      data={uploadedData} 
                      onTimetableGenerated={setGeneratedTimetable}
                    />
                  </div>
                )}

                {activeTab === "view" && (
                  <div>
                    <TimetableViewer timetableData={generatedTimetable} />
                  </div>
                )}

                {activeTab === "conflicts" && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Conflict Management</h3>
                    <div className="space-y-4">
                      {generatedTimetable ? (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-yellow-800">Timetable generated successfully with conflict detection.</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">Generate a timetable first to view conflicts.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reports" && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Reports & Analytics</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Data Summary</h4>
                          {uploadedData ? (
                            <div className="space-y-1 text-sm">
                              <p>Courses: {uploadedData.courses?.length || 0}</p>
                              <p>Professors: {uploadedData.professors?.length || 0}</p>
                              <p>Rooms: {uploadedData.rooms?.length || 0}</p>
                              <p>Batches: {uploadedData.batches?.length || 0}</p>
                            </div>
                          ) : (
                            <p className="text-gray-600">No data uploaded</p>
                          )}
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Timetable Status</h4>
                          {generatedTimetable ? (
                            <div className="space-y-1 text-sm">
                              <p>Total Classes: {generatedTimetable.statistics?.totalClasses || 0}</p>
                              <p>Batches Scheduled: {Object.keys(generatedTimetable.schedules || {}).length}</p>
                              <p>Generated: {new Date(generatedTimetable.generatedAt).toLocaleDateString()}</p>
                            </div>
                          ) : (
                            <p className="text-gray-600">No timetable generated</p>
                          )}
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
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Upload size={18} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Upload Excel Data</p>
                        <p className="text-sm text-blue-600">Upload course, professor, and room data</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('generate')}
                    className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Clock size={18} className="text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Generate Timetable</p>
                        <p className="text-sm text-green-600">Create optimized timetables automatically</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('view')}
                    className="w-full text-left p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Eye size={18} className="text-indigo-600" />
                      <div>
                        <p className="font-medium text-indigo-800">View Timetable</p>
                        <p className="text-sm text-indigo-600">3D visualization and table view</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('conflicts')}
                    className="w-full text-left p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText size={18} className="text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-800">View Conflicts</p>
                        <p className="text-sm text-yellow-600">Check for scheduling conflicts</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <BarChart3 size={18} className="text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-800">View Reports</p>
                        <p className="text-sm text-purple-600">System analytics and statistics</p>
                      </div>
                    </div>
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