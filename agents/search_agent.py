from state import JobSearchState


def search_agent(state: JobSearchState):
    query = state["query"]

    jobs = [
        {
            "title": "AI Intern",
            "company": "Company A",
            "location": "Bangalore",
            "score": 85
        },
        {
            "title": "ML Intern",
            "company": "Company B",
            "location": "Chennai",
            "score": 75
        },
        {
            "title": "Data Science Intern",
            "company": "Company C",
            "location": "Remote",
            "score": 90
        }
    ]

    return {"jobs": jobs}