import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("RAPIDAPI_KEY")

URL = "https://jsearch.p.rapidapi.com/search"


def search_jobs(query: str):

    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    params = {
        "query": query,
        "page": 1,
        "num_pages": 1
    }

    response = requests.get(
        URL,
        headers=headers,
        params=params
    )

    response.raise_for_status()

    data = response.json()

    return data.get("data", [])