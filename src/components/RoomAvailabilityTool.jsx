import React, { useState } from 'react';
import { Upload, Filter, Download, DoorOpen, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

const RoomAvailabilityTool = () => {
  const [timetable, setTimetable] = useState(null);
  const [DAYS, setDAYS] = useState([]);
  const [generateTimeSlots, setGenerateTimeSlots] = useState([]);
  const [timeRangeStart, setTimeRangeStart] = useState('');
  const [timeRangeEnd, setTimeRangeEnd] = useState('');
  const [availableRooms, setAvailableRooms] = useState(null);
  const [status, setStatus] = useState('');

  const parseUploadedWorkbook = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const parsedTimetable = {};
          let detectedDays = [];
          let detectedSlots = [];

          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (!rows || rows.length < 2) return;

            const header = rows[0];
            const slots = header.slice(1).map((s) => (typeof s === 'string' ? s.trim() : `${s}`));
            if (slots.length > detectedSlots.length) detectedSlots = slots;

            const days = rows.slice(1).map((r) => r[0]).filter(Boolean);
            if (days.length > detectedDays.length) detectedDays = days;

            if (!parsedTimetable[sheetName]) parsedTimetable[sheetName] = {};
            days.forEach((dayRow, idx) => {
              const day = rows[idx + 1][0];
              parsedTimetable[sheetName][day] = [];
              slots.forEach((slot, sIdx) => {
                const cell = rows[idx + 1][sIdx + 1];
                let entry = null;
                if (cell && typeof cell === 'string') {
                  const text = cell.trim();
                  if (text.toUpperCase().includes('LUNCH')) {
                    entry = { time: slot, course: 'LUNCH' };
                  } else if (text.toUpperCase().includes('FREE')) {
                    entry = { time: slot, course: 'FREE' };
                  } else if (text !== '-' && text.length) {
                    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
                    entry = {
                      time: slot,
                      course: lines[0] || '-',
                      teacher: lines[1] || '',
                      room: lines[2] || ''
                    };
                  }
                }
                if (entry) parsedTimetable[sheetName][day].push(entry);
              });
            });
          });

          resolve({ timetable: parsedTimetable, DAYS: detectedDays, slots: detectedSlots });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Processing file...');
    try {
      const { timetable: tt, DAYS: days, slots } = await parseUploadedWorkbook(file);
      setTimetable(tt);
      setDAYS(days);
      setGenerateTimeSlots(slots);
      setStatus(`Loaded ${Object.keys(tt).length} section sheet(s)`);
    } catch (err) {
      console.error(err);
      setStatus('Failed to parse file. Ensure it is an exported Section_Timetables.xlsx.');
    }
  };

  const parseTimeSlot = (slot) => {
    const match = slot.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
    if (!match) return null;
    return {
      start: parseInt(match[1]) * 60 + parseInt(match[2]),
      end: parseInt(match[3]) * 60 + parseInt(match[4])
    };
  };

  const isSlotInRange = (slot, rangeStart, rangeEnd) => {
    const parsed = parseTimeSlot(slot);
    if (!parsed || !rangeStart || !rangeEnd) return false;
    const rangeStartMinutes = parseInt(rangeStart.split(':')[0]) * 60 + parseInt(rangeStart.split(':')[1]);
    const rangeEndMinutes = parseInt(rangeEnd.split(':')[0]) * 60 + parseInt(rangeEnd.split(':')[1]);
    return parsed.start >= rangeStartMinutes && parsed.end <= rangeEndMinutes;
  };

  const findAvailableRooms = () => {
    if (!timetable || !timeRangeStart || !timeRangeEnd) {
      alert('Please upload timetable and select time range');
      return;
    }
    const roomAvailability = {};
    Object.keys(timetable).forEach((section) => {
      DAYS.forEach((day) => {
        (timetable[section][day] || []).forEach((entry) => {
          if (entry.room && entry.room !== '-') {
            if (!roomAvailability[entry.room]) {
              roomAvailability[entry.room] = {};
              DAYS.forEach((d) => {
                roomAvailability[entry.room][d] = [];
              });
            }
          }
        });
      });
    });
    Object.keys(roomAvailability).forEach((room) => {
      DAYS.forEach((day) => {
        generateTimeSlots.forEach((slot) => {
          if (!isSlotInRange(slot, timeRangeStart, timeRangeEnd)) return;
          let isOccupied = false;
          Object.keys(timetable).forEach((section) => {
            const daySchedule = timetable[section][day] || [];
            const entry = daySchedule.find((e) => e.time === slot && e.room === room);
            if (entry && entry.course !== 'LUNCH' && entry.course !== 'FREE') {
              isOccupied = true;
            }
          });
          if (!isOccupied) {
            roomAvailability[room][day].push(slot);
          }
        });
      });
    });
    const filteredRooms = {};
    Object.keys(roomAvailability).forEach((room) => {
      const hasAvailability = DAYS.some((day) => roomAvailability[room][day].length > 0);
      if (hasAvailability) filteredRooms[room] = roomAvailability[room];
    });
    setAvailableRooms({ timeRange: `${timeRangeStart} - ${timeRangeEnd}`, rooms: filteredRooms });
  };

  const exportAvailableRooms = () => {
    if (!availableRooms) return;
    const wb = XLSX.utils.book_new();
    const wsData = [];
    wsData.push([`Available Rooms - Time Range: ${availableRooms.timeRange}`]);
    wsData.push([]);
    wsData.push(['Room', 'Day', 'Available Time Slots', 'Total Free Slots']);
    Object.keys(availableRooms.rooms)
      .sort()
      .forEach((room) => {
        DAYS.forEach((day) => {
          const slots = availableRooms.rooms[room][day];
          const slotTimes = slots.join(', ');
          wsData.push([room, day, slotTimes || 'None', slots.length]);
        });
        wsData.push([]);
      });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Available Rooms');
    XLSX.writeFile(wb, `Available_Rooms_${timeRangeStart.replace(':', '')}-${timeRangeEnd.replace(':', '')}.xlsx`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <DoorOpen className="w-7 h-7 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-800">Room Availability</h2>
      </div>

      <label className="flex flex-col items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-orange-400 transition mb-6">
        <Upload className="w-12 h-12 text-gray-400 mb-3" />
        <span className="text-lg font-medium text-gray-700 mb-1">Upload Timetable (Section_Timetables.xlsx)</span>
        <span className="text-sm text-gray-500 mb-2">Use exported Section timetables</span>
        <input type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
        {status && <span className="text-xs text-gray-500 mt-2">{status}</span>}
      </label>

      {!timetable ? (
        <div className="text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Upload a timetable to check room availability</p>
        </div>
      ) : (
        <>
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
              <button onClick={findAvailableRooms} disabled={!timeRangeStart || !timeRangeEnd} className="flex-1 bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                <Filter className="w-5 h-5" />
                Generate Room Availability
              </button>
            </div>
          </div>

          {availableRooms && (
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Available Rooms: {availableRooms.timeRange}</h3>
                  <p className="text-sm text-gray-600">Found {Object.keys(availableRooms.rooms).length} rooms with availability</p>
                </div>
                <button onClick={exportAvailableRooms} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <div className="space-y-4">
                {Object.keys(availableRooms.rooms)
                  .sort()
                  .map((room) => {
                    const totalSlots = DAYS.reduce((sum, day) => sum + availableRooms.rooms[room][day].length, 0);
                    return (
                      <div key={room} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <DoorOpen className="w-5 h-5 text-orange-600" />
                            {room}
                          </span>
                          <span className="text-sm font-normal text-gray-600">{totalSlots} available slots</span>
                        </h4>
                        <div className="grid md:grid-cols-5 gap-3">
                          {DAYS.map((day) => (
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
          )}
        </>
      )}
    </div>
  );
};

export default RoomAvailabilityTool;


