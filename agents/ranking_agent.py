def ranking_agent(state):

    jobs = state["matched_jobs"]

    ranked_jobs = sorted(
        jobs,
        key=lambda x: x["match_score"],
        reverse=True
    )

    return {
        "ranked_jobs": ranked_jobs
    }