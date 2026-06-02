from graph.workflow import graph
from tools.resume_parser import parse_resume
import os


resume_path = "Ajith Kumar - Resume.pdf"

if not os.path.exists(resume_path):
    print(f"Error: {resume_path} not found in project directory!")
    print("Please add your resume PDF file as 'resume.pdf' in the project root.")
    exit(1)

print(f"Loading resume from {resume_path}...")
resume_text = parse_resume(resume_path)
print(f"Resume loaded successfully ({len(resume_text)} characters)\n")

result = graph.invoke(
    {
        "query": "Machine Learning Intern India",
        "resume_text": resume_text  
    }
)

print("\n" + "="*50)
print("JOB SEARCH RESULTS")
print("="*50)

if result.get("response"):
    print(result["response"])
else:
    print("No results found. Debug info:")
    print(f"Jobs found: {len(result.get('jobs', []))}")
    print(f"Matched jobs: {len(result.get('matched_jobs', []))}")
    print(f"Ranked jobs: {len(result.get('ranked_jobs', []))}")