import React from 'react';

export default function ElectiveCoursesView({ electiveCourses }) {
  return (
    <div className="elective-courses">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Elective Courses</h4>
      {Object.keys(electiveCourses).length === 0 ? (
        <p className="text-gray-500 text-sm">No elective courses found.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.values(electiveCourses).map((elective, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h6 className="font-medium text-gray-800">{elective.course}</h6>
                  <p className="text-sm text-gray-600">{elective.specialization} • {elective.semester} • {elective.sections} section(s)</p>
                </div>
                <span className="text-sm font-medium text-blue-600">{elective.faculty}</span>
              </div>
              {elective.remarks && <p className="text-xs text-gray-500 mt-1">{elective.remarks}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
