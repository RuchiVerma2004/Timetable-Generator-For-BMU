import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'exceljs';

const ExcelUpload = ({ onDataProcessed }) => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedData, setProcessedData] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadStatus('uploading');
    setError(null);
    
    try {
      const results = [];
      
      for (const file of acceptedFiles) {
        const workbook = new XLSX.Workbook();
        await workbook.xlsx.load(file);
        
        const fileData = {
          fileName: file.name,
          sheets: [],
          data: {}
        };
        
        // Process each worksheet
        workbook.eachSheet((worksheet, sheetId) => {
          const sheetData = [];
          const sheetName = worksheet.name;
          
          worksheet.eachRow((row, rowNumber) => {
            const rowData = [];
            row.eachCell((cell, colNumber) => {
              rowData[colNumber - 1] = cell.value;
            });
            if (rowData.some(cell => cell !== undefined)) {
              sheetData.push(rowData);
            }
          });
          
          fileData.sheets.push(sheetName);
          fileData.data[sheetName] = sheetData;
        });
        
        results.push(fileData);
      }
      
      setUploadedFiles(results);
      setProcessedData(results);
      setUploadStatus('success');
      
      // Process the data based on sheet names
      const processedData = processExcelData(results);
      onDataProcessed(processedData);
      
    } catch (err) {
      setError(err.message);
      setUploadStatus('error');
    }
  }, [onDataProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  const processExcelData = (files) => {
    const processedData = {
      courses: [],
      professors: [],
      rooms: [],
      constraints: [],
      batches: []
    };

    files.forEach(file => {
      Object.keys(file.data).forEach(sheetName => {
        const sheetData = file.data[sheetName];
        
        if (sheetName.toLowerCase().includes('course')) {
          processedData.courses = parseCourseData(sheetData);
        } else if (sheetName.toLowerCase().includes('professor') || sheetName.toLowerCase().includes('faculty')) {
          processedData.professors = parseProfessorData(sheetData);
        } else if (sheetName.toLowerCase().includes('room')) {
          processedData.rooms = parseRoomData(sheetData);
        } else if (sheetName.toLowerCase().includes('constraint')) {
          processedData.constraints = parseConstraintData(sheetData);
        } else if (sheetName.toLowerCase().includes('batch') || sheetName.toLowerCase().includes('section')) {
          processedData.batches = parseBatchData(sheetData);
        }
      });
    });

    return processedData;
  };

  const parseCourseData = (data) => {
    if (data.length < 2) return [];
    
    const headers = data[0];
    const courses = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) { // Check if first column has data
        courses.push({
          id: row[0] || `course_${i}`,
          name: row[1] || '',
          code: row[2] || '',
          credits: row[3] || 0,
          department: row[4] || '',
          semester: row[5] || '',
          year: row[6] || '',
          sections: row[7] || 1
        });
      }
    }
    
    return courses;
  };

  const parseProfessorData = (data) => {
    if (data.length < 2) return [];
    
    const professors = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        professors.push({
          id: row[0] || `prof_${i}`,
          name: row[1] || '',
          email: row[2] || '',
          department: row[3] || '',
          subjects: row[4] ? row[4].split(',').map(s => s.trim()) : [],
          availability: row[5] || '9:00-17:00',
          maxHours: row[6] || 40
        });
      }
    }
    
    return professors;
  };

  const parseRoomData = (data) => {
    if (data.length < 2) return [];
    
    const rooms = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        rooms.push({
          id: row[0] || `room_${i}`,
          name: row[1] || '',
          capacity: row[2] || 0,
          type: row[3] || 'lecture',
          floor: row[4] || '',
          building: row[5] || '',
          equipment: row[6] ? row[6].split(',').map(s => s.trim()) : []
        });
      }
    }
    
    return rooms;
  };

  const parseConstraintData = (data) => {
    if (data.length < 2) return [];
    
    const constraints = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        constraints.push({
          id: row[0] || `constraint_${i}`,
          type: row[1] || '',
          value: row[2] || '',
          description: row[3] || ''
        });
      }
    }
    
    return constraints;
  };

  const parseBatchData = (data) => {
    if (data.length < 2) return [];
    
    const batches = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        batches.push({
          id: row[0] || `batch_${i}`,
          name: row[1] || '',
          year: row[2] || '',
          branch: row[3] || '',
          sections: row[4] || 1,
          strength: row[5] || 0
        });
      }
    }
    
    return batches;
  };

  const downloadTemplate = () => {
    // Create template files for each data type
    const templates = {
      courses: [
        ['Course ID', 'Course Name', 'Course Code', 'Credits', 'Department', 'Semester', 'Year', 'Sections'],
        ['CSE101', 'Programming Fundamentals', 'CSE101', '3', 'CSE', '1', '2024', '2'],
        ['MAT201', 'Mathematics', 'MAT201', '4', 'Mathematics', '1', '2024', '3']
      ],
      professors: [
        ['Professor ID', 'Name', 'Email', 'Department', 'Subjects', 'Availability', 'Max Hours'],
        ['PROF001', 'Dr. John Smith', 'john@university.edu', 'CSE', 'CSE101,CSE102', '9:00-17:00', '40'],
        ['PROF002', 'Dr. Jane Doe', 'jane@university.edu', 'Mathematics', 'MAT201,MAT202', '9:00-17:00', '40']
      ],
      rooms: [
        ['Room ID', 'Room Name', 'Capacity', 'Type', 'Floor', 'Building', 'Equipment'],
        ['R001', 'Lecture Hall 1', '100', 'lecture', '1', 'Main Building', 'Projector,Whiteboard'],
        ['R002', 'Lab 1', '30', 'lab', '2', 'CS Building', 'Computers,Projector']
      ]
    };

    // Create and download template files
    Object.keys(templates).forEach(sheetName => {
      const workbook = new XLSX.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);
      
      templates[sheetName].forEach(row => {
        worksheet.addRow(row);
      });
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 15;
      });
      
      // Download the file
      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sheetName}_template.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-blue-900">Excel Data Upload</h3>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Download size={18} />
          <span>Download Templates</span>
        </button>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === 'uploading' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="text-green-500" size={48} />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="text-red-500" size={48} />
          ) : (
            <Upload className="text-gray-400" size={48} />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive
                ? 'Drop the files here...'
                : uploadStatus === 'success'
                ? 'Files uploaded successfully!'
                : uploadStatus === 'error'
                ? 'Upload failed'
                : 'Drag & drop Excel files here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports .xlsx and .xls files
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-blue-500" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {file.sheets.length} sheet(s): {file.sheets.join(', ')}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={20} />
              </div>
            ))}
          </div>
        </div>
      )}

      {processedData && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-md font-semibold text-blue-900 mb-2">Data Summary:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Courses:</span>
              <span className="ml-2 text-blue-800">{processedData.courses.length}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Professors:</span>
              <span className="ml-2 text-blue-800">{processedData.professors.length}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Rooms:</span>
              <span className="ml-2 text-blue-800">{processedData.rooms.length}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Batches:</span>
              <span className="ml-2 text-blue-800">{processedData.batches.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
