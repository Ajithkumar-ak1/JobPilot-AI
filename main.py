from graph.workflow import graph

result = graph.invoke(
    {
        "query": "Machine Learning Intern India"
    }
)

print(result["response"])