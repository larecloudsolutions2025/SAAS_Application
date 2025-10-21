#!/bin/bash
# Kill any process using port 8000
PID=$(lsof -t -i:8000)
if [ -n "$PID" ]; then
  echo "Killing process on port 8000 (PID: $PID)"
  kill -9 $PID
fi

# Start backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
