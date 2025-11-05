import { Users, Calendar } from "lucide-react";

const SystemStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
          </div>
          <Users className="text-blue-500" size={32} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Faculty Members</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</p>
          </div>
          <Users className="text-green-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
          </div>
          <Calendar className="text-purple-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Scheduled Classes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.scheduledClasses}</p>
          </div>
          <Calendar className="text-orange-500" size={32} />
        </div>
      </div>
    </div>
  );
};

export default SystemStats;