import React from 'react';
import { Upload, AlertTriangle, RefreshCw, Download } from 'lucide-react';

export default function ConflictUpload({ timetablesCount, status, loading, onFileChange, onDetect, onExport }) {
  return (
    <>
      <div className="mb-6">
        <label className="flex flex-col items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-red-400 transition">
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-lg font-medium text-gray-700 mb-2">Upload Timetable Files</span>
          <span className="text-sm text-gray-500 mb-4">Select multiple Excel files containing timetables</span>
          <input type="file" accept=".xlsx,.xls" multiple onChange={onFileChange} className="hidden" />
          <span className="text-xs text-gray-400">{timetablesCount} files loaded</span>
        </label>
      </div>

      {status?.message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          status.type === 'error' ? 'bg-red-50 text-red-700' :
          status.type === 'success' ? 'bg-green-50 text-green-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          <AlertTriangle className="w-5 h-5" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={onDetect}
          disabled={loading || timetablesCount === 0}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Detect Conflicts'}
        </button>

        <button
          onClick={onExport}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
    </>
  );
}
