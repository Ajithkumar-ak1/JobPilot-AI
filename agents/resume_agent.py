from state import JobSearchState


def resume_agent(state: JobSearchState):

    resume_text = state.get("resume_text", "")

    return {
        "resume_text": resume_text
    }