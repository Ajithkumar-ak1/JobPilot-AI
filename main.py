from graph.workflow import graph

result = graph.invoke(
    {
        "query": "Machine Learning Intern India",
        "resume_text": ""  # Add your resume text here or load from a file
    }
)

print(result["response"])