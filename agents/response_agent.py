from state import JobSearchState


def response_agent(state: JobSearchState):

    jobs = state["ranked_jobs"][:10]

    lines = []

    for i, job in enumerate(jobs, start=1):

        lines.append(
            f"""
            {i}. {job['title']}
            Company: {job['company']}
            Location: {job['location']}
            Apply: {job['apply_link']}
            """
        )

    return {"response": "\n".join(lines)}