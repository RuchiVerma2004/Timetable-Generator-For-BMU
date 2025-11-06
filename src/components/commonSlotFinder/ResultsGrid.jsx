import React, { useState } from 'react';
import { Download, Calendar, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function CSFResultsGrid({ DAYS, commonSlots, exportCommonSlots }) {
  const [expandedSlots, setExpandedSlots] = useState({});

  if (!commonSlots) return null;

  const toggleSlotDetails = (day, slot) => {
    setExpandedSlots(prev => ({
      ...prev,
      [`${day}_${slot}`]: !prev[`${day}_${slot}`]
    }));
  };

  const getStatusColor = status => {
    if (status === 'LUNCH') return 'text-orange-700 bg-orange-50';
    if (status === 'FREE') return 'text-green-700 bg-green-50';
    return 'text-blue-700 bg-blue-50';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Results: {commonSlots.semester ? `Semester ${commonSlots.semester}` : 'All Sections'}
          </h3>
          <p className="text-sm text-gray-600">Found common slots across {commonSlots.sections.length} sections</p>
        </div>
        <button 
          onClick={exportCommonSlots} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
        >
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
              <div className="space-y-3">
                {commonSlots.slots[day].map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleSlotDetails(day, item.slot)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{item.slot}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>
                      {expandedSlots[`${day}_${item.slot}`] ? 
                        <ChevronUp className="w-4 h-4 text-gray-500" /> :
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      }
                    </div>
                    {expandedSlots[`${day}_${item.slot}`] && (
                      <div className="px-3 py-2 space-y-2">
                        <div className="flex items-start gap-1.5">
                          <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="text-xs text-gray-600">
                            Status across sections:
                          </div>
                        </div>
                        <div className="space-y-1">
                          {item.status.map((status, statusIdx) => (
                            <div 
                              key={statusIdx}
                              className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}
                            >
                              Section {statusIdx + 1}: {status || 'Empty'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                  <span className="font-medium">Total:</span> 
                  {commonSlots.slots[day].length} common free {commonSlots.slots[day].length === 1 ? 'slot' : 'slots'}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>No common free slots found</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
