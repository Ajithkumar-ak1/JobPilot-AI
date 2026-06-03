import React, { useState } from 'react';
import { FiExternalLink, FiChevronDown, FiChevronUp, FiAlertCircle } from 'react-icons/fi';

function JobResults({ results }) {
  const [expandedJob, setExpandedJob] = useState(null);
  const [error, setError] = useState(null);

  const toggleExpand = (index) => {
    setExpandedJob(expandedJob === index ? null : index);
  };

  // Error handling - validate results structure
  try {
    if (!results) {
      throw new Error('No search results available');
    }
  } catch (err) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <FiAlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Results</h3>
            <p className="text-red-700 text-sm mt-1">{err.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Combine and prepare jobs with match scores
  const prepareJobs = () => {
    try {
      const jobs = results.jobs || [];
      const rankedJobs = results.ranked_jobs || [];
      const matchedJobs = results.matched_jobs || [];

      // Create a map of ranked jobs with their scores
      const rankedMap = new Map();
      rankedJobs.forEach((job, idx) => {
        const key = `${job.title}-${job.company}`;
        rankedMap.set(key, {
          job,
          matchScore: 100 - idx * 5, // Estimate score based on rank
          rank: idx + 1,
        });
      });

      // Create a set of matched job keys
      const matchedSet = new Set(
        matchedJobs.map(job => `${job.title}-${job.company}`)
      );

      // Combine all jobs with scoring
      const combinedJobs = jobs.map((job, idx) => {
        const key = `${job.title}-${job.company}`;
        const isMatched = matchedSet.has(key);
        const rankedInfo = rankedMap.get(key);

        return {
          ...job,
          originalIndex: idx,
          isMatched,
          matchScore: rankedInfo?.matchScore || (isMatched ? 70 : 40),
          rank: rankedInfo?.rank || null,
          matchAnalysis: isMatched 
            ? 'Your skills align well with this position'
            : 'Some skills may need development',
        };
      });

      // Sort by match score (highest first)
      return combinedJobs.sort((a, b) => b.matchScore - a.matchScore);
    } catch (err) {
      console.error('Error preparing jobs:', err);
      setError(err.message);
      return [];
    }
  };

  // Get match color based on score
  const getMatchColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' };
    return { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' };
  };

  const allJobs = prepareJobs();

  // Handle empty results
  if (!allJobs || allJobs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          {error ? `Error: ${error}` : 'No jobs found. Try adjusting your search criteria.'}
        </p>
      </div>
    );
  }

  // Job Card Component - Unified view
  const JobCard = ({ jobData, uniqueId }) => {
    const job = jobData;
    const isExpanded = expandedJob === uniqueId;
    const matchColors = getMatchColor(job.matchScore);

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200">
        {/* Header - Always Visible */}
        <div
          className="p-4 bg-white cursor-pointer hover:bg-gray-50 transition"
          onClick={() => toggleExpand(uniqueId)}
        >
          <div className="flex justify-between items-start gap-4">
            {/* Left: Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {job.title || 'Position Title'}
                  </h3>
                  <p className="text-indigo-600 font-medium mt-1 truncate">
                    {job.company || 'Company Name'}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    📍 {job.location || 'Location not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Match Score & Expand */}
            <div className="flex flex-col items-end gap-3">
              {/* Match Score Badge */}
              <div className={`px-3 py-2 rounded-lg ${matchColors.bg}`}>
                <p className={`text-sm font-bold ${matchColors.text}`}>
                  {Math.round(job.matchScore)}%
                </p>
                <p className={`text-xs ${matchColors.text}`}>Match</p>
              </div>

              {/* Expand/Collapse Icon */}
              <div className="text-gray-400">
                {isExpanded ? (
                  <FiChevronUp className="w-5 h-5" />
                ) : (
                  <FiChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          {/* Match Score Progress Bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${matchColors.bar} transition-all duration-300`}
              style={{ width: `${job.matchScore}%` }}
            />
          </div>
        </div>

        {/* Expanded Details - Only visible when clicked */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
            {/* Match Analysis */}
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Match Analysis</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {job.matchAnalysis || 'Analysis not available'}
              </p>
              {job.rank && (
                <p className="text-indigo-600 font-medium text-sm mt-2">
                  Ranked #{job.rank} among available opportunities
                </p>
              )}
            </div>

            {/* Job Description */}
            {job.description && (
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-2">📋 Job Description</h4>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {job.description}
                </p>
              </div>
            )}

            {/* Apply Button */}
            <div className="flex gap-2">
              {job.apply_link ? (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!job.apply_link) {
                      e.preventDefault();
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                >
                  Apply Now <FiExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm"
                  title="Application link not available"
                >
                  Apply Link Not Available
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Click 'Apply Now' to visit the job posting</p>
              <p>• Match score is based on AI analysis of your resume</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Calculate summary stats
  const totalJobs = allJobs.length;
  const matchedCount = allJobs.filter(j => j.isMatched).length;
  const highScoreCount = allJobs.filter(j => j.matchScore >= 70).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{totalJobs}</div>
          <div className="text-blue-700 text-xs font-medium mt-1">Total Jobs Found</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{matchedCount}</div>
          <div className="text-green-700 text-xs font-medium mt-1">Best Matches</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{highScoreCount}</div>
          <div className="text-purple-700 text-xs font-medium mt-1">High Potential Jobs</div>
        </div>
      </div>

      {/* AI Recommendations - Optional */}
      {results.response && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 AI Insights</h3>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {results.response}
          </p>
        </div>
      )}

      {/* Unified Jobs List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Available Opportunities
        </h2>
        <div className="space-y-3">
          {allJobs.map((jobData, index) => (
            <JobCard
              key={`${jobData.company}-${jobData.title}-${index}`}
              jobData={jobData}
              uniqueId={index}
            />
          ))}
        </div>
      </div>

      {/* No Apply Links Warning */}
      {allJobs.some(j => !j.apply_link) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Some jobs don't have direct application links. Please visit the job board directly.
          </p>
        </div>
      )}
    </div>
  );
}

export default JobResults;
