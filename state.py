from typing import TypedDict, List, Dict, Optional


class JobSearchState(TypedDict, total=False):
    query: str
    resume_text: Optional[str]

    jobs: List[Dict]
    matched_jobs: List[Dict]
    ranked_jobs: List[Dict]

    response: str