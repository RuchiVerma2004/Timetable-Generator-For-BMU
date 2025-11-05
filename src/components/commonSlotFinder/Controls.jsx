import React from 'react';
import { Search, DoorOpen, Filter, X } from 'lucide-react';

export default function CSFControls({
  activeTab, setActiveTab,
  batches, semesters, selectedBatch, setSelectedBatch, selectedSemester, setSelectedSemester, onFindCommon,
  timeRangeStart, setTimeRangeStart, timeRangeEnd, setTimeRangeEnd, onFindRooms, onClearTimeRange
}) {
  return (
    <>
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button onClick={() => setActiveTab('common-slots')} className={`pb-3 px-4 font-medium transition ${activeTab === 'common-slots' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <div className="flex items-center gap-2"><Search className="w-5 h-5" />Common Free Slots</div>
        </button>
        <button onClick={() => setActiveTab('room-availability')} className={`pb-3 px-4 font-medium transition ${activeTab === 'room-availability' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <div className="flex items-center gap-2"><DoorOpen className="w-5 h-5" />Room Availability</div>
        </button>
      </div>

      {activeTab === 'common-slots' && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">Choose Batch</option>
              {batches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">Choose Semester</option>
              {semesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={onFindCommon} disabled={!selectedBatch || !selectedSemester} className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Find Common Slots
            </button>
          </div>
        </div>
      )}

      {activeTab === 'room-availability' && (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input type="time" value={timeRangeStart} onChange={(e) => setTimeRangeStart(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input type="time" value={timeRangeEnd} onChange={(e) => setTimeRangeEnd(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button onClick={onFindRooms} disabled={!timeRangeStart || !timeRangeEnd} className="flex-1 bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
              <Filter className="w-5 h-5" /> Find Available Rooms
            </button>
            {(timeRangeStart || timeRangeEnd) && (
              <button onClick={onClearTimeRange} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"><X className="w-5 h-5" /></button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
