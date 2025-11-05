import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import PreferenceUpload from './preference/PreferenceUpload';
import FixedAssignmentsView from './preference/FixedAssignmentsView';
import ElectiveCoursesView from './preference/ElectiveCoursesView';

const PreferenceSection = ({ onFixedAssignmentsUpdate, onElectiveCoursesUpdate }) => {
  const [excelData, setExcelData] = useState(null);
  const [fixedAssignments, setFixedAssignments] = useState({});
  const [electiveCourses, setElectiveCourses] = useState({});
  const [loading, setLoading] = useState(false);
  const [sectionsCount, setSectionsCount] = useState(8); // Default, will be updated dynamically

  // Process Excel file when uploaded
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        setExcelData(jsonData);
        const processedData = processExcelData(jsonData);
        setFixedAssignments(processedData.fixedAssignments);
        setElectiveCourses(processedData.electiveCourses);
        
        // Notify parent components
        onFixedAssignmentsUpdate(processedData.fixedAssignments);
        onElectiveCoursesUpdate(processedData.electiveCourses);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Error processing Excel file. Please check the format.');
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Main function to process Excel data
  const processExcelData = (data) => {
    const fixedAssignments = {};
    const electiveCourses = {};
    let currentSemester = '';
    let maxSections = 0;

    // First pass: Find maximum sections count
    data.forEach(row => {
      if (row && row.length > 0) {
        // Check header row for sections
        if (row.includes('Section 1')) {
          const sectionColumns = row.filter(cell => 
            typeof cell === 'string' && cell.startsWith('Section')
          );
          maxSections = Math.max(maxSections, sectionColumns.length);
        }
      }
    });

    setSectionsCount(maxSections);

    // Process main courses
    data.forEach((row) => {
      if (!row || row.length === 0) return;

      // Detect semester headers
      if (row[0] && typeof row[0] === 'string') {
        const semMatch = row[0].match(/(\d+(?:st|nd|rd|th)\s+Sem)/);
        if (semMatch) {
          currentSemester = semMatch[1];
        }
      }

      // Process course rows
      if (currentSemester && row[1] && isValidCourseRow(row)) {
        const courseTitle = row[1].trim();
        
        if (!isElectiveOrSpecialRow(courseTitle)) {
          fixedAssignments[courseTitle] = {
            semester: currentSemester,
            credits: row[2] || '',
            ldp: row[3] || '',
            fixedSections: {}
          };

          // Process sections dynamically
          for (let i = 4; i < 4 + maxSections && i < row.length; i++) {
            if (row[i] && typeof row[i] === 'string') {
              const sectionName = `Section ${i - 3}`;
              const facultyInfo = parseFacultyInfo(row[i]);
              
              if (facultyInfo && facultyInfo.faculty && !facultyInfo.isGuest) {
                fixedAssignments[courseTitle].fixedSections[sectionName] = facultyInfo;
              }
            }
          }
        }
      }
    });

    // Process elective courses
    processElectivesData(data, electiveCourses);

    return { fixedAssignments, electiveCourses };
  };

  // Check if row is a valid course row
  const isValidCourseRow = (row) => {
    return row[1] !== 'Course Title' && 
           row[1] !== 'Elective-I (Specialization Specific)' &&
           row[1] !== 'Students are required to select any one course from the respective basket';
  };

  // Check if it's elective or special row
  const isElectiveOrSpecialRow = (courseTitle) => {
    return courseTitle.includes('Elective') || 
           courseTitle.includes('Students are required') ||
           courseTitle === '';
  };

  // Parse faculty information from cell
  const parseFacultyInfo = (facultyString) => {
    if (!facultyString) return null;

    // Clean the string
    let cleaned = facultyString
      .replace(/<br>/gi, ' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Check for guest faculty
    const isGuest = cleaned.includes('Guest Faculty') || 
                   cleaned.includes('Visiting') || 
                   cleaned.includes('Arranged');

    // Extract faculty name
    let facultyName = '';
    const nameMatch = cleaned.match(/((Dr\.?|Mr|Ms|Prof)\s+[A-Za-z\s]+(?=\s|$|\(|\)|-))/);
    if (nameMatch) {
      facultyName = nameMatch[1].trim();
    } else if (!isGuest) {
      // If no title but not guest, use first part
      facultyName = cleaned.split('(')[0].split('-')[0].trim();
    }

    // Check for LAB designation
    const isLab = cleaned.toLowerCase().includes('lab');

    return {
      faculty: facultyName,
      isGuest: isGuest,
      isLab: isLab,
      originalText: cleaned
    };
  };

  // Process elective courses data
  const processElectivesData = (data, electiveCourses) => {
    let currentSpecialization = '';
    let currentSemester = '';

    data.forEach((row) => {
      if (!row || row.length === 0) return;

      // Detect specialization
      if (row[0] && typeof row[0] === 'string') {
        if (row[0].includes('Electives:')) {
          currentSpecialization = row[0].replace('Electives:', '').trim();
        } else if (row[0] === 'EComE') {
          currentSpecialization = 'EComE';
        }
      }

      // Detect semester in elective section
      if (row[2] && typeof row[2] === 'string') {
        const semMatch = row[2].match(/(\d+(?:th|rd)\s+sem)/i);
        if (semMatch) {
          currentSemester = row[2].trim();
        }
      }

      // Process elective course entries
      if (currentSpecialization && currentSemester && row[3] && row[3] !== 'Course name') {
        const courseName = row[3].trim();
        if (courseName && courseName !== 'Elective-I (Specialization Specific)') {
          const key = `${currentSpecialization}-${courseName}-${currentSemester}`;
          
          electiveCourses[key] = {
            specialization: currentSpecialization,
            course: courseName,
            semester: currentSemester,
            sections: parseInt(row[4]) || 1,
            ldp: row[5] || '',
            faculty: row[6] || '',
            remarks: row[7] || ''
          };
        }
      }
    });
  };

  return (
    <div className="preference-section bg-white rounded-lg shadow-md p-6 mb-6">
      <PreferenceUpload onFileChange={handleFileUpload} loading={loading} />

      {excelData && (
        <div className="results-section">
          <FixedAssignmentsView fixedAssignments={fixedAssignments} sectionsCount={sectionsCount} />
          <ElectiveCoursesView electiveCourses={electiveCourses} />
        </div>
      )}

      <div className="instructions mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-md font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload the department's course allocation Excel file</li>
          <li>• Fixed faculty assignments will be automatically detected and preserved</li>
          <li>• Guest faculty and 'Arranged' sections will be treated as flexible</li>
          <li>• Elective courses will be processed separately</li>
          <li>• Section count is dynamically detected from the Excel file</li>
        </ul>
      </div>
    </div>
  );
};

export default PreferenceSection;