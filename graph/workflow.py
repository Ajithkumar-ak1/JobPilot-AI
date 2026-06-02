from langgraph.graph import StateGraph, END

from state import JobSearchState

from agents.search_agent import search_agent
from agents.ranking_agent import ranking_agent
from agents.response_agent import response_agent


builder = StateGraph(JobSearchState)

builder.add_node("search_agent", search_agent)
builder.add_node("ranking_agent", ranking_agent)
builder.add_node("response_agent", response_agent)

builder.set_entry_point("search_agent")

builder.add_edge("search_agent", "ranking_agent")
builder.add_edge("ranking_agent", "response_agent")
builder.add_edge("response_agent", END)

graph = builder.compile()