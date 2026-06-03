import React, { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiAlertCircle, FiLoader } from 'react-icons/fi';
import JobResults from './components/JobResults';
import ResumeUploader from './components/ResumeUploader';
import './styles/App.css';

function App() {
  const [query, setQuery] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!query.trim()) {
      setError('❌ Please enter a job search query (e.g., "Python Developer San Francisco")');
      setResults(null);
      return;
    }
    
    if (!resumeText.trim()) {
      setError('❌ Please upload a resume first');
      setResults(null);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('🔍 Searching for jobs and analyzing your resume...');
    
    try {
      // Check if backend is running
      const healthCheck = await axios
        .get('http://localhost:5000/api/health', { timeout: 5000 })
        .catch(() => {
          throw new Error('Backend server is not running on http://localhost:5000');
        });

      // Search for jobs
      const response = await axios.post(
        'http://localhost:5000/api/search-jobs',
        {
          query: query.trim(),
          resume_text: resumeText.trim()
        },
        { timeout: 60000 } // 60 second timeout for AI processing
      );

      // Error handling for empty results
      if (!response.data || !response.data.jobs) {
        throw new Error('Invalid response format from server');
      }

      if (response.data.jobs.length === 0) {
        setError('⚠️ No jobs found. Try a different search query or location.');
        setResults(null);
      } else {
        setResults(response.data);
        setSuccessMessage(
          `✅ Found ${response.data.jobs.length} job(s)! Click on any job to see match score and apply.`
        );
      }
    } catch (err) {
      console.error('Search error:', err);

      // Specific error messages based on error type
      let errorMessage = '❌ An error occurred during search. ';
      
      if (err.message.includes('Backend server is not running')) {
        errorMessage = '❌ Backend server is not running. Please start it with: python app.py';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = '❌ Cannot connect to backend. Make sure the server is running on http://localhost:5000';
      } else if (err.message.includes('timeout')) {
        errorMessage = '⏱️ Request timed out. The AI analysis is taking too long. Please try again.';
      } else if (err.response?.status === 400) {
        errorMessage = `❌ Bad request: ${err.response?.data?.error || 'Invalid input'}`;
      } else if (err.response?.status === 500) {
        errorMessage = `❌ Server error: ${err.response?.data?.error || 'Please check the backend logs'}`;
      } else if (err.response?.data?.error) {
        errorMessage = `❌ ${err.response.data.error}`;
      } else if (err.message) {
        errorMessage = `❌ ${err.message}`;
      }

      setError(errorMessage);
      setResults(null);
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (resumeData) => {
    if (resumeData && resumeData.trim().length > 0) {
      setResumeText(resumeData);
      setError('');
      setSuccessMessage('✅ Resume uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError('❌ Failed to parse resume. Please try another file.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-indigo-600">Job</span> Search Agent
          </h1>
          <p className="text-gray-600 mt-2">
            Find your perfect job match with AI-powered resume matching
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Resume Upload */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Upload Resume
              </h2>
              <ResumeUploader onUpload={handleResumeUpload} />
              {resumeText && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>Resume uploaded ({Math.round(resumeText.length / 1000)} KB)</span>
                </div>
              )}
            </div>

            {/* Search Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 2: Search Jobs
              </h2>
              <form onSubmit={handleSearch}>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="e.g., Python Developer San Francisco"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={loading || !resumeText}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200 font-medium"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <FiSearch className="w-5 h-5" />
                        Search Jobs
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-3">
              <span className="mt-1">ℹ️</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{error}</p>
                {error.includes('Backend server') && (
                  <p className="text-sm mt-2">
                    Open a terminal and run: <code className="bg-red-100 px-2 py-1 rounded">python app.py</code>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FiLoader className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-700 font-medium">Processing your resume and searching jobs...</p>
            <p className="text-gray-500 text-sm mt-2">This may take 10-20 seconds</p>
          </div>
        )}

        {/* Results Section */}
        {!loading && results && <JobResults results={results} />}

        {/* Empty State */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Upload your resume and search for jobs to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
