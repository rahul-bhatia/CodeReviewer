package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/rahul-bhatia/CodeReviewer/handlers"
)

func main() {
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.POST("/review", handlers.HandleReview)

	log.Println("🚀 Server running at http://localhost:8080")
	router.Run(":8080")
}
