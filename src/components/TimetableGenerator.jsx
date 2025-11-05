import React, { useState } from 'react';
import { Upload, Calendar, Download, AlertCircle, CheckCircle, Info, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';

// Import modular components
import AvailabilityParser from './utils/AvailabilityParser';
import TimetableSettings from './components/TimetableSettings';
import FileUploadSection from './components/FileUploadSection';
import StatusDisplay from './components/StatusDisplay';
import OEBasketInfo from './components/OEBasketInfo';
import DistributionStats from './components/DistributionStats';
import SectionTimetables from './components/SectionTimetables';
import FacultyTimetables from './components/FacultyTimetables';
import RoomTimetables from './components/RoomTimetables';
import CommonSlotFinder from './CommonSlotFinder';
import TimetableQuickSelector from './components/TimetableQuickSelector';
import TimetableTypeSelector from './components/TimetableTypeSelector';
import StudentSelector from './components/StudentSelector';
import ProfessorSelector from './components/ProfessorSelector';
import RoomSelector from './components/RoomSelector';
import { useTimetableGenerator } from './hooks/useTimetableGenerator';
import { useExportHandlers } from './hooks/useExportHandlers';

const TimetableGenerator = ({ onGenerated }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedFaculty, setExpandedFaculty] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [showOeInfo, setShowOeInfo] = useState(false);

  // Selector UI state
  const [selectedType, setSelectedType] = useState('student');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const {
    courses,
    
    professors,
    
    rooms,
    
    timetable,
    
    oeBasketInfo,
    
    status,
    
    loading,
    
    settings,
    setSettings,
    DAYS,
    generateTimeSlots,
    handleFileUpload,
    generateTimetable
  } = useTimetableGenerator(onGenerated);

  const {
    exportToExcel,
    exportFacultyTimetables,
    exportRoomTimetables,
    generateFacultyTimetables,
    generateRoomTimetables,
    getDistributionStatistics
  } = useExportHandlers(timetable, DAYS, generateTimeSlots);

  const distributionStats = getDistributionStatistics();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFaculty = (faculty) => {
    setExpandedFaculty(prev => ({ ...prev, [faculty]: !prev[faculty] }));
  };

  const toggleRoom = (room) => {
    setExpandedRooms(prev => ({ ...prev, [room]: !prev[room] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Academic Timetable Generator</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <Settings className="w-5 h-5" />
              {showSettings ? 'Hide' : 'Show'} Settings
            </button>
          </div>

          {showSettings && (
            <TimetableSettings 
              settings={settings} 
              setSettings={setSettings}
              generateTimeSlots={generateTimeSlots}
            />
          )}

          <FileUploadSection
            courses={courses}
            professors={professors}
            rooms={rooms}
            onFileUpload={handleFileUpload}
          />

          <StatusDisplay status={status} />

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={generateTimetable}
              disabled={loading || !courses.length || !professors.length || !rooms.length}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Timetable'}
            </button>

            {timetable && (
              <>
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export Sections
                </button>

                <button
                  onClick={exportFacultyTimetables}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export Faculty
                </button>

                <button
                  onClick={exportRoomTimetables}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export Rooms
                </button>
              </>
            )}
          </div>
        </div>

        {timetable && (
          <div className="space-y-6">
            {/* Selector UI for timetable type (moved to small components) */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <TimetableTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />

              {selectedType === 'student' && (
                <StudentSelector
                  timetable={timetable}
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                />
              )}

              {selectedType === 'professor' && (
                <ProfessorSelector
                  professors={professors}
                  selectedProfessor={selectedProfessor}
                  setSelectedProfessor={setSelectedProfessor}
                />
              )}

              {selectedType === 'room' && (
                <RoomSelector
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                />
              )}
            </div>

            {/* Conditional Timetable Rendering */}
            {selectedType === 'student' && (
              (() => {
                // If a specific section is selected, show it first, then the rest
                if (selectedSection) {
                  const ordered = {};
                  if (timetable[selectedSection]) ordered[selectedSection] = timetable[selectedSection];
                  Object.keys(timetable).forEach(k => {
                    if (k !== selectedSection) ordered[k] = timetable[k];
                  });
                  return (
                    <SectionTimetables
                      timetable={ordered}
                      generateTimeSlots={generateTimeSlots}
                      DAYS={DAYS}
                      distributionStats={distributionStats}
                      expandedSections={expandedSections}
                      toggleSection={toggleSection}
                    />
                  );
                }

                // No specific section: show all section timetables
                return (
                  <SectionTimetables
                    timetable={timetable}
                    generateTimeSlots={generateTimeSlots}
                    DAYS={DAYS}
                    distributionStats={distributionStats}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                  />
                );
              })()
            )}

            {selectedType === 'professor' && (
              (() => {
                const all = generateFacultyTimetables();
                // helper: normalize keys for robust matching (trim, collapse spaces, lowercase)
                const normalize = (s) => (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
                const findMatchingKey = (map, sel) => {
                  if (!sel) return null;
                  const n = normalize(sel);
                  return Object.keys(map).find(k => normalize(k) === n) || null;
                };

                // If a specific professor is selected, show their timetable first, then the rest
                if (selectedProfessor) {
                  console.log('Selected Professor:', selectedProfessor);
                  const matched = findMatchingKey(all, selectedProfessor);
                  console.log('Matched Key:', matched);
                  const ordered = {};
                  
                  if (matched) ordered[matched] = all[matched];
                  Object.keys(all).forEach(k => {
                    if (k !== matched) ordered[k] = all[k];
                  });
                  console.log('Ordered Schedules:', ordered);
                  return (
                    <FacultyTimetables
                      facultySchedules={ordered}
                      generateTimeSlots={generateTimeSlots}
                      DAYS={DAYS}
                      expandedFaculty={expandedFaculty}
                      toggleFaculty={toggleFaculty}
                    />
                  );
                }

                return (
                  <FacultyTimetables
                    facultySchedules={all}
                    generateTimeSlots={generateTimeSlots}
                    DAYS={DAYS}
                    expandedFaculty={expandedFaculty}
                    toggleFaculty={toggleFaculty}
                  />
                );
              })()
            )}

            {selectedType === 'room' && (
              (() => {
                const allRooms = generateRoomTimetables();
                // reuse normalization helper for rooms
                const normalize = (s) => (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
                const findMatchingKey = (map, sel) => {
                  if (!sel) return null;
                  const n = normalize(sel);
                  return Object.keys(map).find(k => normalize(k) === n) || null;
                };

                // If a specific room is selected, show its timetable first, then the rest
                if (selectedRoom) {
                  const matched = findMatchingKey(allRooms, selectedRoom);
                  const ordered = {};
                  if (matched) ordered[matched] = allRooms[matched];
                  Object.keys(allRooms).forEach(k => {
                    if (k !== matched) ordered[k] = allRooms[k];
                  });
                  return (
                    <RoomTimetables
                      roomSchedules={ordered}
                      generateTimeSlots={generateTimeSlots}
                      DAYS={DAYS}
                      expandedRooms={expandedRooms}
                      toggleRoom={toggleRoom}
                    />
                  );
                }

                return (
                  <RoomTimetables
                    roomSchedules={allRooms}
                    generateTimeSlots={generateTimeSlots}
                    DAYS={DAYS}
                    expandedRooms={expandedRooms}
                    toggleRoom={toggleRoom}
                  />
                );
              })()
            )}

            {/* Other info panels */}
            <OEBasketInfo 
              oeBasketInfo={oeBasketInfo}
              showOeInfo={showOeInfo}
              setShowOeInfo={setShowOeInfo}
            />

            <DistributionStats distributionStats={distributionStats} />

            <div className="bg-white rounded-xl shadow-lg p-8">
              <CommonSlotFinder
                timetable={timetable}
                generateTimeSlots={generateTimeSlots}
                DAYS={DAYS}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableGenerator;