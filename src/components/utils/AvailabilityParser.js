export const AvailabilityParser = {
  parseDays: (dayString) => {
    if (!dayString) return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const str = dayString.toString().trim().toLowerCase();
    if (str.includes('-') && (str.includes('mon') || str.includes('fri'))) {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }
    const days = [];
    const dayMap = {
      'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday',
      'thu': 'Thursday', 'thurs': 'Thursday', 'fri': 'Friday'
    };
    for (const [abbr, full] of Object.entries(dayMap)) {
      if (str.includes(abbr)) days.push(full);
    }
    return days.length > 0 ? days : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  },

  parseTimeRange: (timeString) => {
    if (!timeString) return { start: 0, end: 24 * 60 };
    const str = timeString.toString().trim();
    const match = str.match(/(\d{1,2}):?(\d{2})?\s*-\s*(\d{1,2}):?(\d{2})?/);
    if (match) {
      const startHour = parseInt(match[1]);
      const startMin = parseInt(match[2] || '0');
      const endHour = parseInt(match[3]);
      const endMin = parseInt(match[4] || '0');
      return { start: startHour * 60 + startMin, end: endHour * 60 + endMin };
    }
    return { start: 0, end: 24 * 60 };
  },

  isAvailableAtTime: (availability, day, timeSlot) => {
    if (!availability || !availability.days || !availability.timeRange) return true;
    if (!availability.days.includes(day)) return false;
    const slotMatch = timeSlot.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
    if (!slotMatch) return true;
    const slotStartMinutes = parseInt(slotMatch[1]) * 60 + parseInt(slotMatch[2]);
    const slotEndMinutes = parseInt(slotMatch[3]) * 60 + parseInt(slotMatch[4]);
    return slotStartMinutes >= availability.timeRange.start && slotEndMinutes <= availability.timeRange.end;
  }
};

export default AvailabilityParser;