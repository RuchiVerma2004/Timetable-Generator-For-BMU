import React from 'react';

export default function FixedAssignmentsView({ fixedAssignments, sectionsCount }) {
  return (
    <div className="fixed-assignments mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Fixed Faculty Assignments ({sectionsCount} sections detected)</h4>
      {Object.keys(fixedAssignments).length === 0 ? (
        <p className="text-gray-500 text-sm">No fixed assignments found.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(fixedAssignments).map(([course, data]) => (
            <div key={course} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2">
                {course} <span className="text-sm text-gray-600">({data.semester})</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(data.fixedSections).map(([section, facultyInfo]) => (
                  <div key={section} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-gray-700">{section}:</span>
                    <span className={`text-sm ${facultyInfo.isLab ? 'text-purple-600' : 'text-green-600'} font-medium`}>
                      {facultyInfo.faculty}{facultyInfo.isLab && ' (LAB)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
