import * as XLSX from 'xlsx';

export const useExportHandlers = (timetable, DAYS, generateTimeSlots) => {
  const generateFacultyTimetables = () => {
    if (!timetable) return {};
    const facultySchedule = {};
    Object.keys(timetable).forEach(section => {
      DAYS.forEach(day => {
        timetable[section][day].forEach(entry => {
          if (entry.teacher && entry.teacher !== '-') {
            if (!facultySchedule[entry.teacher]) {
              facultySchedule[entry.teacher] = {};
              DAYS.forEach(d => { facultySchedule[entry.teacher][d] = []; });
            }
            facultySchedule[entry.teacher][day].push({
              time: entry.time,
              course: entry.course,
              section: section,
              room: entry.room,
              type: entry.type,
              code: entry.code
            });
          }
        });
      });
    });
    return facultySchedule;
  };

  const generateRoomTimetables = () => {
    if (!timetable) return {};
    const roomSchedule = {};
    Object.keys(timetable).forEach(section => {
      DAYS.forEach(day => {
        timetable[section][day].forEach(entry => {
          if (entry.room && entry.room !== '-') {
            if (!roomSchedule[entry.room]) {
              roomSchedule[entry.room] = {};
              DAYS.forEach(d => { roomSchedule[entry.room][d] = []; });
            }
            roomSchedule[entry.room][day].push({
              time: entry.time,
              course: entry.course,
              section: section,
              teacher: entry.teacher,
              type: entry.type,
              code: entry.code
            });
          }
        });
      });
    });
    return roomSchedule;
  };

  const getDistributionStatistics = () => {
    if (!timetable) return {};
    const stats = {};
    Object.keys(timetable).forEach(section => {
      stats[section] = { lectures: 0, labs: 0, total: 0 };
      DAYS.forEach(day => {
        timetable[section][day].forEach(entry => {
          if (entry.type === 'lecture') {
            stats[section].lectures += 1;
            stats[section].total += 1;
          } else if (entry.type === 'lab') {
            stats[section].labs += 1;
            stats[section].total += 2;
          }
        });
      });
    });
    return stats;
  };

  const exportToExcel = () => {
    if (!timetable) return;
    const wb = XLSX.utils.book_new();

    Object.keys(timetable).forEach(section => {
      const sectionData = [];
      sectionData.push(['Day', ...generateTimeSlots]);

      DAYS.forEach(day => {
        const row = [day];
        const daySchedule = timetable[section][day];

        generateTimeSlots.forEach(slot => {
          const entry = daySchedule.find(e => e.time === slot);
          if (entry) {
            if (entry.course === 'LUNCH') {
              row.push('LUNCH BREAK');
            } else if (entry.course === 'FREE') {
              row.push('FREE PERIOD');
            } else {
              row.push(`${entry.course}\n${entry.teacher}\n${entry.room}`);
            }
          } else {
            row.push('-');
          }
        });

        sectionData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(sectionData);
      XLSX.utils.book_append_sheet(wb, ws, section.substring(0, 31));
    });

    XLSX.writeFile(wb, 'Section_Timetables.xlsx');
  };

  const exportFacultyTimetables = () => {
    const facultySchedules = generateFacultyTimetables();
    if (Object.keys(facultySchedules).length === 0) return;
    const wb = XLSX.utils.book_new();

    Object.keys(facultySchedules).sort().forEach(faculty => {
      const facultyData = [];
      facultyData.push(['Day', ...generateTimeSlots]);

      DAYS.forEach(day => {
        const row = [day];
        const daySchedule = facultySchedules[faculty][day];

        generateTimeSlots.forEach(slot => {
          const entries = daySchedule.filter(e => e.time === slot);
          if (entries.length > 0) {
            const entryTexts = entries.map(e => `${e.course}\n${e.section.replace(/_/g, ' ')}\n${e.room}`);
            row.push(entryTexts.join('\n---\n'));
          } else {
            row.push('-');
          }
        });

        facultyData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(facultyData);
      XLSX.utils.book_append_sheet(wb, ws, faculty.substring(0, 31));
    });

    XLSX.writeFile(wb, 'Faculty_Timetables.xlsx');
  };

  const exportRoomTimetables = () => {
    const roomSchedules = generateRoomTimetables();
    if (Object.keys(roomSchedules).length === 0) return;
    const wb = XLSX.utils.book_new();

    Object.keys(roomSchedules).sort().forEach(room => {
      const roomData = [];
      roomData.push(['Day', ...generateTimeSlots]);

      DAYS.forEach(day => {
        const row = [day];
        const daySchedule = roomSchedules[room][day];

        generateTimeSlots.forEach(slot => {
          const entries = daySchedule.filter(e => e.time === slot);
          if (entries.length > 0) {
            const entryTexts = entries.map(e => `${e.course}\n${e.teacher}\n${e.section.replace(/_/g, ' ')}`);
            row.push(entryTexts.join('\n---\n'));
          } else {
            row.push('-');
          }
        });

        roomData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(roomData);
      XLSX.utils.book_append_sheet(wb, ws, room.substring(0, 31));
    });

    XLSX.writeFile(wb, 'Room_Timetables.xlsx');
  };

  return {
    exportToExcel,
    exportFacultyTimetables,
    exportRoomTimetables,
    generateFacultyTimetables,
    generateRoomTimetables,
    getDistributionStatistics
  };
};