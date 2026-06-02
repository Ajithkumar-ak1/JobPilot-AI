def response_agent(state):

    jobs = state["ranked_jobs"][:10]

    response = []

    for idx, job in enumerate(jobs, 1):

        response.append(
            f"""
            {idx}. {job['title']}
            Company: {job['company']}
            Match Score: {job['match_score']}%
            Location: {job['location']}
            """
        )

    return {
        "response": "\n".join(response)
    }