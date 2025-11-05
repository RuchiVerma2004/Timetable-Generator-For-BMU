import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Controls from './commonSlotFinder/Controls';
import CommonResults from './commonSlotFinder/CommonResults';
import RoomResults from './commonSlotFinder/RoomResults';

const CommonSlotFinder = ({ timetable, generateTimeSlots, DAYS, defaultTab }) => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [timeRangeStart, setTimeRangeStart] = useState('');
  const [timeRangeEnd, setTimeRangeEnd] = useState('');
  const [commonSlots, setCommonSlots] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab === 'room-availability' ? 'room-availability' : 'common-slots');

  // Extract unique batches and semesters from timetable
  const { batches, semesters } = useMemo(() => {
    if (!timetable) return { batches: [], semesters: [] };

    const batchSet = new Set();
    const semesterSet = new Set();

    Object.keys(timetable).forEach(key => {
      const parts = key.split('_');
      if (parts.length >= 4) {
        batchSet.add(parts[1]); // Batch
        semesterSet.add(parts[3]); // Semester
      }
    });

    return {
      batches: Array.from(batchSet).sort(),
      semesters: Array.from(semesterSet).sort()
    };
  }, [timetable]);

  // Parse time slot to get start and end in minutes
  const parseTimeSlot = (slot) => {
    const match = slot.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
    if (!match) return null;
    return {
      start: parseInt(match[1]) * 60 + parseInt(match[2]),
      end: parseInt(match[3]) * 60 + parseInt(match[4])
    };
  };

  // Check if a slot falls within time range
  const isSlotInRange = (slot, rangeStart, rangeEnd) => {
    const parsed = parseTimeSlot(slot);
    if (!parsed || !rangeStart || !rangeEnd) return false;

    const rangeStartMinutes = parseInt(rangeStart.split(':')[0]) * 60 + parseInt(rangeStart.split(':')[1]);
    const rangeEndMinutes = parseInt(rangeEnd.split(':')[0]) * 60 + parseInt(rangeEnd.split(':')[1]);

    return parsed.start >= rangeStartMinutes && parsed.end <= rangeEndMinutes;
  };

  // Find common free slots across all sections
  const findCommonFreeSlots = () => {
    if (!timetable || !selectedBatch || !selectedSemester) return;

    const sectionsToCheck = Object.keys(timetable).filter(key => {
      return key.includes(`Batch_${selectedBatch}`) && key.includes(`Sem_${selectedSemester}`);
    });

    if (sectionsToCheck.length === 0) {
      alert('No sections found for selected batch and semester');
      return;
    }

    const commonFreeSlots = {};

    DAYS.forEach(day => {
      commonFreeSlots[day] = [];

      generateTimeSlots.forEach(slot => {
        // Check if this slot is free in ALL sections
        const isFreeInAllSections = sectionsToCheck.every(section => {
          const daySchedule = timetable[section][day];
          const entry = daySchedule.find(e => e.time === slot);

          // Slot is free if there's no entry, or if it's marked as FREE
          return !entry || entry.course === 'FREE';
        });

        if (isFreeInAllSections) {
          commonFreeSlots[day].push({
            slot,
            sections: sectionsToCheck.length
          });
        }
      });
    });

    setCommonSlots({
      batch: selectedBatch,
      semester: selectedSemester,
      sections: sectionsToCheck,
      slots: commonFreeSlots
    });
  };

  // Find available rooms in time range
  const findAvailableRooms = () => {
    if (!timetable || !timeRangeStart || !timeRangeEnd) {
      alert('Please select time range');
      return;
    }

    const roomAvailability = {};

    // Collect all rooms from timetable
    Object.keys(timetable).forEach(section => {
      DAYS.forEach(day => {
        timetable[section][day].forEach(entry => {
          if (entry.room && entry.room !== '-') {
            if (!roomAvailability[entry.room]) {
              roomAvailability[entry.room] = {};
              DAYS.forEach(d => {
                roomAvailability[entry.room][d] = [];
              });
            }
          }
        });
      });
    });

    // Check availability for each room
    Object.keys(roomAvailability).forEach(room => {
      DAYS.forEach(day => {
        generateTimeSlots.forEach(slot => {
          if (!isSlotInRange(slot, timeRangeStart, timeRangeEnd)) return;

          // Check if room is occupied in this slot
          let isOccupied = false;

          Object.keys(timetable).forEach(section => {
            const daySchedule = timetable[section][day];
            const entry = daySchedule.find(e => e.time === slot && e.room === room);

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

    // Filter rooms that have at least some availability
    const filteredRooms = {};
    Object.keys(roomAvailability).forEach(room => {
      const hasAvailability = DAYS.some(day => roomAvailability[room][day].length > 0);
      if (hasAvailability) {
        filteredRooms[room] = roomAvailability[room];
      }
    });

    setAvailableRooms({
      timeRange: `${timeRangeStart} - ${timeRangeEnd}`,
      rooms: filteredRooms
    });
  };

  // Export common slots to Excel
  const exportCommonSlots = () => {
    if (!commonSlots) return;

    const wb = XLSX.utils.book_new();
    const wsData = [];

    wsData.push([`Common Free Slots - Batch ${commonSlots.batch}, Semester ${commonSlots.semester}`]);
    wsData.push([`Total Sections: ${commonSlots.sections.length}`]);
    wsData.push([]);
    wsData.push(['Day', 'Free Time Slots', 'Total Free Slots']);

    DAYS.forEach(day => {
      const slots = commonSlots.slots[day];
      const slotTimes = slots.map(s => s.slot).join(', ');
      wsData.push([day, slotTimes || 'None', slots.length]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Common Free Slots');
    XLSX.writeFile(wb, `Common_Slots_Batch${commonSlots.batch}_Sem${commonSlots.semester}.xlsx`);
  };

  // Export available rooms to Excel
  const exportAvailableRooms = () => {
    if (!availableRooms) return;

    const wb = XLSX.utils.book_new();
    const wsData = [];

    wsData.push([`Available Rooms - Time Range: ${availableRooms.timeRange}`]);
    wsData.push([]);
    wsData.push(['Room', 'Day', 'Available Time Slots', 'Total Free Slots']);

    Object.keys(availableRooms.rooms).sort().forEach(room => {
      DAYS.forEach(day => {
        const slots = availableRooms.rooms[room][day];
        const slotTimes = slots.join(', ');
        wsData.push([room, day, slotTimes || 'None', slots.length]);
      });
      wsData.push([]); // Empty row between rooms
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Available Rooms');
    XLSX.writeFile(wb, `Available_Rooms_${timeRangeStart.replace(':', '')}-${timeRangeEnd.replace(':', '')}.xlsx`);
  };

  if (!timetable) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg">Please generate a timetable first to use this feature</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Advanced Search Tools</h2>

      <Controls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        batches={batches}
        semesters={semesters}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        onFindCommon={findCommonFreeSlots}
        timeRangeStart={timeRangeStart}
        setTimeRangeStart={setTimeRangeStart}
        timeRangeEnd={timeRangeEnd}
        setTimeRangeEnd={setTimeRangeEnd}
        onFindRooms={findAvailableRooms}
        onClearTimeRange={() => { setTimeRangeStart(''); setTimeRangeEnd(''); setAvailableRooms(null); }}
      />

      {activeTab === 'common-slots' && (
        <div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-800"><strong>Find Common Free Slots:</strong> This tool finds time slots that are free across ALL sections of a specific batch and semester at the same time. Perfect for scheduling common activities, events, or meetings.</p>
          </div>

          {commonSlots && <CommonResults commonSlots={commonSlots} DAYS={DAYS} exportCommonSlots={exportCommonSlots} />}
        </div>
      )}

      {activeTab === 'room-availability' && (
        <div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800"><strong>Find Available Rooms:</strong> Enter a time range to find all rooms that are free during that period throughout the week. Great for booking extra classes or events.</p>
          </div>

          {availableRooms && <RoomResults availableRooms={availableRooms} DAYS={DAYS} exportAvailableRooms={exportAvailableRooms} />}
        </div>
      )}
    </div>
  );
};

export default CommonSlotFinder;