from langchain_core.messages import HumanMessage
from llm import llm


def skill_gap_agent(state):

    jobs = state["matched_jobs"][:5]

    resume = state["resume_text"]

    skill_gaps = {}

    for job in jobs:

        prompt = f"""
                Resume:

                {resume}

                Job Description:

                {job['description']}

                Return only:

                1. Missing Skills
                2. Important Skills
                3. Learning Priority
                """

        response = llm.invoke(
            [HumanMessage(content=prompt)]
        )

        skill_gaps[job["title"]] = response.content

    return {
        "skill_gaps": skill_gaps
    }