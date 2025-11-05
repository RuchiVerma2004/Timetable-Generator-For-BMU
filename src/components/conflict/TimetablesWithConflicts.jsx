import React from 'react';
import { AlertTriangle } from 'lucide-react';

const getConflictColor = (conflictType, severity) => {
  if (severity === 'high') {
    return conflictType === 'professor' ? 'bg-red-200 border-red-400' : 
           conflictType === 'room' ? 'bg-orange-200 border-orange-400' : 
           'bg-yellow-200 border-yellow-400';
  }
  return 'bg-yellow-100 border-yellow-300';
};

export default function TimetablesWithConflicts({ timetables, conflicts }) {
  if (!conflicts) return null;

  const allConflicts = [
    ...conflicts.professorConflicts,
    ...conflicts.roomConflicts
  ];

  const renderTimetableWithConflicts = (timetable) => (
    <div key={`${timetable.fileName}-${timetable.sheetName}`} className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {timetable.fileName} - {timetable.sheetName}
      </h3>
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Day</th>
              {timetable.timeSlots.map(slot => (
                <th key={slot} className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs">{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.data.slice(1).map((row, dayIndex) => (
              <tr key={dayIndex}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{row[0]}</td>
                {row.slice(1).map((entry, slotIndex) => {
                  const cellConflicts = allConflicts.filter(conflict => {
                    return conflict.conflictingEntries.some(conflictEntry => 
                      conflictEntry.timetable === timetable.fileName &&
                      conflictEntry.sheet === timetable.sheetName &&
                      conflictEntry.dayIndex === dayIndex &&
                      conflictEntry.slotIndex === slotIndex
                    );
                  });

                  const hasConflict = cellConflicts.length > 0;
                  const conflictType = hasConflict ? cellConflicts[0].type : null;
                  const severity = hasConflict ? cellConflicts[0].severity : null;

                  return (
                    <td 
                      key={slotIndex} 
                      className={`border border-gray-300 px-2 py-2 text-center text-xs ${hasConflict ? getConflictColor(conflictType, severity) : ''}`}
                    >
                      {entry ? (
                        <div className="relative">
                          <div className="text-xs">
                            {entry.split('\n').map((line, i) => (
                              <div key={i} className={i === 0 ? 'font-semibold' : ''}>{line}</div>
                            ))}
                          </div>
                          {hasConflict && (
                            <div className="absolute -top-1 -right-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                          )}
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
  );

  return (
    <div>
      {timetables.map(t => renderTimetableWithConflicts(t))}
    </div>
  );
}
