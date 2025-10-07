import { useState } from "react";
import { Calendar, Clock, BookOpen, User, Bell, Download, Filter } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Student() {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState("weekly");

  const timetableData = {
    Monday: [
      { time: "09:00 - 10:00", subject: "Data Structures", room: "LT-101", faculty: "Dr. Sharma" },
      { time: "10:00 - 11:00", subject: "Mathematics", room: "LT-102", faculty: "Dr. Gupta" },
      { time: "14:00 - 15:00", subject: "Algorithms", room: "LAB-201", faculty: "Prof. Kumar" }
    ],
    Tuesday: [
      { time: "11:00 - 12:00", subject: "Operating Systems", room: "LT-103", faculty: "Dr. Singh" },
      { time: "15:00 - 16:00", subject: "Database Systems", room: "LAB-202", faculty: "Dr. Reddy" }
    ]
  };

  const upcomingClasses = [
    { subject: "Data Structures", time: "Today, 09:00 AM", room: "LT-101" },
    { subject: "Mathematics", time: "Today, 10:00 AM", room: "LT-102" },
    { subject: "Operating Systems", time: "Tomorrow, 11:00 AM", room: "LT-103" }
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
                <h1 className="text-3xl font-bold text-blue-900">Student Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, John Doe (BTECH2023001)</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  <Download size={18} />
                  <span>Export Timetable</span>
                </button>
                <div className="relative">
                  <Bell className="text-gray-600" size={24} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Classes</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Calendar className="text-blue-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weekly Hours</p>
                  <p className="text-2xl font-bold text-gray-900">25</p>
                </div>
                <Clock className="text-green-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
                <BookOpen className="text-purple-500" size={32} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
                <User className="text-orange-500" size={32} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Timetable Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-4 sm:mb-0">Weekly Timetable</h2>
                  <div className="flex space-x-2">
                    <button 
                      className={`px-4 py-2 rounded-lg ${activeView === "daily" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => setActiveView("daily")}
                    >
                      Daily
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-lg ${activeView === "weekly" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => setActiveView("weekly")}
                    >
                      Weekly
                    </button>
                  </div>
                </div>

                {/* Timetable Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Faculty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {timetableData.Monday.map((classItem, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{classItem.time}</td>
                          <td className="px-4 py-3 text-sm font-medium text-blue-800">{classItem.subject}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{classItem.room}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{classItem.faculty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Upcoming Classes */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Upcoming Classes</h3>
                <div className="space-y-4">
                  {upcomingClasses.map((classItem, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="font-medium text-gray-900">{classItem.subject}</p>
                      <p className="text-sm text-gray-600">{classItem.time}</p>
                      <p className="text-sm text-gray-500">Room: {classItem.room}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Class Rescheduled</p>
                    <p className="text-xs text-blue-600">Mathematics class moved to LT-104</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Assignment Due</p>
                    <p className="text-xs text-yellow-600">Data Structures assignment due tomorrow</p>
                  </div>
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