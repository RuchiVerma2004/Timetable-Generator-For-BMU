import React, { useState } from 'react';
import { Eye, Download, Filter, Calendar, Users, MapPin, Clock } from 'lucide-react';
import Timetable3D from './Timetable3D';

const TimetableViewer = ({ timetableData }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'table'
  const [filterDay, setFilterDay] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  if (!timetableData || !timetableData.schedules) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timetable Generated</h3>
          <p className="text-gray-600">Generate a timetable first to view the 3D visualization.</p>
        </div>
      </div>
    );
  }

  const batches = Object.keys(timetableData.schedules);
  const currentSchedule = selectedBatch 
    ? timetableData.schedules[selectedBatch] 
    : timetableData.schedules[batches[0]];

  const filteredClasses = currentSchedule?.classes?.filter(cls => {
    if (filterDay !== 'all' && cls.day !== filterDay) return false;
    if (filterTime !== 'all' && !cls.time.includes(filterTime)) return false;
    return true;
  }) || [];

  const exportTimetable = () => {
    const data = {
      batch: currentSchedule?.batchName || 'All Batches',
      generatedAt: timetableData.generatedAt,
      classes: filteredClasses
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable_${currentSchedule?.batchName || 'all'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getClassStats = () => {
    const totalClasses = filteredClasses.length;
    const uniqueCourses = new Set(filteredClasses.map(cls => cls.courseCode)).size;
    const uniqueProfessors = new Set(filteredClasses.map(cls => cls.professor?.name)).size;
    const uniqueRooms = new Set(filteredClasses.map(cls => cls.room?.name)).size;

    return { totalClasses, uniqueCourses, uniqueProfessors, uniqueRooms };
  };

  const stats = getClassStats();

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-blue-900">Timetable Visualization</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === '3d' ? 'table' : '3d')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Eye size={18} />
            <span>{viewMode === '3d' ? 'Table View' : '3D View'}</span>
          </button>
          <button
            onClick={exportTimetable}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Batch Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch:</label>
        <select
          value={selectedBatch || batches[0]}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {batches.map(batchId => {
            const batch = timetableData.schedules[batchId];
            return (
              <option key={batchId} value={batchId}>
                {batch?.batchName} ({batch?.year}) - {batch?.branch}
              </option>
            );
          })}
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-blue-600">Total Classes</p>
              <p className="text-lg font-bold text-blue-800">{stats.totalClasses}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-green-600">Courses</p>
              <p className="text-lg font-bold text-green-800">{stats.uniqueCourses}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="text-purple-600" size={20} />
            <div>
              <p className="text-sm text-purple-600">Professors</p>
              <p className="text-lg font-bold text-purple-800">{stats.uniqueProfessors}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="text-orange-600" size={20} />
            <div>
              <p className="text-sm text-orange-600">Rooms</p>
              <p className="text-lg font-bold text-orange-800">{stats.uniqueRooms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Days</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={18} className="text-gray-500" />
          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Times</option>
            <option value="9:00">Morning (9:00-12:00)</option>
            <option value="13:00">Afternoon (1:00-5:00)</option>
          </select>
        </div>
      </div>

      {/* Visualization */}
      {viewMode === '3d' ? (
        <Timetable3D 
          timetableData={timetableData}
          selectedBatch={selectedBatch || batches[0]}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Day</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Course</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Professor</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Room</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls, index) => (
                <tr key={cls.id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{cls.day}</td>
                  <td className="border border-gray-300 px-4 py-2">{cls.time}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <div className="font-medium">{cls.courseName}</div>
                      <div className="text-sm text-gray-500">{cls.courseCode}</div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{cls.professor?.name || 'TBA'}</td>
                  <td className="border border-gray-300 px-4 py-2">{cls.room?.name || 'TBA'}</td>
                  <td className="border border-gray-300 px-4 py-2">{cls.section || 'A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClasses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No classes found with current filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimetableViewer;
