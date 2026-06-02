def response_agent(state):

    jobs = state["ranked_jobs"][:10]
    skill_gaps = state.get("skill_gaps", {})

    response = []

    for idx, job in enumerate(jobs, 1):

        job_title = job['title']
        job_skills = skill_gaps.get(job_title, "No skill gap analysis available")

        response.append(
            f"""
            {idx}. {job_title}
            Company: {job['company']}
            Match Score: {job['match_score']}%
            Location: {job['location']}
            
            Skill Gaps:
            {job_skills}
            """
        )

    return {
        "response": "\n".join(response)
    }