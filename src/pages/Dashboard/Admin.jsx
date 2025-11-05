
import { useState } from "react";
import { Sliders, AlertTriangle, Upload } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import TimetableGenerator from "../../components/TimetableGenerator";
import ConflictDetector from "../../components/ConflictDetector";
import CommonSlotFinderTool from "../../components/CommonSlotFinderTool";
import RoomAvailabilityTool from "../../components/RoomAvailabilityTool";
import PreferenceSection from "../../components/PreferenceSection";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [fixedAssignments, setFixedAssignments] = useState({});
  const [electiveCourses, setElectiveCourses] = useState({});

  const handleFixedAssignmentsUpdate = (assignments) => {
    setFixedAssignments(assignments);
    console.log('Fixed assignments updated:', assignments);
  };

  const handleElectiveCoursesUpdate = (electives) => {
    setElectiveCourses(electives);
    console.log('Elective courses updated:', electives);
  };

  // Update your tabs to include preferences
  const tabs = [
    { id: "preferences", label: "Course Preferences", icon: Upload },
    { id: "generate", label: "Generate", icon: Sliders },
    { id: "conflicts", label: "Conflicts", icon: AlertTriangle },
    { id: "commonslots", label: "Common Slot Finder 🕓" },
    { id: "rooms", label: "Room Availability 🏫" }
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
                <p className="text-gray-600 mt-2">Manage course preferences and generate timetables</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        className={`flex items-center pb-4 px-2 font-medium whitespace-nowrap ${activeTab === tab.id
                          ? "text-blue-800 border-b-2 border-blue-800"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {IconComponent && <IconComponent size={16} className="mr-2" />}
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                {activeTab === "preferences" && (
                  <div className="space-y-8">
                    <PreferenceSection
                      onFixedAssignmentsUpdate={handleFixedAssignmentsUpdate}
                      onElectiveCoursesUpdate={handleElectiveCoursesUpdate}
                    />
                  </div>
                )}

                {activeTab === "generate" && (
                  <div className="space-y-8">
                    <TimetableGenerator
                      fixedAssignments={fixedAssignments}
                      electiveCourses={electiveCourses}
                    />
                  </div>
                )}

                {activeTab === "conflicts" && (
                  <div>
                    <ConflictDetector />
                  </div>
                )}

                {activeTab === "commonslots" && (
                  <div className="space-y-8">
                    <CommonSlotFinderTool />
                  </div>
                )}

                {activeTab === "rooms" && (
                  <div className="space-y-8">
                    <RoomAvailabilityTool />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Show current assignments */}
            <div className="space-y-6">
              {/* Fixed Assignments Summary */}
              {Object.keys(fixedAssignments).length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">
                    Fixed Assignments ({Object.keys(fixedAssignments).length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(fixedAssignments).map(([course, data]) => (
                      <div key={course} className="border-l-4 border-green-500 pl-3 py-1">
                        <p className="font-medium text-sm text-gray-900">{course}</p>
                        <p className="text-xs text-gray-600">
                          {Object.keys(data.fixedSections).length} fixed sections
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {/* <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Upload size={18} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Upload Preferences</p>
                        <p className="text-sm text-blue-600">Set fixed assignments</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Sliders size={18} className="text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Generate Timetable</p>
                        <p className="text-sm text-green-600">Use preferences</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}