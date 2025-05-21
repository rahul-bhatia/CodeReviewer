#!/bin/bash

set -e

LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/setup.log"
OLLAMA_LOG="$LOG_DIR/ollama-server.log"

# Clear previous logs
> "$LOG_FILE"
> "$OLLAMA_LOG"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

PORT=11434

log "Checking if Ollama is installed..."
if ! command -v ollama &> /dev/null; then
  log "Ollama not found. Installing..."
  curl -fsSL https://ollama.com/install.sh | sh >> "$LOG_FILE" 2>&1
  export PATH=$PATH:/usr/local/bin
  log "Ollama installation completed."
else
  log "Ollama is already installed."
fi

# Start server only if port 11434 is not in use
if lsof -i tcp:$PORT &>/dev/null; then
  log "Port $PORT is already in use. Ollama server may already be running."
else
  log "Starting Ollama server on port $PORT..."
  ollama serve > "$OLLAMA_LOG" 2>&1 &
  
  log "Waiting for Ollama server to become ready..."
  until curl -s http://127.0.0.1:$PORT > /dev/null; do
    sleep 1
  done
  log "Ollama server is live at http://127.0.0.1:$PORT"
fi

log "Pulling CodeLLaMA model..."
script -q -c "ollama pull codellama" >> "$LOG_FILE" 2>&1

log "Running CodeLLaMA..."
script -q -c "ollama run codellama" /dev/null >> "$LOG_FILE" 2>&1
