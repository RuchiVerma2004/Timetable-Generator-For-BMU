import React from 'react';

const TimetableTypeSelector = ({ selectedType, setSelectedType }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">View Timetable By</h2>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-medium border ${selectedType === 'student' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedType('student')}
        >Student Timetable</button>
        <button
          className={`px-4 py-2 rounded-lg font-medium border ${selectedType === 'professor' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedType('professor')}
        >Professor Timetable</button>
        <button
          className={`px-4 py-2 rounded-lg font-medium border ${selectedType === 'room' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedType('room')}
        >Room Timetable</button>
      </div>
    </div>
  );
};

export default TimetableTypeSelector;
