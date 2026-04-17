from langgraph.graph import StateGraph
from typing import TypedDict

from tools import (
    extract_tool,
    log_tool,
    summary_tool,
    suggestion_tool,
    edit_tool
)

# -------------------
# STATE
# -------------------
class State(TypedDict):
    message: str
    structured_data: dict
    summary: dict
    suggestion: dict
    edited: dict


# -------------------
# NODES
# -------------------

def extract_node(state):
    data = extract_tool(state["message"])
    return {"structured_data": data}


def log_node(state):
    log_tool(state["structured_data"])
    return state


def summary_node(state):
    return {
        "summary": summary_tool(state["structured_data"])
    }


def suggest_node(state):
    return {
        "suggestion": suggestion_tool(state["structured_data"])
    }


# OPTIONAL EDIT NODE (IMPORTANT FOR ASSIGNMENT)
def edit_node(state):
    if state.get("edit"):
        return {
            "edited": edit_tool(
                state["edit"]["id"],
                state["edit"]["data"]
            )
        }
    return state


# -------------------
# GRAPH
# -------------------
graph = StateGraph(State)

graph.add_node("extract", extract_node)
graph.add_node("log", log_node)
graph.add_node("summary", summary_node)
graph.add_node("suggest", suggest_node)
graph.add_node("edit", edit_node)

graph.set_entry_point("extract")

graph.add_edge("extract", "log")
graph.add_edge("log", "summary")
graph.add_edge("summary", "suggest")
graph.add_edge("suggest", "edit")

graph.set_finish_point("edit")

app = graph.compile()