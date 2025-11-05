import React from 'react';
import { Search } from 'lucide-react';

export default function CSFSelectors({  semesters, selectedBatch, selectedSemester, setSelectedSemester, onGenerate }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          <option value="">Choose Batch</option>
          {batches.map((b) => (<option key={b} value={b}>{b}</option>))}
        </select>
      </div> */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
          <option value="">Choose Semester</option>
          {semesters.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>
      <div className="flex items-end">
        <button onClick={onGenerate} disabled={!selectedBatch || !selectedSemester} className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Generate Common Slots
        </button>
      </div>
    </div>
  );
}
