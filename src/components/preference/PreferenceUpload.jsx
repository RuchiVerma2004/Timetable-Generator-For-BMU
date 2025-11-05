import React from 'react';

export default function PreferenceUpload({ onFileChange, loading }) {
  return (
    <div className="upload-section mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload Course Allocation Excel</h3>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={onFileChange}
          disabled={loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Processing...
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">Upload the Excel file containing fixed faculty assignments and elective courses</p>
    </div>
  );
}
