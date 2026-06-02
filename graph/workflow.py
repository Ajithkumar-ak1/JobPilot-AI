from langgraph.graph import StateGraph, END

from state import JobSearchState

from agents.search_agent import search_agent
from agents.ranking_agent import ranking_agent
from agents.response_agent import response_agent
from agents.resume_agent import resume_agent
from agents.match_agent import match_agent
from agents.skill_gap_agent import skill_gap_agent

builder = StateGraph(JobSearchState)

builder.add_node("search_agent", search_agent)
builder.add_node("resume_agent", resume_agent)
builder.add_node("match_agent", match_agent)
builder.add_node("ranking_agent", ranking_agent)
builder.add_node("skill_gap_agent", skill_gap_agent)
builder.add_node("response_agent", response_agent)

builder.set_entry_point("search_agent")

builder.add_edge("search_agent", "resume_agent")
builder.add_edge("resume_agent", "match_agent")
builder.add_edge("match_agent", "ranking_agent")
builder.add_edge("ranking_agent", "skill_gap_agent")
builder.add_edge("skill_gap_agent", "response_agent")
builder.add_edge("response_agent", END)

graph = builder.compile()