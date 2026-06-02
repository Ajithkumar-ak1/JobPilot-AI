from graph.workflow import graph

result = graph.invoke(
    {
        "query": "AI Intern Bangalore"
    }
)

print(result["response"])