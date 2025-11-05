import { useState, useMemo } from 'react';
import { timetableScheduler } from '../utils/timetableScheduler';
import { excelParser } from '../utils/excelParser';

export const useTimetableGenerator = (onGenerated) => {
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [oeBasketInfo, setOeBasketInfo] = useState({ oe1: [], oe2: [] });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    classStartHour: 9, classStartMinute: 0, classEndHour: 17, classEndMinute: 0,
    slotDurationMinutes: 60, lunchStartHour: 12, lunchEndHour: 15,
    lunchDuration: 1, wednesdayHalfDay: true
  });

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const generateTimeSlots = useMemo(() => {
    const slots = [];
    const startMinutes = settings.classStartHour * 60 + settings.classStartMinute;
    const endMinutes = settings.classEndHour * 60 + settings.classEndMinute;
    const duration = settings.slotDurationMinutes;
    let current = startMinutes;
    while (current + duration <= endMinutes) {
      const startH = Math.floor(current / 60);
      const startM = current % 60;
      const endTime = current + duration;
      const endH = Math.floor(endTime / 60);
      const endM = endTime % 60;
      slots.push(`${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}-${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
      current += duration;
    }
    return slots;
  }, [settings]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await excelParser.parseExcel(file);
      if (type === 'courses') {
        setCourses(data);
        setStatus({ type: 'success', message: `Loaded ${data.length} courses` });
      } else if (type === 'professors') {
        const processedProfs = excelParser.processProfessors(data);
        setProfessors(processedProfs);
        setStatus({ type: 'success', message: `Loaded ${data.length} professors with availability` });
      } else if (type === 'rooms') {
        setRooms(data);
        setStatus({ type: 'success', message: `Loaded ${data.length} rooms` });
      }
    } catch (error) {
      setStatus({ type: 'error', message: `Error loading ${type}: ${error.message}` });
    }
  };

  const generateTimetable = () => {
    if (!courses.length || !professors.length || !rooms.length) {
      setStatus({ type: 'error', message: 'Please upload all required files' });
      return;
    }
    setLoading(true);
    setStatus({ type: 'info', message: 'Generating timetable...' });
    
    setTimeout(() => {
      try {
        const result = timetableScheduler.scheduleTimetable(
          courses,
          professors,
          rooms,
          generateTimeSlots,
          settings
        );
        setTimetable(result.schedule);
        setOeBasketInfo(result.oeBasketInfo);
        if (typeof onGenerated === 'function') {
          onGenerated({ timetable: result.schedule, DAYS, generateTimeSlots });
        }
        setStatus({ type: 'success', message: 'Timetable generated successfully!' });
      } catch (error) {
        setStatus({ type: 'error', message: `Generation failed: ${error.message}` });
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return {
    courses,
    setCourses,
    professors,
    setProfessors,
    rooms,
    setRooms,
    timetable,
    setTimetable,
    oeBasketInfo,
    setOeBasketInfo,
    status,
    setStatus,
    loading,
    setLoading,
    settings,
    setSettings,
    DAYS,
    generateTimeSlots,
    handleFileUpload,
    generateTimetable
  };
};