from state import JobSearchState
from tools.job_api import search_jobs


def search_agent(state: JobSearchState):

    query = state["query"]

    jobs = search_jobs(query)

    cleaned_jobs = []

    for job in jobs:

        cleaned_jobs.append(
            {
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": job.get("job_city"),
                "apply_link": job.get("job_apply_link"),
            }
        )

    return {"jobs": cleaned_jobs}