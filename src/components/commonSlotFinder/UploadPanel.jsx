import React from 'react';
import { Upload } from 'lucide-react';

export default function CSFUploadPanel({ onFileChange, status }) {
  return (
    <label className="flex flex-col items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-400 transition mb-6">
      <Upload className="w-12 h-12 text-gray-400 mb-3" />
      <span className="text-lg font-medium text-gray-700 mb-1">Upload Timetable (Section_Timetables.xlsx)</span>
      <span className="text-sm text-gray-500 mb-2">Use exported Section timetables</span>
      <input type="file" accept=".xlsx,.xls" onChange={onFileChange} className="hidden" />
      {status && <span className="text-xs text-gray-500 mt-2">{status}</span>}
    </label>
  );
}
