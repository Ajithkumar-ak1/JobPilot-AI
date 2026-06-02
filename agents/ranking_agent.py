from state import JobSearchState


def ranking_agent(state: JobSearchState):
    jobs = state["jobs"]

    ranked_jobs = sorted(
        jobs,
        key=lambda x: x["score"],
        reverse=True
    )

    return {"ranked_jobs": ranked_jobs}