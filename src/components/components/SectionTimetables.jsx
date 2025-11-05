import React from 'react';

const SectionTimetables = ({
  timetable,
  generateTimeSlots,
  DAYS,
  distributionStats,
  expandedSections,
  toggleSection
}) => {
  const getCellStyle = (entry) => {
    if (!entry) return '';
    if (entry.course === 'LUNCH') return 'bg-yellow-50';
    if (entry.course === 'FREE') return 'bg-gray-100';
    if (entry.type === 'lab') return 'bg-purple-50';
    if (entry.category?.includes('OE')) return 'bg-green-50';
    return '';
  };

  const getTextStyle = (entry) => {
    if (!entry || entry.course === 'LUNCH' || entry.course === 'FREE') return '';
    if (entry.type === 'lab') return 'text-purple-700';
    if (entry.category?.includes('OE')) return 'text-green-700';
    return 'text-indigo-700';
  };

  const renderCellContent = (entry) => {
    if (!entry) return <span className="text-gray-400">-</span>;
    
    if (entry.course === 'LUNCH') {
      return <span className="font-medium text-orange-600">LUNCH</span>;
    }
    
    if (entry.course === 'FREE') {
      return <span className="font-medium text-gray-500">FREE</span>;
    }

    return (
      <div>
        <div className={`font-semibold ${getTextStyle(entry)}`}>
          {entry.course}
        </div>
        <div className="text-gray-600 text-xs">{entry.teacher}</div>
        <div className="text-gray-500 text-xs">{entry.room}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Section Timetables</h2>
      <div className="space-y-4">
        {Object.keys(timetable).map(section => (
          <div key={section} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section)}
              className="w-full px-6 py-4 bg-indigo-50 hover:bg-indigo-100 transition flex items-center justify-between"
            >
              <span className="text-lg font-semibold text-indigo-700">
                {section.replace(/_/g, ' ')}
                <span className="ml-2 text-sm font-normal text-indigo-600">
                  (Lectures: {distributionStats[section]?.lectures || 0},
                  Labs: {distributionStats[section]?.labs || 0},
                  Total: {distributionStats[section]?.total || 0})
                </span>
              </span>
              <span className="text-indigo-600">
                {expandedSections[section] ? '▲' : '▼'}
              </span>
            </button>

            {expandedSections[section] && (
              <div className="p-6 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Day</th>
                        {generateTimeSlots.map(slot => (
                          <th key={slot} className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs">
                            {slot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map(day => (
                        <tr key={day} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">{day}</td>
                          {generateTimeSlots.map(slot => {
                            const entry = timetable[section][day].find(e => e.time === slot);
                            return (
                              <td key={slot} className={`border border-gray-300 px-2 py-2 text-center text-xs ${getCellStyle(entry)}`}>
                                {renderCellContent(entry)}
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
        ))}
      </div>
    </div>
  );
};

export default SectionTimetables;
