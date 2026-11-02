"""
One-click application launcher for PaperLens AI.
Starts the FastAPI server with production frontend static files mounted on http://127.0.0.1:8000.
"""
import sys
import os
import uvicorn

if __name__ == "__main__":
    # Ensure project root is in sys.path
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    print("=" * 60)
    print("  PaperLens AI - Document Intelligence & Literacy Platform")
    print("  Launching backend on: http://127.0.0.1:8000")
    print("  API Documentation at: http://127.0.0.1:8000/docs")
    print("=" * 60)

    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
