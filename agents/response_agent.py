from state import JobSearchState


def response_agent(state: JobSearchState):
    jobs = state["ranked_jobs"]

    output = []

    for idx, job in enumerate(jobs, start=1):
        output.append(
            f"{idx}. {job['title']} at {job['company']} "
            f"({job['location']}) - Score {job['score']}"
        )

    return {"response": "\n".join(output)}