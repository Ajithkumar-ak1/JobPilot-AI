from typing import TypedDict, List, Dict, Optional
from datetime import datetime


class JobSearchState(TypedDict):
    query: str
    resume_text: str

    jobs: list
    matched_jobs: list
    ranked_jobs: list

    skill_gaps: dict

    response: str
    timestamp: str