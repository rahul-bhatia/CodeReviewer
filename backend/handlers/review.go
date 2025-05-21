package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ReviewRequest struct {
	Code string `json:"code"`
}

func HandleReview(c *gin.Context) {
	var req ReviewRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	lineCount := len(splitLines(req.Code))
	message := fmt.Sprintf("Received code with %d line(s)", lineCount)

	c.JSON(http.StatusOK, gin.H{"message": message})
}

func splitLines(code string) []string {
	lines := []string{}
	start := 0
	for i, ch := range code {
		if ch == '\n' {
			lines = append(lines, code[start:i])
			start = i + 1
		}
	}
	if start < len(code) {
		lines = append(lines, code[start:])
	}
	return lines
}
