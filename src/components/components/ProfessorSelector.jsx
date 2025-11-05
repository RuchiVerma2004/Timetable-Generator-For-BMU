import React from 'react';

const ProfessorSelector = ({ professors, selectedProfessor, setSelectedProfessor }) => {
  const labelFor = (prof, idx) => {
    return prof['Name'] || prof.Name || prof.name || prof.professor || prof.Email || `Professor ${idx + 1}`;
  };

  // Sort professors alphabetically by label to present a stable, predictable list
  const sorted = (professors || []).slice().sort((a, b) => {
    const la = (labelFor(a) || '').toString();
    const lb = (labelFor(b) || '').toString();
    return la.localeCompare(lb, undefined, { sensitivity: 'base', numeric: true });
  });

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Professor</label>
      <select
        className="px-3 py-2 border rounded-lg"
        value={selectedProfessor}
        onChange={e => setSelectedProfessor(e.target.value)}
      >
        <option value="">Select Professor</option>
        {sorted.map((prof, idx) => (
          <option key={idx} value={labelFor(prof, idx)}>{labelFor(prof, idx)}</option>
        ))}
      </select>
    </div>
  );
};

export default ProfessorSelector;
