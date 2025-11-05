import React from 'react';
import { Download, Calendar } from 'lucide-react';

export default function CSFResultsGrid({ DAYS, commonSlots, exportCommonSlots }) {
  if (!commonSlots) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Results: Batch {commonSlots.batch}, Semester {commonSlots.semester}</h3>
          <p className="text-sm text-gray-600">Checking {commonSlots.sections.length} sections</p>
        </div>
        <button onClick={exportCommonSlots} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map((day) => (
          <div key={day} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              {day}
            </h4>
            {commonSlots.slots[day].length > 0 ? (
              <div className="space-y-2">
                {commonSlots.slots[day].map((item, idx) => (
                  <div key={idx} className="bg-green-50 border border-green-200 rounded px-3 py-2">
                    <div className="text-sm font-medium text-green-800">{item.slot}</div>
                  </div>
                ))}
                <div className="text-xs text-gray-500 mt-2">Total: {commonSlots.slots[day].length} free slots</div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No common free slots</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
