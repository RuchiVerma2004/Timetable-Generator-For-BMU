import React, { useMemo, useState } from 'react';

const TimetableQuickSelector = ({ professors = [], rooms = [], timetable = {}, DAYS = [], generateTimeSlots = [] }) => {
  const [type, setType] = useState('');
  const [professor, setProfessor] = useState('');
  const [room, setRoom] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');

  const { batches, semesters } = useMemo(() => {
    const batchSet = new Set();
    const semSet = new Set();
    Object.keys(timetable || {}).forEach(key => {
      const b = (key.match(/Batch_([^_]+)/) || [])[1];
      const s = (key.match(/Sem_([^_]+)/) || [])[1];
      if (b) batchSet.add(b);
      if (s) semSet.add(s);
    });
    return { batches: Array.from(batchSet).sort(), semesters: Array.from(semSet).sort() };
  }, [timetable]);

  const uniqueProfessors = useMemo(() => {
    return (professors || []).map(p => p.Name || p.name).filter(Boolean).sort();
  }, [professors]);

  const uniqueRooms = useMemo(() => {
    return (rooms || []).map(r => r['Room ID'] || r.roomId || r['Room Name'] || r.roomName).filter(Boolean).sort();
  }, [rooms]);

  // Build a lightweight view of filtered timetable
  const filtered = useMemo(() => {
    if (!timetable) return null;
    if (type === 'professor' && professor) {
      const out = {};
      DAYS.forEach(d => out[d] = []);
      Object.keys(timetable).forEach(section => {
        DAYS.forEach(d => {
          timetable[section][d].forEach(slot => {
            if ((slot.professor === professor) || (slot.professor && slot.professor.includes && slot.professor.includes(professor))) {
              out[d].push({ ...slot, section });
            }
          });
        });
      });
      return out;
    }

    if (type === 'room' && room) {
      const out = {};
      DAYS.forEach(d => out[d] = []);
      Object.keys(timetable).forEach(section => {
        DAYS.forEach(d => {
          timetable[section][d].forEach(slot => {
            if (slot.room === room) {
              out[d].push({ ...slot, section });
            }
          });
        });
      });
      return out;
    }

    if (type === 'section' && batch && semester) {
      const key = Object.keys(timetable).find(k => k.includes(`Batch_${batch}`) && k.includes(`Sem_${semester}`));
      if (!key) return null;
      return timetable[key];
    }

    return null;
  }, [type, professor, room, batch, semester, timetable, DAYS]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Timetable Viewer</h3>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">View</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full rounded-md border-gray-300 p-2">
            <option value="">Select</option>
            <option value="professor">Professor</option>
            <option value="room">Room</option>
            <option value="section">Section</option>
          </select>
        </div>

        {type === 'professor' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Professor</label>
            <select value={professor} onChange={e => setProfessor(e.target.value)} className="w-full rounded-md border-gray-300 p-2">
              <option value="">Select Professor</option>
              {uniqueProfessors.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
            </select>
          </div>
        )}

        {type === 'room' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Room</label>
            <select value={room} onChange={e => setRoom(e.target.value)} className="w-full rounded-md border-gray-300 p-2">
              <option value="">Select Room</option>
              {uniqueRooms.map((r, idx) => <option key={idx} value={r}>{r}</option>)}
            </select>
          </div>
        )}

        {type === 'section' && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Batch</label>
              <select value={batch} onChange={e => setBatch(e.target.value)} className="w-full rounded-md border-gray-300 p-2">
                <option value="">Select Batch</option>
                {batches.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Semester</label>
              <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full rounded-md border-gray-300 p-2">
                <option value="">Select Semester</option>
                {semesters.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Simple viewer */}
      <div>
        {!filtered && <div className="text-sm text-gray-500">No data for selection</div>}
        {filtered && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  {DAYS.map(d => <th key={d} className="px-4 py-2">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {generateTimeSlots.map(slot => (
                  <tr key={slot} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600">{slot}</td>
                    {DAYS.map(d => (
                      <td key={d} className="px-4 py-2 text-sm text-gray-800">
                        {Array.isArray(filtered[d]) ? (
                          filtered[d].filter(s => s.time === slot).map((s, i) => (
                            <div key={i} className="border rounded p-2 mb-1 bg-white">
                              <div className="font-medium text-sm">{s.course}</div>
                              {s.professor && <div className="text-xs text-gray-500">{s.professor}</div>}
                              {s.room && <div className="text-xs text-gray-500">{s.room}</div>}
                              {s.section && <div className="text-xs text-gray-500">{s.section}</div>}
                            </div>
                          ))
                        ) : (
                          // section timetable case
                          filtered[d] && filtered[d].find && (
                            filtered[d].find(s => s.time === slot) ? (
                              (() => {
                                const s = filtered[d].find(s2 => s2.time === slot);
                                return (
                                  <div className="border rounded p-2 mb-1 bg-white">
                                    <div className="font-medium text-sm">{s.course}</div>
                                    {s.professor && <div className="text-xs text-gray-500">{s.professor}</div>}
                                    {s.room && <div className="text-xs text-gray-500">{s.room}</div>}
                                  </div>
                                );
                              })()
                            ) : null
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableQuickSelector;
