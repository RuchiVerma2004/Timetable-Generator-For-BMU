import { useState } from "react";
import { Calendar, Users, BookOpen, BarChart3, Clock, Upload } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Professor() {
  const [activeTab, setActiveTab] = useState("schedule");

  const teachingSchedule = [
    { day: "Monday", time: "09:00 - 11:00", subject: "Data Structures", room: "LT-101", batch: "CSE-A" },
    { day: "Tuesday", time: "14:00 - 16:00", subject: "Algorithms", room: "LAB-201", batch: "CSE-B" },
    { day: "Wednesday", time: "11:00 - 13:00", subject: "Data Structures", room: "LT-101", batch: "CSE-A" }
  ];

  const studentAttendance = [
    { subject: "Data Structures", present: 45, total: 48, percentage: 94 },
    { subject: "Algorithms", present: 42, total: 48, percentage: 88 }
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
                <h1 className="text-3xl font-bold text-blue-900">Professor Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome, Dr. Sharma (Computer Science Department)</p>
              </div>
              <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4 sm:mt-0">
                <Upload size={18} />
                <span>Upload Materials</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses Teaching</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <BookOpen className="text-blue-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weekly Hours</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
                <Clock className="text-green-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">96</p>
                </div>
                <Users className="text-purple-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">91%</p>
                </div>
                <BarChart3 className="text-orange-500" size={32} />
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex space-x-4 border-b border-gray-200">
              {["schedule", "attendance", "materials"].map((tab) => (
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
            <div className="mt-6">
              {activeTab === "schedule" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">Teaching Schedule</h3>
                  {teachingSchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{schedule.subject}</p>
                        <p className="text-sm text-gray-600">{schedule.day} • {schedule.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{schedule.room}</p>
                        <p className="text-sm text-gray-600">{schedule.batch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "attendance" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900">Attendance Overview</h3>
                  {studentAttendance.map((subject, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-900">{subject.subject}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subject.percentage >= 90 ? "bg-green-100 text-green-800" :
                          subject.percentage >= 75 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {subject.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            subject.percentage >= 90 ? "bg-green-500" :
                            subject.percentage >= 75 ? "bg-yellow-500" :
                            "bg-red-500"
                          }`}
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {subject.present} present out of {subject.total} students
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}