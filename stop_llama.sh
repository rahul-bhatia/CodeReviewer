#!/bin/bash
pkill -f "ollama run codellama"
pkill -f "ollama serve"
echo "Stopped codellama and ollama server."
