// Teacher preference parser
export class PreferenceParser {
  static parsePreferences(rows) {
    const preferences = {
      teacherPreferences: {},  // teacher -> {courseCode: {sectionKey: preferenceLevel}}
      coursePreferences: {},   // courseCode -> {teacher: {sectionKey: preferenceLevel}}
      sectionPreferences: {}   // sectionKey -> {courseCode: {teacher: preferenceLevel}}
    };

    rows.forEach(row => {
      const teacher = row.Teacher || row.teacher || row.Name || row.name;
      const courseCode = row['Course Code'] || row.courseCode || row['Course Abb'] || row.courseAbb;
      const semester = row.Semester || row.semester;
      const section = row.Section || row.section;
      const batch = row.Batch || row.batch || 'NA';
      const preferenceLevel = parseInt(row.Preference || row.preference) || 0;

      if (!teacher || !courseCode || !semester || !section) return;

      const sectionKey = `Batch_${batch}_Sem_${semester}_Sec_${section}`;

      // Store by teacher
      if (!preferences.teacherPreferences[teacher]) {
        preferences.teacherPreferences[teacher] = {};
      }
      if (!preferences.teacherPreferences[teacher][courseCode]) {
        preferences.teacherPreferences[teacher][courseCode] = {};
      }
      preferences.teacherPreferences[teacher][courseCode][sectionKey] = preferenceLevel;

      // Store by course
      if (!preferences.coursePreferences[courseCode]) {
        preferences.coursePreferences[courseCode] = {};
      }
      if (!preferences.coursePreferences[courseCode][teacher]) {
        preferences.coursePreferences[courseCode][teacher] = {};
      }
      preferences.coursePreferences[courseCode][teacher][sectionKey] = preferenceLevel;

      // Store by section
      if (!preferences.sectionPreferences[sectionKey]) {
        preferences.sectionPreferences[sectionKey] = {};
      }
      if (!preferences.sectionPreferences[sectionKey][courseCode]) {
        preferences.sectionPreferences[sectionKey][courseCode] = {};
      }
      preferences.sectionPreferences[sectionKey][courseCode][teacher] = preferenceLevel;
    });

    return preferences;
  }

  static getPreferenceLevel(preferences, teacher, courseCode, sectionKey) {
    try {
      return preferences?.teacherPreferences[teacher]?.[courseCode]?.[sectionKey] || 0;
    } catch {
      return 0;
    }
  }

  static getPreferredTeachers(preferences, courseCode, sectionKey) {
    try {
      const teacherPrefs = preferences?.sectionPreferences[sectionKey]?.[courseCode] || {};
      return Object.entries(teacherPrefs)
        .sort(([, prefA], [, prefB]) => prefB - prefA)
        .map(([teacher]) => teacher);
    } catch {
      return [];
    }
  }
}