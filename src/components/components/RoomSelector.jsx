import React from 'react';

const RoomSelector = ({ rooms, selectedRoom, setSelectedRoom }) => {
  const labelFor = (room, idx) => {
    return room['Room Name'] || room['Room'] || room['Room ID'] || room.room || room.name || `Room ${idx + 1}`;
  };

  // Sort rooms alphabetically by label for a predictable dropdown
  const sorted = (rooms || []).slice().sort((a, b) => {
    const la = (labelFor(a) || '').toString();
    const lb = (labelFor(b) || '').toString();
    return la.localeCompare(lb, undefined, { sensitivity: 'base', numeric: true });
  });

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Room</label>
      <select
        className="px-3 py-2 border rounded-lg"
        value={selectedRoom}
        onChange={e => setSelectedRoom(e.target.value)}
      >
        <option value="">Select Room</option>
        {sorted.map((room, idx) => (
          <option key={idx} value={labelFor(room, idx)}>{labelFor(room, idx)}</option>
        ))}
      </select>
    </div>
  );
};

export default RoomSelector;
