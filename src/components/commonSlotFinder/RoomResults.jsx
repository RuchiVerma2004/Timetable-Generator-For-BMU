import React from 'react';
import { DoorOpen } from 'lucide-react';

export default function RoomResults({ availableRooms, DAYS, exportAvailableRooms }) {
  if (!availableRooms) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Available Rooms: {availableRooms.timeRange}</h3>
          <p className="text-sm text-gray-600">Found {Object.keys(availableRooms.rooms).length} rooms with availability</p>
        </div>
        <button onClick={exportAvailableRooms} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2">
          Export
        </button>
      </div>

      <div className="space-y-4">
        {Object.keys(availableRooms.rooms).sort().map(room => {
          const totalSlots = DAYS.reduce((sum, day) => sum + availableRooms.rooms[room][day].length, 0);
          return (
            <div key={room} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2"><DoorOpen className="w-5 h-5 text-orange-600" />{room}</span>
                <span className="text-sm font-normal text-gray-600">{totalSlots} available slots</span>
              </h4>
              <div className="grid md:grid-cols-5 gap-3">
                {DAYS.map(day => (
                  <div key={day} className="bg-gray-50 rounded p-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">{day}</div>
                    {availableRooms.rooms[room][day].length > 0 ? (
                      <div className="space-y-1">
                        {availableRooms.rooms[room][day].map((slot, idx) => (
                          <div key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{slot}</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Not available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
