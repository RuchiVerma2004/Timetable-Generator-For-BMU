import { AvailabilityParser } from './AvailabilityParser';

export const timetableScheduler = {
  parseLDP: (ldpString) => {
    if (!ldpString) return { lecture: 0, discussion: 0, practical: 0 };
    const parts = ldpString.toString().trim().replace(/\\/g, '-').split('-');
    return {
      lecture: parseInt(parts[0]) || 0,
      discussion: parseInt(parts[1]) || 0,
      practical: Math.ceil((parseInt(parts[2]) || 0) / 2)
    };
  },

  getSlotStartHour: (slot) => parseInt(slot.split(':')[0]),

  isLunchSlot: (slot, sectionOffset, settings) => {
    const slotHour = timetableScheduler.getSlotStartHour(slot);
    const lunchStart = settings.lunchStartHour + sectionOffset;
    const lunchEnd = lunchStart + settings.lunchDuration;
    return slotHour >= lunchStart && slotHour < lunchEnd;
  },

  isOpenElective: (category) => {
    return category && category.toString().toLowerCase().includes('oe');
  },

  getOEBasket: (category) => {
    const cat = category ? category.toString().toLowerCase() : '';
    if (cat.includes('basket 1') || cat.includes('bskt 1') || cat.includes('oe1')) return 'OE1';
    if (cat.includes('basket 2') || cat.includes('bskt 2') || cat.includes('oe2')) return 'OE2';
    return null;
  },

  scheduleTimetable: (courses, professors, rooms, TIME_SLOTS, settings, preferences = null) => {
    const schedule = {};
    const globalTeacherSchedule = {};
    const globalRoomSchedule = {};
    const oeBasketInfo = { oe1: [], oe2: [] };
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const coursesBySemester = {};
    courses.forEach(course => {
      const semester = course.Semester || course.semester || course.sem || 'NA';
      if (!coursesBySemester[semester]) coursesBySemester[semester] = [];
      coursesBySemester[semester].push(course);
    });

    const professorMap = {};
    professors.forEach(prof => {
      const courseAbb = (prof['Course Abb'] || prof.courseAbb || prof['CourseAbbr'] || '').toString().trim();
      const semester = prof.Semester || prof.semester || prof.sem || '';
      const key = `${courseAbb}_${semester}`;
      if (!professorMap[key]) professorMap[key] = [];
      professorMap[key].push(prof);
    });

    const lectureRooms = rooms.filter(r => (r.Type || r.type || '').toString().toLowerCase() === 'lecture');
    const labRooms = rooms.filter(r => (r.Type || r.type || '').toString().toLowerCase() === 'lab');
    const hallRooms = rooms.filter(r => (r.Type || r.type || '').toString().toLowerCase() === 'hall');

    Object.keys(coursesBySemester).sort().forEach(semester => {
      const semesterCourses = coursesBySemester[semester];
      if (!semesterCourses.length) return;

      const sections = Math.max(...semesterCourses.map(c => parseInt(c.Sections) || 1));
      const batch = semesterCourses[0].Batch || semesterCourses[0].batch || 'Batch';

      const oeBasket1Courses = [];
      const oeBasket2Courses = [];
      const regularCourses = [];
      const specializationCourses = {};

      semesterCourses.forEach(course => {
        const category = course.Category || course.category || '';
        const spec = (course.Specializations || course.Specialization || 'NA').toString().trim();
        if (timetableScheduler.isOpenElective(category)) {
          const basket = timetableScheduler.getOEBasket(category);
          if (basket === 'OE1') oeBasket1Courses.push(course);
          else if (basket === 'OE2') oeBasket2Courses.push(course);
        } else if (spec && spec !== 'NA') {
          const specs = spec.split(',').map(s => s.trim());
          specs.forEach(s => {
            if (!specializationCourses[s]) specializationCourses[s] = [];
            if (!specializationCourses[s].find(cc => (cc['Course Code'] || cc.courseCode) === (course['Course Code'] || course.courseCode))) {
              specializationCourses[s].push(course);
            }
          });
        } else {
          regularCourses.push(course);
        }
      });

      // Initialize schedule for all sections
      for (let section = 1; section <= sections; section++) {
        const sectionKey = `Batch_${batch}_Sem_${semester}_Sec_${section}`;
        schedule[sectionKey] = {};
        DAYS.forEach(day => { schedule[sectionKey][day] = []; });
      }

      // Track course progress and workload per section
      const sectionCourseTracking = {};
      const sectionWorkload = {};

      for (let section = 1; section <= sections; section++) {
        const sectionKey = `Batch_${batch}_Sem_${semester}_Sec_${section}`;
        sectionCourseTracking[sectionKey] = { regular: [], specialization: [] };
        sectionWorkload[sectionKey] = { total: 0, lectures: 0, labs: 0 };

        regularCourses.forEach(course => {
          const ldp = timetableScheduler.parseLDP(course['L-D-P'] || course.ldp || course.LDP || '0-0-0');
          sectionCourseTracking[sectionKey].regular.push({
            ...course,
            lecturesScheduled: 0, practicalsScheduled: 0,
            totalLectures: ldp.lecture + ldp.discussion, totalPracticals: ldp.practical,
            courseAbb: (course['Course Abb'] || course.courseAbb || '').toString().trim(),
            lecturesByDay: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
            labsByDay: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }
          });
        });

        Object.keys(specializationCourses).forEach(spec => {
          specializationCourses[spec].forEach(course => {
            const ldp = timetableScheduler.parseLDP(course['L-D-P'] || course.ldp || course.LDP || '0-0-0');
            sectionCourseTracking[sectionKey].specialization.push({
              ...course, lecturesScheduled: 0, practicalsScheduled: 0,
              totalLectures: ldp.lecture + ldp.discussion, totalPracticals: ldp.practical,
              courseAbb: (course['Course Abb'] || course.courseAbb || '').toString().trim(), spec,
              lecturesByDay: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 },
              labsByDay: { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }
            });
          });
        });
      }

      // Find common slots for OE baskets
      const findCommonSlotForBasket = (basket, basketName, day) => {
        if (!basket || !basket.length) return { slotIndex: -1, assignments: [] };

        for (let slotIndex = 0; slotIndex < TIME_SLOTS.length; slotIndex++) {
          const slot = TIME_SLOTS[slotIndex];
          const globalKey = `${day}_${slot}`;
          if (!globalTeacherSchedule[globalKey]) globalTeacherSchedule[globalKey] = new Set();
          if (!globalRoomSchedule[globalKey]) globalRoomSchedule[globalKey] = new Set();

          const assignments = [];
          const tempRoomsUsed = new Set();
          const tempProfsUsed = new Set();
          let ok = true;

          for (let section = 1; section <= sections; section++) {
            const courseIndex = (section - 1) % basket.length;
            const course = basket[courseIndex];
            const profKey = `${(course['Course Abb'] || course.courseAbb || '').toString().trim()}_${semester}`;
            const availableProfs = professorMap[profKey] || [];

            const profForCourse = availableProfs.find(p =>
              !globalTeacherSchedule[globalKey].has(p.Name) && !tempProfsUsed.has(p.Name) &&
              AvailabilityParser.isAvailableAtTime(p.availability, day, slot)
            );
            if (!profForCourse) { ok = false; break; }

            const roomForCourse = lectureRooms.find(r =>
              !globalRoomSchedule[globalKey].has(r['Room ID']) && !tempRoomsUsed.has(r['Room ID'])
            );
            if (!roomForCourse) { ok = false; break; }

            assignments.push({
              section, course, professor: profForCourse, room: roomForCourse
            });
            tempProfsUsed.add(profForCourse.Name);
            tempRoomsUsed.add(roomForCourse['Room ID']);
          }

          if (ok && assignments.length === sections) {
            return { slotIndex, assignments };
          }
        }
        return { slotIndex: -1, assignments: [] };
      };

      // Schedule OE baskets in common slots
      const scheduleBasketAtSlot = (basket, basketName, preferredDay) => {
        if (!basket || !basket.length) return false;

        // Try preferred day first, then other days
        const daysToTry = [preferredDay, ...DAYS.filter(day => day !== preferredDay)];

        for (const day of daysToTry) {
          const { slotIndex, assignments } = findCommonSlotForBasket(basket, basketName, day);
          if (slotIndex !== -1 && assignments.length === sections) {
            const slotToUse = TIME_SLOTS[slotIndex];
            const globalKey = `${day}_${slotToUse}`;

            if (!globalTeacherSchedule[globalKey]) globalTeacherSchedule[globalKey] = new Set();
            if (!globalRoomSchedule[globalKey]) globalRoomSchedule[globalKey] = new Set();

            // Store OE basket information
            const basketCourses = [];

            assignments.forEach(({ section, course, professor, room }) => {
              const sectionKey = `Batch_${batch}_Sem_${semester}_Sec_${section}`;

              schedule[sectionKey][day].push({
                time: slotToUse,
                course: `${basketName} - ${course['Course Title'] || course.courseTitle}`,
                teacher: professor.Name,
                room: room['Room Name'] || room.roomName || room['RoomID'],
                type: 'lecture',
                code: course['Course Code'] || course.courseCode,
                category: basketName,
                isOEBasket: true
              });

              globalTeacherSchedule[globalKey].add(professor.Name);
              globalRoomSchedule[globalKey].add(room['Room ID']);

              // Update tracking
              const trackingCourse = sectionCourseTracking[sectionKey].regular.find(c =>
                (c['Course Code'] || c.courseCode) === (course['Course Code'] || course.courseCode)
              ) || sectionCourseTracking[sectionKey].specialization.find(c =>
                (c['Course Code'] || c.courseCode) === (course['Course Code'] || course.courseCode)
              );
              if (trackingCourse) {
                trackingCourse.lecturesScheduled += 1;
                trackingCourse.lecturesByDay[day] = (trackingCourse.lecturesByDay[day] || 0) + 1;
                sectionWorkload[sectionKey].lectures += 1;
                sectionWorkload[sectionKey].total += 1;
              }

              // Add to basket courses if not already added
              if (!basketCourses.find(bc => bc.courseCode === (course['Course Code'] || course.courseCode))) {
                basketCourses.push({
                  courseCode: course['Course Code'] || course.courseCode,
                  courseTitle: course['Course Title'] || course.courseTitle,
                  professor: professor.Name,
                  room: room['Room Name'] || room.roomName || room['RoomID'],
                  sections: [section]
                });
              } else {
                // Add section to existing course
                const existingCourse = basketCourses.find(bc =>
                  bc.courseCode === (course['Course Code'] || course.courseCode)
                );
                if (existingCourse && !existingCourse.sections.includes(section)) {
                  existingCourse.sections.push(section);
                }
              }
            });

            // Store OE basket info
            if (basketName === 'OE-Basket 1') {
              oeBasketInfo.oe1.push({
                day, time: slotToUse, courses: basketCourses, semester, batch
              });
            } else if (basketName === 'OE-Basket 2') {
              oeBasketInfo.oe2.push({
                day, time: slotToUse, courses: basketCourses, semester, batch
              });
            }

            return true;
          }
        }
        return false;
      };

      // Schedule OE baskets
      scheduleBasketAtSlot(oeBasket1Courses, 'OE-Basket 1', 'Monday');
      scheduleBasketAtSlot(oeBasket2Courses, 'OE-Basket 2', 'Tuesday');

      // Track daily load per section
      const dailyLoadPerSection = {};
      for (let section = 1; section <= sections; section++) {
        const sectionKey = `Batch_${batch}_Sem_${semester}_Sec_${section}`;
        dailyLoadPerSection[sectionKey] = {
          Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0
        };
      }

      // Equal distribution: prioritize sections with less workload
      const getSectionPriority = (sectionKey) => -sectionWorkload[sectionKey].total;
      const getDayPriority = (day, currentLoad, courseLoadOnDay) => 5 - currentLoad * 0.5 - courseLoadOnDay * 2;

      const getAllCoursesToSchedule = () => {
        const coursesToSchedule = [];
        for (let section = 1; section <= sections; section++) {
          const sectionKey = `Batch_${batch}_Sem_${semester}_Sec_${section}`;
          const courses = [
            ...sectionCourseTracking[sectionKey].regular,
            ...sectionCourseTracking[sectionKey].specialization
          ].filter(c => c.lecturesScheduled < c.totalLectures || c.practicalsScheduled < c.totalPracticals);
          coursesToSchedule.push(...courses.map(c => ({ ...c, section, sectionKey })));
        }
        return coursesToSchedule;
      };

      let maxIterations = settings.maxIterations || 2000;
      let iteration = 0;

      while (iteration < maxIterations) {
        iteration++;
        let coursesToSchedule = getAllCoursesToSchedule();
        if (coursesToSchedule.length === 0) break;

        coursesToSchedule.sort((a, b) => {
          const aPriority = getSectionPriority(a.sectionKey);
          const bPriority = getSectionPriority(b.sectionKey);
          if (aPriority !== bPriority) return bPriority - aPriority;
          const aCompletion = (a.lecturesScheduled + a.practicalsScheduled) / (a.totalLectures + a.totalPracticals);
          const bCompletion = (b.lecturesScheduled + b.practicalsScheduled) / (b.totalLectures + b.totalPracticals);
          return aCompletion - bCompletion;
        });

        let anyScheduled = false;

        for (const courseToSchedule of coursesToSchedule) {
          if (anyScheduled) break;
          const { section, sectionKey } = courseToSchedule;
          const course = sectionCourseTracking[sectionKey].regular.find(c =>
            (c['Course Code'] || c.courseCode) === (courseToSchedule['Course Code'] || courseToSchedule.courseCode)
          ) || sectionCourseTracking[sectionKey].specialization.find(c =>
            (c['Course Code'] || c.courseCode) === (courseToSchedule['Course Code'] || courseToSchedule.courseCode)
          );
          if (!course) continue;

          const needsPractical = course.practicalsScheduled < course.totalPracticals;
          const needsLecture = course.lecturesScheduled < course.totalLectures;
          if (!needsPractical && !needsLecture) continue;

          const daysWithPriority = DAYS.map(day => {
            const currentDayLoad = dailyLoadPerSection[sectionKey][day];
            const courseLoadOnDay = (course.lecturesByDay[day] || 0) + (course.labsByDay[day] || 0);
            return { day, priority: getDayPriority(day, currentDayLoad, courseLoadOnDay) };
          }).sort((a, b) => b.priority - a.priority);

          for (const { day } of daysWithPriority) {
            if (anyScheduled) break;
            const lunchOffset = (section - 1) % 3;

            for (let slotIndex = 0; slotIndex < TIME_SLOTS.length; slotIndex++) {
              if (anyScheduled) break;
              const slot = TIME_SLOTS[slotIndex];
              const globalKey = `${day}_${slot}`;
              if (!globalTeacherSchedule[globalKey]) globalTeacherSchedule[globalKey] = new Set();
              if (!globalRoomSchedule[globalKey]) globalRoomSchedule[globalKey] = new Set();

              const existingEntry = schedule[sectionKey][day].find(e => e.time === slot);
              if (existingEntry) continue;

              if (timetableScheduler.isLunchSlot(slot, lunchOffset, settings)) {
                schedule[sectionKey][day].push({ time: slot, course: 'LUNCH', teacher: '-', room: '-', type: 'break' });
                continue;
              }

              if (settings.wednesdayHalfDay && day === 'Wednesday') {
                const slotHour = timetableScheduler.getSlotStartHour(slot);
                if (slotHour >= settings.lunchEndHour) {
                  schedule[sectionKey][day].push({ time: slot, course: 'FREE', teacher: '-', room: '-', type: 'free' });
                  continue;
                }
              }

              const profKey = `${course.courseAbb}_${semester}`;
              let availableProfs = professorMap[profKey] || [];

              // Sort professors by their preference level if preferences are available
              if (preferences) {
                const courseCode = course['Course Code'] || course.courseCode;
                availableProfs.sort((a, b) => {
                  const prefA = preferences.teacherPreferences[a.Name]?.[courseCode]?.[sectionKey] || 0;
                  const prefB = preferences.teacherPreferences[b.Name]?.[courseCode]?.[sectionKey] || 0;
                  return prefB - prefA; // Higher preference first
                });
              }

              for (const prof of availableProfs) {
                if (anyScheduled) break;
                if (globalTeacherSchedule[globalKey].has(prof.Name)) continue;
                if (!AvailabilityParser.isAvailableAtTime(prof.availability, day, slot)) continue;

                // Skip if teacher has explicitly marked no preference (preference = 0)
                if (preferences) {
                  const courseCode = course['Course Code'] || course.courseCode;
                  const prefLevel = preferences.teacherPreferences[prof.Name]?.[courseCode]?.[sectionKey];
                  if (prefLevel === 0) continue; // Skip if teacher has explicitly marked no preference
                }

                const shouldSchedulePractical = needsPractical && slotIndex < TIME_SLOTS.length - 1 && !timetableScheduler.isLunchSlot(TIME_SLOTS[slotIndex + 1], lunchOffset, settings);
                const isPractical = shouldSchedulePractical;
                let roomPool = isPractical ? labRooms : lectureRooms;

                const specs = (course.Specializations || course.Specialization || 'NA').toString().split(',').map(s => s.trim());
                if (specs.length > 1 && specs[0] !== 'NA') {
                  const studentsPerSpec = Math.ceil(60 / specs.length);
                  const totalStudents = studentsPerSpec * specs.length;
                  if (totalStudents > 60) {
                    roomPool = [...lectureRooms, ...hallRooms].filter(r => (r.Capacity || r.capacity || 0) >= totalStudents);
                  }
                }

                for (const room of roomPool) {
                  if (anyScheduled) break;
                  if (globalRoomSchedule[globalKey].has(room['Room ID'])) continue;

                  if (isPractical) {
                    const labDurationMultiplier = settings.labDurationMultiplier || 2;
                    // const nextSlotIndex = slotIndex + 1;
                    
                    // Check if we have enough consecutive slots for the lab
                    let hasConsecutiveSlots = true;
                    for (let i = 0; i < labDurationMultiplier; i++) {
                      const checkSlotIndex = slotIndex + i;
                      if (checkSlotIndex >= TIME_SLOTS.length) {
                        hasConsecutiveSlots = false;
                        break;
                      }
                      const checkSlot = TIME_SLOTS[checkSlotIndex];
                      const checkGlobalKey = `${day}_${checkSlot}`;
                      if (!globalTeacherSchedule[checkGlobalKey]) globalTeacherSchedule[checkGlobalKey] = new Set();
                      if (!globalRoomSchedule[checkGlobalKey]) globalRoomSchedule[checkGlobalKey] = new Set();
                      
                      if (globalTeacherSchedule[checkGlobalKey].has(prof.Name) || 
                          globalRoomSchedule[checkGlobalKey].has(room['Room ID']) ||
                          !AvailabilityParser.isAvailableAtTime(prof.availability, day, checkSlot)) {
                        hasConsecutiveSlots = false;
                        break;
                      }
                      
                      const slotFilled = schedule[sectionKey][day].find(e => e.time === checkSlot);
                      if (slotFilled) {
                        hasConsecutiveSlots = false;
                        break;
                      }
                    }

                    if (!hasConsecutiveSlots) continue;

                    // Schedule the lab for all consecutive slots
                    for (let i = 0; i < labDurationMultiplier; i++) {
                      const currentSlotIndex = slotIndex + i;
                      const currentSlot = TIME_SLOTS[currentSlotIndex];
                      const currentGlobalKey = `${day}_${currentSlot}`;

                      schedule[sectionKey][day].push({
                        time: currentSlot, 
                        course: `${course['Course Title'] || course.courseTitle} (Lab)`,
                        teacher: prof.Name, 
                        room: room['Room Name'] || room.roomName, 
                        type: 'lab',
                        code: course['Course Code'] || course.courseCode, 
                        specialization: course.spec || 'NA'
                      });

                      globalTeacherSchedule[currentGlobalKey].add(prof.Name);
                      globalRoomSchedule[currentGlobalKey].add(room['Room ID']);
                    }

                    course.practicalsScheduled += 1;
                    course.labsByDay[day] = (course.labsByDay[day] || 0) + 1;
                    dailyLoadPerSection[sectionKey][day] += labDurationMultiplier;
                    sectionWorkload[sectionKey].labs += 1;
                    sectionWorkload[sectionKey].total += labDurationMultiplier;
                    anyScheduled = true;
                    break;
                  } else if (needsLecture) {
                    schedule[sectionKey][day].push({
                      time: slot, 
                      course: course['Course Title'] || course.courseTitle,
                      teacher: prof.Name, 
                      room: room['Room Name'] || room.roomName, 
                      type: 'lecture',
                      code: course['Course Code'] || course.courseCode, 
                      specialization: course.spec || 'NA'
                    });

                    globalTeacherSchedule[globalKey].add(prof.Name);
                    globalRoomSchedule[globalKey].add(room['Room ID']);

                    course.lecturesScheduled += 1;
                    course.lecturesByDay[day] = (course.lecturesByDay[day] || 0) + 1;
                    dailyLoadPerSection[sectionKey][day] += 1;
                    sectionWorkload[sectionKey].lectures += 1;
                    sectionWorkload[sectionKey].total += 1;
                    anyScheduled = true;
                    break;
                  }
                }
              }
            }
          }
        }
        if (!anyScheduled) break;
      }
    });

    return { schedule, oeBasketInfo };
  },

  // Helper method to validate schedule
  validateSchedule: (schedule, courses) => {
    const errors = [];
    const warnings = [];

    // Check for conflicts
    const teacherConflicts = new Set();
    const roomConflicts = new Set();

    Object.keys(schedule).forEach(section => {
      Object.keys(schedule[section]).forEach(day => {
        const daySchedule = schedule[section][day];
        const teacherSlots = {};
        const roomSlots = {};

        daySchedule.forEach(entry => {
          if (entry.teacher && entry.teacher !== '-') {
            if (!teacherSlots[entry.teacher]) teacherSlots[entry.teacher] = new Set();
            if (teacherSlots[entry.teacher].has(entry.time)) {
              teacherConflicts.add(`${entry.teacher} at ${entry.time} on ${day}`);
            }
            teacherSlots[entry.teacher].add(entry.time);
          }

          if (entry.room && entry.room !== '-') {
            if (!roomSlots[entry.room]) roomSlots[entry.room] = new Set();
            if (roomSlots[entry.room].has(entry.time)) {
              roomConflicts.add(`${entry.room} at ${entry.time} on ${day}`);
            }
            roomSlots[entry.room].add(entry.time);
          }
        });
      });
    });

    if (teacherConflicts.size > 0) {
      errors.push(`Teacher conflicts found: ${Array.from(teacherConflicts).join(', ')}`);
    }

    if (roomConflicts.size > 0) {
      errors.push(`Room conflicts found: ${Array.from(roomConflicts).join(', ')}`);
    }

    // Check if all courses are scheduled
    const scheduledCourses = new Set();
    Object.keys(schedule).forEach(section => {
      Object.keys(schedule[section]).forEach(day => {
        schedule[section][day].forEach(entry => {
          if (entry.code && entry.type !== 'break' && entry.type !== 'free') {
            scheduledCourses.add(entry.code);
          }
        });
      });
    });

    courses.forEach(course => {
      const courseCode = course['Course Code'] || course.courseCode;
      if (!scheduledCourses.has(courseCode)) {
        warnings.push(`Course ${courseCode} may not be fully scheduled`);
      }
    });

    return { errors, warnings, isValid: errors.length === 0 };
  },

  // Method to get scheduling statistics
  getSchedulingStats: (schedule) => {
    const stats = {
      totalSections: Object.keys(schedule).length,
      totalSlots: 0,
      lectures: 0,
      labs: 0,
      breaks: 0,
      freePeriods: 0,
      sectionStats: {}
    };

    Object.keys(schedule).forEach(section => {
      stats.sectionStats[section] = { lectures: 0, labs: 0, breaks: 0, freePeriods: 0, total: 0 };
      
      Object.keys(schedule[section]).forEach(day => {
        schedule[section][day].forEach(entry => {
          stats.totalSlots++;
          stats.sectionStats[section].total++;
          
          switch (entry.type) {
            case 'lecture':
              stats.lectures++;
              stats.sectionStats[section].lectures++;
              break;
            case 'lab':
              stats.labs++;
              stats.sectionStats[section].labs++;
              break;
            case 'break':
              stats.breaks++;
              stats.sectionStats[section].breaks++;
              break;
            case 'free':
              stats.freePeriods++;
              stats.sectionStats[section].freePeriods++;
              break;
          }
        });
      });
    });

    return stats;
  }
};

export default timetableScheduler;