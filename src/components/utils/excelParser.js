import * as XLSX from 'xlsx';
import { AvailabilityParser } from './AvailabilityParser';

export const excelParser = {
  parseExcel: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },

  processProfessors: (professorData) => {
    return professorData.map(prof => ({
      ...prof,
      availability: {
        days: AvailabilityParser.parseDays(prof.Day || prof.day),
        timeRange: AvailabilityParser.parseTimeRange(prof.Availability || prof.availability)
      }
    }));
  }
};

export default excelParser;