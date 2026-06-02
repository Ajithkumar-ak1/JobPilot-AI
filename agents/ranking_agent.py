from state import JobSearchState


def ranking_agent(state: JobSearchState):

    jobs = state["jobs"]

    return {"ranked_jobs": jobs}