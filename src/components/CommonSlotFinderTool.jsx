import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import CSFUploadPanel from './commonSlotFinder/UploadPanel';
import CSFSelectors from './commonSlotFinder/Selectors';
import CSFResultsGrid from './commonSlotFinder/ResultsGrid';
import { Search, Calendar } from 'lucide-react';

const CommonSlotFinderTool = () => {
  const [timetable, setTimetable] = useState(null);
  const [DAYS, setDAYS] = useState([]);
  const [generateTimeSlots, setGenerateTimeSlots] = useState([]);
  // selectedBatch was removed in favor of semester-wide selection
  const [selectedSemester, setSelectedSemester] = useState('');
  const [commonSlots, setCommonSlots] = useState(null);
  const [includeAllSections, setIncludeAllSections] = useState(false);
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

            // First row: [Day, slot1, slot2, ...]
            const header = rows[0];
            const slots = header.slice(1).map((s) => (typeof s === 'string' ? s.trim() : `${s}`));
            if (slots.length > detectedSlots.length) detectedSlots = slots;

            // Following rows: each day
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

  const { semesters } = useMemo(() => {
    if (!timetable) return { semesters: [] };
    const semSet = new Set();
    Object.keys(timetable).forEach((key) => {
      const parts = key.split('_');
      if (parts.length >= 4) {
        semSet.add(parts[3]);
      }
    });
    return { semesters: Array.from(semSet).sort() };
  }, [timetable]);

  const findCommonFreeSlots = () => {
    if (!timetable) return;
    let sectionsToCheck = [];

    // First, get all sections for the selected semester
    if (!selectedSemester && !includeAllSections) {
      alert('Please select a semester or enable "Across all sections"');
      return;
    }

    // Get sections based on selection
    if (includeAllSections) {
      sectionsToCheck = Object.keys(timetable);
    } else {
      sectionsToCheck = Object.keys(timetable).filter(key => {
        const parts = key.split('_');
        return parts.length >= 4 && parts[3] === selectedSemester;
      });
    }

    if (sectionsToCheck.length === 0) {
      alert(includeAllSections ? 'No sections found in timetable' : `No sections found for semester ${selectedSemester}`);
      return;
    }

    // Initialize common slots data structure
    const common = {};
    const slotStatus = {}; // Track detailed status of each slot

    // First pass: collect all slot statuses
    DAYS.forEach(day => {
      common[day] = [];
      slotStatus[day] = {};
      
      generateTimeSlots.forEach(slot => {
        slotStatus[day][slot] = {
          isFree: true,
          sections: [],
          status: [] // Track what's happening in each section
        };

        sectionsToCheck.forEach(section => {
          const daySchedule = timetable[section][day] || [];
          const entry = daySchedule.find(e => e.time === slot);
          
          if (!entry) {
            slotStatus[day][slot].sections.push(section);
            slotStatus[day][slot].status.push('empty');
          } else {
            const courseText = (entry.course || '').toString().trim().toUpperCase();
            if (courseText === 'FREE' || courseText === 'LUNCH' || courseText.length === 0) {
              slotStatus[day][slot].sections.push(section);
              slotStatus[day][slot].status.push(courseText || 'empty');
            } else {
              slotStatus[day][slot].isFree = false;
              slotStatus[day][slot].status.push(courseText);
            }
          }
        });
      });
    });

    // Second pass: identify truly common free slots
    DAYS.forEach(day => {
      generateTimeSlots.forEach(slot => {
        const slotInfo = slotStatus[day][slot];
        if (slotInfo.isFree && slotInfo.sections.length === sectionsToCheck.length) {
          common[day].push({
            slot,
            sections: sectionsToCheck.length,
            status: slotInfo.status // Include status for UI feedback
          });
        }
      });
    });

    setCommonSlots({
      semester: selectedSemester,
      sections: sectionsToCheck,
      slots: common,
      slotStatus // Include detailed status for better UI feedback
    });
  };

  const exportCommonSlots = () => {
    if (!commonSlots) return;
    const wb = XLSX.utils.book_new();
    const wsData = [];
    wsData.push([`Common Free Slots - Batch ${commonSlots.batch}, Semester ${commonSlots.semester}`]);
    wsData.push([`Total Sections: ${commonSlots.sections.length}`]);
    wsData.push([]);
    wsData.push(['Day', 'Free Time Slots', 'Total Free Slots']);
    DAYS.forEach((day) => {
      const slots = commonSlots.slots[day];
      const slotTimes = slots.map((s) => s.slot).join(', ');
      wsData.push([day, slotTimes || 'None', slots.length]);
    });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Common Free Slots');
    XLSX.writeFile(wb, `Common_Slots_Batch${commonSlots.batch}_Sem${commonSlots.semester}.xlsx`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Common Slot Finder</h2>
      </div>

      <CSFUploadPanel onFileChange={handleUpload} status={status} />

      {!timetable ? (
        <div className="text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Upload a timetable to find common slots</p>
        </div>
      ) : (
        <>
          <CSFSelectors
            semesters={semesters}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            includeAllSections={includeAllSections}
            setIncludeAllSections={setIncludeAllSections}
            onGenerate={findCommonFreeSlots}
          />

          <CSFResultsGrid DAYS={DAYS} commonSlots={commonSlots} exportCommonSlots={exportCommonSlots} />
        </>
      )}
    </div>
  );
};

export default CommonSlotFinderTool;


