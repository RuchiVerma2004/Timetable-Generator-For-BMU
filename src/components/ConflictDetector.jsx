import React, { useState, useMemo } from 'react';
import { Upload, AlertTriangle, Users, MapPin, BookOpen, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import ConflictUpload from './conflict/ConflictUpload';
import TimetablesWithConflicts from './conflict/TimetablesWithConflicts';
import ConflictList from './conflict/ConflictList';

const ConflictDetector = () => {
  const [timetables, setTimetables] = useState([]);
  const [conflicts, setConflicts] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [selectedConflictType, setSelectedConflictType] = useState('all');

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Parse Excel files
  const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = {};
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            sheets[sheetName] = jsonData;
          });
          
          resolve(sheets);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    setStatus({ type: 'info', message: 'Processing timetable files...' });

    try {
      const processedTimetables = [];
      
      for (const file of files) {
        const sheets = await parseExcel(file);
        
        Object.entries(sheets).forEach(([sheetName, data]) => {
          if (data.length > 1) { // Has header and data
            const timetable = {
              fileName: file.name,
              sheetName: sheetName,
              data: data,
              timeSlots: data[0]?.slice(1) || [], // First row excluding 'Day' column
              days: data.slice(1).map(row => row[0]) || [] // First column excluding header
            };
            processedTimetables.push(timetable);
          }
        });
      }

      setTimetables(processedTimetables);
      setStatus({ type: 'success', message: `Loaded ${processedTimetables.length} timetable sheets` });
    } catch (error) {
      setStatus({ type: 'error', message: `Error processing files: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Extract professor and room information from timetable entries
  const extractEntryInfo = (entry) => {
    if (!entry || typeof entry !== 'string') return null;
    
    const lines = entry.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const course = lines[0]?.trim();
    const teacher = lines[1]?.trim() || '';
    const room = lines[2]?.trim() || '';
    
    return {
      course: course,
      teacher: teacher,
      room: room,
      originalEntry: entry
    };
  };

  // Detect conflicts in timetables
  const detectConflicts = () => {
    if (!timetables.length) {
      setStatus({ type: 'error', message: 'Please upload timetable files first' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Analyzing timetables for conflicts...' });

    setTimeout(() => {
      try {
        const detectedConflicts = {
          professorConflicts: [],
          roomConflicts: [],
          
          summary: {
            totalConflicts: 0,
            professorConflicts: 0,
            roomConflicts: 0
          }
        };

        // Create a map to track all entries across timetables
        const allEntries = [];
        
        timetables.forEach(timetable => {
          timetable.data.slice(1).forEach((row, dayIndex) => {
            const day = row[0];
            row.slice(1).forEach((entry, slotIndex) => {
              const entryInfo = extractEntryInfo(entry);
              if (entryInfo && entryInfo.course && entryInfo.course !== 'LUNCH' && entryInfo.course !== 'FREE') {
                allEntries.push({
                  timetable: timetable.fileName,
                  sheet: timetable.sheetName,
                  day: day,
                  timeSlot: timetable.timeSlots[slotIndex],
                  dayIndex: dayIndex,
                  slotIndex: slotIndex,
                  ...entryInfo
                });
              }
            });
          });
        });

        // Detect Professor Conflicts
        const professorMap = new Map();
        allEntries.forEach(entry => {
          if (entry.teacher) {
            const key = `${entry.day}-${entry.timeSlot}-${entry.teacher}`;
            if (!professorMap.has(key)) {
              professorMap.set(key, []);
            }
            professorMap.get(key).push(entry);
          }
        });

        professorMap.forEach((entries) => {
          if (entries.length > 1) {
            const conflictId = `PROF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            detectedConflicts.professorConflicts.push({
              id: conflictId,
              type: 'professor',
              professor: entries[0].teacher,
              day: entries[0].day,
              timeSlot: entries[0].timeSlot,
              conflictingEntries: entries,
              severity: 'high',
              conflictCount: entries.length,
              description: `Professor ${entries[0].teacher} has ${entries.length} classes at ${entries[0].day} ${entries[0].timeSlot}`
            });
            detectedConflicts.summary.professorConflicts++;
          }
        });

        // Detect Room Conflicts
        const roomMap = new Map();
        allEntries.forEach(entry => {
          if (entry.room) {
            const key = `${entry.day}-${entry.timeSlot}-${entry.room}`;
            if (!roomMap.has(key)) {
              roomMap.set(key, []);
            }
            roomMap.get(key).push(entry);
          }
        });

        roomMap.forEach((entries) => {
          if (entries.length > 1) {
            const conflictId = `ROOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            detectedConflicts.roomConflicts.push({
              id: conflictId,
              type: 'room',
              room: entries[0].room,
              day: entries[0].day,
              timeSlot: entries[0].timeSlot,
              conflictingEntries: entries,
              severity: 'high',
              conflictCount: entries.length,
              description: `Room ${entries[0].room} has ${entries.length} classes at ${entries[0].day} ${entries[0].timeSlot}`
            });
            detectedConflicts.summary.roomConflicts++;
          }
        });



        detectedConflicts.summary.totalConflicts = 
          detectedConflicts.summary.professorConflicts + 
          detectedConflicts.summary.roomConflicts 

        setConflicts(detectedConflicts);
        setStatus({ 
          type: 'success', 
          message: `Conflict analysis complete! Found ${detectedConflicts.summary.totalConflicts} conflicts` 
        });
      } catch (error) {
        console.error('Conflict detection error:', error);
        setStatus({ type: 'error', message: `Conflict detection failed: ${error.message}` });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  


  // Export conflicts to Excel
  const exportConflicts = () => {
    if (!conflicts) return;

    const wb = XLSX.utils.book_new();

    // Create summary sheet
    const summaryData = [
      ['Conflict Summary'],
      ['Total Conflicts', conflicts.summary.totalConflicts],
      ['Professor Conflicts', conflicts.summary.professorConflicts],
      ['Room Conflicts', conflicts.summary.roomConflicts]
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Create detailed conflict sheets
    if (conflicts.professorConflicts.length > 0) {
      const profData = [
        ['Professor Conflicts'],
        ['Conflict ID', 'Professor', 'Day', 'Time Slot', 'Conflict Count', 'Description', 'Conflicting Entries']
      ];
      
      conflicts.professorConflicts.forEach(conflict => {
        conflict.conflictingEntries.forEach((entry, i) => {
          profData.push([
            i === 0 ? conflict.id : '', // Only show ID on first row
            i === 0 ? conflict.professor : '',
            i === 0 ? conflict.day : '',
            i === 0 ? conflict.timeSlot : '',
            i === 0 ? conflict.conflictCount : '',
            i === 0 ? conflict.description : '',
            `${entry.timetable} - ${entry.sheet} - ${entry.course} (${entry.teacher}) in ${entry.room}`
          ]);
        });
      });

      const profWs = XLSX.utils.aoa_to_sheet(profData);
      XLSX.utils.book_append_sheet(wb, profWs, 'Professor Conflicts');
    }

    if (conflicts.roomConflicts.length > 0) {
      const roomData = [
        ['Room Conflicts'],
        ['Conflict ID', 'Room', 'Day', 'Time Slot', 'Conflict Count', 'Description', 'Conflicting Entries']
      ];
      
      conflicts.roomConflicts.forEach(conflict => {
        conflict.conflictingEntries.forEach((entry, i) => {
          roomData.push([
            i === 0 ? conflict.id : '', // Only show ID on first row
            i === 0 ? conflict.room : '',
            i === 0 ? conflict.day : '',
            i === 0 ? conflict.timeSlot : '',
            i === 0 ? conflict.conflictCount : '',
            i === 0 ? conflict.description : '',
            `${entry.timetable} - ${entry.sheet} - ${entry.course} (${entry.teacher}) in ${entry.room}`
          ]);
        });
      });

      const roomWs = XLSX.utils.aoa_to_sheet(roomData);
      XLSX.utils.book_append_sheet(wb, roomWs, 'Room Conflicts');
    }

    XLSX.writeFile(wb, 'Timetable_Conflicts_Report.xlsx');
  };

  const filteredConflicts = useMemo(() => {
    if (!conflicts) return null;
    
    if (selectedConflictType === 'all') {
      return {
        ...conflicts,
        allConflicts: [
          ...conflicts.professorConflicts,
          ...conflicts.roomConflicts
        ]
      };
    }
    
    return {
      ...conflicts,
      allConflicts: conflicts[`${selectedConflictType}Conflicts`] || []
    };
  }, [conflicts, selectedConflictType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-800">Timetable Conflict Detector</h1>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Upload multiple timetable Excel files</strong> from different years/sections</li>
                <li><strong>Professor Conflicts:</strong> Same professor teaching multiple classes at same time</li>
                <li><strong>Room Conflicts:</strong> Same room allocated to multiple classes simultaneously</li>
                <li><strong>Student Conflicts:</strong> Same course offered in multiple sections at same time</li>
                <li><strong>Visual Highlighting:</strong> Conflicting cells are highlighted with warning icons</li>
              </ul>
            </div>
          </div>

          <ConflictUpload
            timetablesCount={timetables.length}
            status={status}
            loading={loading}
            onFileChange={handleFileUpload}
            onDetect={detectConflicts}
            onExport={exportConflicts}
          />

          {conflicts && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Conflict Summary</h3>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{conflicts.summary.totalConflicts}</div>
                  <div className="text-sm text-red-700">Total Conflicts</div>
                </div>
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{conflicts.summary.professorConflicts}</div>
                  <div className="text-sm text-orange-700">Professor Conflicts</div>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{conflicts.summary.roomConflicts}</div>
                  <div className="text-sm text-yellow-700">Room Conflicts</div>
                </div>
               
              </div>

              {/* Debug Panel */}
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Debug Information</h4>
                <div className="text-xs font-mono text-gray-600 space-y-1">
                  <div><strong>All Conflict IDs:</strong></div>
                  {conflicts.professorConflicts.map(c => (
                    <div key={c.id} className="ml-2">🔴 {c.id} - {c.description}</div>
                  ))}
                  {conflicts.roomConflicts.map(c => (
                    <div key={c.id} className="ml-2">🟠 {c.id} - {c.description}</div>
                  ))}
                 
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedConflictType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedConflictType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All Conflicts
                </button>
                <button
                  onClick={() => setSelectedConflictType('professor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedConflictType === 'professor' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Professor Only
                </button>
                <button
                  onClick={() => setSelectedConflictType('room')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedConflictType === 'room' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Room Only
                </button>
                <button
                  onClick={() => setSelectedConflictType('student')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedConflictType === 'student' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Student Only
                </button>
              </div>
            </div>
          )}
        </div>

        {timetables.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Timetables with Conflict Highlighting</h2>
            <div className="space-y-8">
              <TimetablesWithConflicts timetables={timetables} conflicts={conflicts} />
            </div>
          </div>
        )}

        {filteredConflicts && filteredConflicts.allConflicts.length > 0 && (
          <ConflictList filteredConflicts={filteredConflicts} />
        )}
      </div>
    </div>
  );
};

export default ConflictDetector;
