from typing import TypedDict, List, Dict

class JobSearchState(TypedDict):
    query: str
    jobs: List[Dict]
    ranked_jobs: List[Dict]
    response: str