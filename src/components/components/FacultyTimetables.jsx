import React from 'react';

const FacultyTimetables = ({
  facultySchedules,
  generateTimeSlots,
  DAYS,
  expandedFaculty,
  toggleFaculty
}) => {
    console.log('Faculty Schedules in FacultyTimetables:', facultySchedules);
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Faculty Timetables</h2>
      <div className="space-y-4">
        {Object.keys(facultySchedules).map(faculty => {
          const facultySchedule = facultySchedules[faculty];
          return (
            <div key={faculty} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaculty(faculty)}
                className="w-full px-6 py-4 bg-purple-50 hover:bg-purple-100 transition flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-purple-700">{faculty}</span>
                <span className="text-purple-600">{expandedFaculty[faculty] ? '▲' : '▼'}</span>
              </button>

              {expandedFaculty[faculty] && (
                <div className="p-6 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-purple-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Day</th>
                          {generateTimeSlots.map(slot => (
                            <th key={slot} className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs">{slot}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DAYS.map(day => (
                          <tr key={day} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-medium">{day}</td>
                            {generateTimeSlots.map(slot => {
                              const entries = facultySchedule[day].filter(e => e.time === slot);
                              return (
                                <td key={slot} className={`border border-gray-300 px-2 py-2 text-center text-xs ${entries.length > 0 ? 'bg-blue-50' : ''}`}>
                                  {entries.length > 0 ? (
                                    <div className="space-y-2">
                                      {entries.map((entry, idx) => (
                                        <div key={idx} className={idx > 0 ? 'border-t border-gray-300 pt-2' : ''}>
                                          <div className="font-semibold text-purple-700">{entry.course}</div>
                                          <div className="text-gray-600 text-xs">{entry.section.replace(/_/g, ' ')}</div>
                                          <div className="text-gray-500 text-xs">{entry.room}</div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyTimetables;
