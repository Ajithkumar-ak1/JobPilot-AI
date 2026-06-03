from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from graph.workflow import graph
from tools.resume_parser import parse_resume
import traceback

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200


@app.route('/api/search-jobs', methods=['POST'])
def search_jobs_endpoint():
    """
    Search for jobs based on query and resume
    Expects: {
        "query": "Machine Learning Intern India",
        "resume_text": "resume content or file path"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        query = data.get('query', '').strip()
        resume_text = data.get('resume_text', '').strip()
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        if not resume_text:
            return jsonify({"error": "Resume text is required"}), 400
        
        # Run the multi-agent workflow
        result = graph.invoke({
            "query": query,
            "resume_text": resume_text
        })
        
        # Format the response with job links
        formatted_result = {
            "query": query,
            "jobs_found": len(result.get("jobs", [])),
            "jobs": result.get("jobs", []),
            "matched_jobs": result.get("matched_jobs", []),
            "ranked_jobs": result.get("ranked_jobs", []),
            "skill_gaps": result.get("skill_gaps", {}),
            "response": result.get("response", ""),
            "timestamp": str(result.get("timestamp", ""))
        }
        
        return jsonify(formatted_result), 200
    
    except Exception as e:
        print(f"Error in search_jobs_endpoint: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "message": "An error occurred during job search"
        }), 500


@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    """
    Upload resume file and parse it
    Returns: {"resume_text": "parsed resume content"}
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                "error": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
        
        # Save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse the resume
        resume_text = parse_resume(filepath)
        
        # Clean up the uploaded file
        os.remove(filepath)
        
        return jsonify({
            "resume_text": resume_text,
            "length": len(resume_text)
        }), 200
    
    except Exception as e:
        print(f"Error in upload_resume: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "message": "An error occurred during resume parsing"
        }), 500


@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """
    Get formatted jobs with all details including links
    Query params: query, resume_text
    """
    try:
        query = request.args.get('query', '').strip()
        resume_text = request.args.get('resume_text', '').strip()
        
        if not query or not resume_text:
            return jsonify({"error": "Query and resume_text are required"}), 400
        
        result = graph.invoke({
            "query": query,
            "resume_text": resume_text
        })
        
        jobs = result.get("jobs", [])
        matched_jobs = result.get("matched_jobs", [])
        
        return jsonify({
            "total": len(jobs),
            "matched": len(matched_jobs),
            "jobs": jobs,
            "matched_jobs": matched_jobs
        }), 200
    
    except Exception as e:
        print(f"Error in get_jobs: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "message": "An error occurred fetching jobs"
        }), 500


@app.route('/api/job/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    """Get detailed information about a specific job"""
    try:
        query = request.args.get('query', '')
        resume_text = request.args.get('resume_text', '')
        
        if not query or not resume_text:
            return jsonify({"error": "Query and resume_text are required"}), 400
        
        result = graph.invoke({
            "query": query,
            "resume_text": resume_text
        })
        
        jobs = result.get("jobs", [])
        
        if job_id < 0 or job_id >= len(jobs):
            return jsonify({"error": "Job not found"}), 404
        
        job = jobs[job_id]
        return jsonify(job), 200
    
    except Exception as e:
        print(f"Error in get_job_details: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "message": "An error occurred fetching job details"
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
