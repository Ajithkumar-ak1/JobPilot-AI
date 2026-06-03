import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

function ResumeUploader({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  const SUPPORTED_TYPES = ['application/pdf', 'text/plain'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    // Reset states
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validate file type
      if (!SUPPORTED_TYPES.includes(file.type)) {
        throw new Error(
          `Unsupported file type: ${file.type}. Please upload PDF or TXT files only.`
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`
        );
      }

      // Check for empty files
      if (file.size === 0) {
        throw new Error('File is empty. Please select a valid file.');
      }

      setFileName(file.name);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'http://localhost:5000/api/upload-resume',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // Validate response
      if (!response.data || !response.data.resume_text) {
        throw new Error('Invalid response from server. No resume text extracted.');
      }

      // Check if any text was extracted
      if (response.data.resume_text.trim().length === 0) {
        throw new Error(
          'No text extracted from resume. The file may be encrypted or corrupted. Try a different file.'
        );
      }

      // Success
      onUpload(response.data.resume_text);
      setSuccess(true);
      setError('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);

      let errorMessage = 'Failed to upload resume. ';

      if (err.message.includes('Unsupported file type')) {
        errorMessage = err.message;
      } else if (err.message.includes('exceeds')) {
        errorMessage = err.message;
      } else if (err.message.includes('empty')) {
        errorMessage = err.message;
      } else if (err.message.includes('No text extracted')) {
        errorMessage = err.message;
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server. Make sure it is running.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Upload timed out. Please try again.';
      } else if (err.response?.status === 400) {
        errorMessage = `Bad request: ${err.response?.data?.error || 'Invalid file'}`;
      } else if (err.response?.status === 413) {
        errorMessage = 'File is too large. Maximum size is 10MB.';
      } else if (err.response?.status === 500) {
        errorMessage = `Server error: ${err.response?.data?.error || 'Please try again'}`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <FiUpload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 mb-2 font-medium">
          Drag your resume here or{' '}
          <label className="text-indigo-600 cursor-pointer font-semibold hover:text-indigo-700">
            click to browse
            <input
              type="file"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="hidden"
              accept=".pdf,.txt"
            />
          </label>
        </p>
        <p className="text-sm text-gray-500">Supported: PDF, TXT (Max 10MB)</p>

        {isLoading && (
          <p className="text-sm text-indigo-600 mt-3 font-medium">
            ⏳ Parsing resume...
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 text-sm font-medium">Upload Failed</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-700 text-sm font-medium">Resume Parsed Successfully</p>
            <p className="text-green-600 text-sm mt-1">{fileName}</p>
          </div>
        </div>
      )}

      {/* File Info */}
      {fileName && !error && (
        <p className="text-xs text-gray-500 text-center">
          Uploaded: {fileName}
        </p>
      )}
    </div>
  );
}

export default ResumeUploader;
