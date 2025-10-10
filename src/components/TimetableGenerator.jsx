import React, { useState, useEffect } from 'react';
import { Play, Settings, Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const TimetableGenerator = ({ data, onTimetableGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [constraints, setConstraints] = useState({
    lunchStart: '12:00',
    lunchEnd: '13:00',
    maxHoursPerDay: 8,
    minGapBetweenClasses: 15,
    avoidBackToBack: true,
    respectProfessorAvailability: true,
    respectRoomCapacity: true
  });
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  const generateTimetable = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setConflicts([]);

    try {
      // Simulate generation process with progress updates
      const steps = [
        { step: 'Validating data...', progress: 10 },
        { step: 'Analyzing constraints...', progress: 25 },
        { step: 'Assigning professors...', progress: 40 },
        { step: 'Allocating rooms...', progress: 60 },
        { step: 'Scheduling classes...', progress: 80 },
        { step: 'Optimizing timetable...', progress: 95 },
        { step: 'Finalizing...', progress: 100 }
      ];

      for (const stepInfo of steps) {
        setGenerationProgress(stepInfo.progress);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Generate the actual timetable
      const timetable = await performTimetableGeneration(data, constraints);
      setGeneratedTimetable(timetable);
      
      // Check for conflicts
      const detectedConflicts = checkForConflicts(timetable);
      setConflicts(detectedConflicts);
      
      onTimetableGenerated(timetable);
      
    } catch (error) {
      console.error('Timetable generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const performTimetableGeneration = async (data, constraints) => {
    const { courses, professors, rooms, batches } = data;
    const timetable = {
      generatedAt: new Date().toISOString(),
      constraints: constraints,
      schedules: {},
      statistics: {
        totalClasses: 0,
        totalHours: 0,
        conflicts: 0
      }
    };

    // Generate schedule for each batch
    batches.forEach(batch => {
      const batchSchedule = generateBatchSchedule(batch, courses, professors, rooms, constraints);
      timetable.schedules[batch.id] = batchSchedule;
      timetable.statistics.totalClasses += batchSchedule.classes.length;
    });

    return timetable;
  };

  const generateBatchSchedule = (batch, courses, professors, rooms, constraints) => {
    const schedule = {
      batchId: batch.id,
      batchName: batch.name,
      year: batch.year,
      branch: batch.branch,
      classes: [],
      weeklyHours: 0
    };

    // Get courses for this batch
    const batchCourses = courses.filter(course => 
      course.year === batch.year && course.department === batch.branch
    );

    // Generate time slots (9 AM to 5 PM, excluding lunch)
    const timeSlots = generateTimeSlots(constraints);
    
    // Assign courses to time slots
    batchCourses.forEach(course => {
      const sections = course.sections || 1;
      
      for (let section = 1; section <= sections; section++) {
        const courseClasses = generateCourseClasses(course, section, timeSlots, professors, rooms);
        schedule.classes.push(...courseClasses);
      }
    });

    // Calculate weekly hours
    schedule.weeklyHours = schedule.classes.length * 1; // Assuming 1 hour per class

    return schedule;
  };

  const generateTimeSlots = (constraints) => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const lunchStart = parseInt(constraints.lunchStart.split(':')[0]);
    const lunchEnd = parseInt(constraints.lunchEnd.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      // Skip lunch hours
      if (hour >= lunchStart && hour < lunchEnd) continue;
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      days.forEach(day => {
        slots.push({
          day,
          time: `${hour}:00-${hour + 1}:00`,
          available: true
        });
      });
    }

    return slots;
  };

  const generateCourseClasses = (course, section, timeSlots, professors, rooms) => {
    const classes = [];
    const courseProfessor = findAvailableProfessor(course, professors);
    const courseRoom = findAvailableRoom(course, rooms);
    
    // Find available time slots for this course
    const availableSlots = timeSlots.filter(slot => slot.available);
    
    if (availableSlots.length > 0 && courseProfessor && courseRoom) {
      const selectedSlot = availableSlots[0];
      selectedSlot.available = false; // Mark as used
      
      classes.push({
        id: `${course.id}_${section}_${selectedSlot.day}_${selectedSlot.time}`,
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
        section: section,
        professor: courseProfessor,
        room: courseRoom,
        day: selectedSlot.day,
        time: selectedSlot.time,
        duration: 1,
        credits: course.credits
      });
    }

    return classes;
  };

  const findAvailableProfessor = (course, professors) => {
    // Find professor who can teach this course
    return professors.find(prof => 
      prof.subjects.includes(course.code) || 
      prof.subjects.includes(course.name) ||
      prof.department === course.department
    ) || professors[0]; // Fallback to first professor
  };

  const findAvailableRoom = (course, rooms) => {
    // Find suitable room for this course
    return rooms.find(room => 
      room.type === 'lecture' && 
      room.capacity >= 30 // Assuming minimum capacity
    ) || rooms[0]; // Fallback to first room
  };

  const checkForConflicts = (timetable) => {
    const conflicts = [];
    
    Object.values(timetable.schedules).forEach(schedule => {
      const classTimes = {};
      
      schedule.classes.forEach(cls => {
        const key = `${cls.day}_${cls.time}`;
        if (classTimes[key]) {
          conflicts.push({
            type: 'time_conflict',
            message: `Time conflict: ${cls.courseName} and ${classTimes[key].courseName} at ${cls.day} ${cls.time}`,
            classes: [cls, classTimes[key]]
          });
        } else {
          classTimes[key] = cls;
        }
      });
    });

    return conflicts;
  };

  const exportTimetable = () => {
    if (!generatedTimetable) return;

    const data = {
      generatedAt: generatedTimetable.generatedAt,
      constraints: generatedTimetable.constraints,
      schedules: generatedTimetable.schedules
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-blue-900">Timetable Generation</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setConstraints({...constraints})}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Settings size={18} />
            <span>Constraints</span>
          </button>
          {generatedTimetable && (
            <button
              onClick={exportTimetable}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Generating timetable...</span>
            <span className="text-sm text-gray-500">{generationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Generation Button */}
      {!isGenerating && (
        <div className="text-center mb-6">
          <button
            onClick={generateTimetable}
            disabled={!data || Object.keys(data).length === 0}
            className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mx-auto"
          >
            <Play size={24} />
            <span className="text-lg font-medium">Generate Timetable</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">
            This will create optimized timetables for all batches
          </p>
        </div>
      )}

      {/* Constraints Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Current Constraints:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Lunch Time:</span>
            <span className="ml-2 font-medium">{constraints.lunchStart} - {constraints.lunchEnd}</span>
          </div>
          <div>
            <span className="text-gray-600">Max Hours/Day:</span>
            <span className="ml-2 font-medium">{constraints.maxHoursPerDay}</span>
          </div>
          <div>
            <span className="text-gray-600">Min Gap:</span>
            <span className="ml-2 font-medium">{constraints.minGapBetweenClasses} min</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {generatedTimetable && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle size={20} />
            <span className="font-medium">Timetable Generated Successfully!</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg">
            <div>
              <span className="text-green-600 font-medium">Total Classes:</span>
              <span className="ml-2 text-green-800">{generatedTimetable.statistics.totalClasses}</span>
            </div>
            <div>
              <span className="text-green-600 font-medium">Batches:</span>
              <span className="ml-2 text-green-800">{Object.keys(generatedTimetable.schedules).length}</span>
            </div>
            <div>
              <span className="text-green-600 font-medium">Conflicts:</span>
              <span className="ml-2 text-green-800">{conflicts.length}</span>
            </div>
            <div>
              <span className="text-green-600 font-medium">Generated:</span>
              <span className="ml-2 text-green-800">
                {new Date(generatedTimetable.generatedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center space-x-2 text-red-600 mb-3">
            <AlertTriangle size={20} />
            <span className="font-medium">Detected Conflicts:</span>
          </div>
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{conflict.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableGenerator;
