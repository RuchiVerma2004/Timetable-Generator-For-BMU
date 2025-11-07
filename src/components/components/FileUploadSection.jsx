import React from 'react';
import { Upload, Info } from 'lucide-react';

const FileUploadSection = ({ courses, professors, rooms, onFileUpload }) => {
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Excel File Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Courses:</strong> Course Abb, Course Title, Course Code, L-D-P, Semester, Sections, Batch, Category, Specializations</li>
            <li><strong>Professors:</strong> Course Abb, Name, Email, Semester, Day, Availability</li>
            <li><strong>Rooms:</strong> Room ID, Room Name, Type (lecture/lab/hall), Capacity</li>
            <li><strong>Preferences:</strong> Teacher, Course Code, Section, Semester, Batch, Preference (1-5)</li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700 mb-2">Upload Courses</span>
            <span className="text-xs text-gray-500">{courses.length} courses loaded</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onFileUpload(e, 'courses')}
              className="hidden"
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700 mb-2">Upload Professors</span>
            <span className="text-xs text-gray-500">{professors.length} professors loaded</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onFileUpload(e, 'professors')}
              className="hidden"
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700 mb-2">Upload Rooms</span>
            <span className="text-xs text-gray-500">{rooms.length} rooms loaded</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onFileUpload(e, 'rooms')}
              className="hidden"
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700 mb-2">Upload Preferences</span>
            <span className="text-xs text-gray-500">Teacher preferences</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => onFileUpload(e, 'preferences')}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default FileUploadSection;
