from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


def match_agent(state):

    resume = state["resume_text"]

    jobs = state["jobs"]

    resume_embedding = model.encode(resume)

    matched_jobs = []

    for job in jobs:

        job_text = f"""
        {job.get('title','')}
        {job.get('company','')}
        {job.get('description','')}
        """

        job_embedding = model.encode(job_text)

        score = cosine_similarity(
            [resume_embedding],
            [job_embedding]
        )[0][0]

        job["match_score"] = round(
            float(score) * 100,
            2
        )

        matched_jobs.append(job)

    return {
        "matched_jobs": matched_jobs
    }