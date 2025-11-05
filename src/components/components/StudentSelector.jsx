import React, { useMemo } from 'react';
// Assistant: ensure file is saved and free of stray syntax characters

const StudentSelector = ({ timetable, selectedSection, setSelectedSection }) => {
  // Build a list of full section keys (e.g. "Sem1_A") and display them in a readable form
  const sections = useMemo(() => {
    if (!timetable) return [];
    return Object.keys(timetable).map(k => ({ key: k, label: k.replace(/_/g, ' ') }));
  }, [timetable]);

  return (
    <div className="flex gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Section</label>
        <select
          className="px-3 py-2 border rounded-lg"
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
        >
          <option value="">Select Section</option>
          {sections.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StudentSelector;
