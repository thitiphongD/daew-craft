export const mockSnippets = [
  {
    id: "1",
    title: "React Hook for API Calls",
    language: "javascript",
    description: "Custom hook for handling API requests with loading and error states",
    code: `import { useState, useEffect } from 'react';
  
  export const useApi = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const controller = new AbortController();
      
      fetch(url, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(setData)
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        })
        .finally(() => setLoading(false));
  
      return () => controller.abort();
    }, [url]);
  
    return { data, loading, error };
  };`,
    tags: ["react", "hooks", "api", "custom-hook"],
    createdAt: "2024-01-15",
    isFavorite: true,
  },
  {
    id: "2",
    title: "SQL Query for User Analytics",
    language: "sql",
    description: "Complex query to get user engagement metrics with performance optimization",
    code: `-- User engagement analytics with 30-day lookback
  WITH user_sessions AS (
    SELECT 
      u.id,
      u.email,
      u.created_at as user_created,
      s.id as session_id,
      s.duration,
      s.page_views,
      s.created_at as session_start,
      LAG(s.created_at) OVER (PARTITION BY u.id ORDER BY s.created_at) as prev_session
    FROM users u
    LEFT JOIN sessions s ON u.id = s.user_id
    WHERE s.created_at >= NOW() - INTERVAL '30 days'
  ),
  engagement_metrics AS (
    SELECT 
      id,
      email,
      user_created,
      COUNT(DISTINCT session_id) as total_sessions,
      AVG(duration) as avg_session_duration,
      SUM(page_views) as total_page_views,
      MAX(session_start) as last_active,
      AVG(EXTRACT(EPOCH FROM (session_start - prev_session))/3600) as avg_hours_between_sessions
    FROM user_sessions
    GROUP BY id, email, user_created
  )
  SELECT 
    *,
    CASE 
      WHEN total_sessions >= 10 THEN 'High'
      WHEN total_sessions >= 5 THEN 'Medium'
      ELSE 'Low'
    END as engagement_level
  FROM engagement_metrics
  ORDER BY total_sessions DESC, avg_session_duration DESC;`,
    tags: ["sql", "analytics", "users", "postgresql", "cte"],
    createdAt: "2024-01-10",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Python Data Validation with Pydantic",
    language: "python",
    description: "Comprehensive Pydantic models for API request/response validation",
    code: `from pydantic import BaseModel, validator, EmailStr, Field
  from typing import Optional, List, Union
  from datetime import datetime
  from enum import Enum
  
  class UserRole(str, Enum):
      ADMIN = "admin"
      USER = "user"
      MODERATOR = "moderator"
  
  class UserCreateRequest(BaseModel):
      email: EmailStr
      name: str = Field(..., min_length=2, max_length=100)
      age: Optional[int] = Field(None, ge=13, le=120)
      role: UserRole = UserRole.USER
      tags: List[str] = Field(default_factory=list, max_items=10)
      
      @validator('name')
      def name_must_not_contain_numbers(cls, v):
          if any(char.isdigit() for char in v):
              raise ValueError('Name cannot contain numbers')
          return v.strip().title()
      
      @validator('tags')
      def tags_must_be_unique(cls, v):
          if len(v) != len(set(v)):
              raise ValueError('Tags must be unique')
          return [tag.lower().strip() for tag in v]
  
  class UserResponse(BaseModel):
      id: int
      email: EmailStr
      name: str
      age: Optional[int]
      role: UserRole
      tags: List[str]
      created_at: datetime
      updated_at: datetime
      is_active: bool = True
      
      class Config:
          from_attributes = True  # For SQLAlchemy compatibility`,
    tags: ["python", "validation", "pydantic", "api", "fastapi"],
    createdAt: "2024-01-08",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Kubernetes Deployment with Health Checks",
    language: "yaml",
    description: "Production-ready Kubernetes deployment with proper health checks and resource limits",
    code: `apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: devtools-hub
    labels:
      app: devtools-hub
      version: v1.0.0
  spec:
    replicas: 3
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 0
    selector:
      matchLabels:
        app: devtools-hub
    template:
      metadata:
        labels:
          app: devtools-hub
          version: v1.0.0
      spec:
        containers:
        - name: devtools-hub
          image: devtools-hub:latest
          ports:
          - containerPort: 3000
            name: http
          env:
          - name: NODE_ENV
            value: "production"
          - name: DATABASE_URL
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
          securityContext:
            runAsNonRoot: true
            runAsUser: 1001
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: devtools-hub-service
  spec:
    selector:
      app: devtools-hub
    ports:
    - port: 80
      targetPort: 3000
      name: http
    type: ClusterIP`,
    tags: ["kubernetes", "k8s", "deployment", "production", "health-checks"],
    createdAt: "2024-01-14",
    isFavorite: true,
  },
  {
    id: "6",
    title: "Go HTTP Server with Middleware",
    language: "go",
    description: "Production-ready Go HTTP server with logging, CORS, and rate limiting",
    code: `package main
  
  import (
      "context"
      "encoding/json"
      "fmt"
      "log"
      "net/http"
      "os"
      "os/signal"
      "syscall"
      "time"
  
      "github.com/gorilla/mux"
      "golang.org/x/time/rate"
  )
  
  type Server struct {
      router *mux.Router
      limiter *rate.Limiter
  }
  
  func NewServer() *Server {
      s := &Server{
          router: mux.NewRouter(),
          limiter: rate.NewLimiter(rate.Every(time.Second), 100), // 100 requests per second
      }
      s.setupRoutes()
      return s
  }
  
  func (s *Server) setupRoutes() {
      // Middleware chain
      s.router.Use(s.loggingMiddleware)
      s.router.Use(s.corsMiddleware)
      s.router.Use(s.rateLimitMiddleware)
  
      // Routes
      api := s.router.PathPrefix("/api/v1").Subrouter()
      api.HandleFunc("/health", s.healthHandler).Methods("GET")
      api.HandleFunc("/snippets", s.getSnippetsHandler).Methods("GET")
      api.HandleFunc("/snippets", s.createSnippetHandler).Methods("POST")
  }
  
  func (s *Server) loggingMiddleware(next http.Handler) http.Handler {
      return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
          start := time.Now()
          next.ServeHTTP(w, r)
          log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
      })
  }
  
  func (s *Server) corsMiddleware(next http.Handler) http.Handler {
      return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
          w.Header().Set("Access-Control-Allow-Origin", "*")
          w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
          w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
          
          if r.Method == "OPTIONS" {
              w.WriteHeader(http.StatusOK)
              return
          }
          
          next.ServeHTTP(w, r)
      })
  }
  
  func (s *Server) rateLimitMiddleware(next http.Handler) http.Handler {
      return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
          if !s.limiter.Allow() {
              http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
              return
          }
          next.ServeHTTP(w, r)
      })
  }
  
  func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
      response := map[string]interface{}{
          "status": "healthy",
          "timestamp": time.Now().Unix(),
          "version": "1.0.0",
      }
      
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(response)
  }
  
  func main() {
      server := NewServer()
      
      srv := &http.Server{
          Addr:         ":8080",
          Handler:      server.router,
          ReadTimeout:  15 * time.Second,
          WriteTimeout: 15 * time.Second,
          IdleTimeout:  60 * time.Second,
      }
  
      // Graceful shutdown
      go func() {
          sigint := make(chan os.Signal, 1)
          signal.Notify(sigint, os.Interrupt, syscall.SIGTERM)
          <-sigint
  
          log.Println("Shutting down server...")
          ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
          defer cancel()
          
          if err := srv.Shutdown(ctx); err != nil {
              log.Printf("Server shutdown error: %v", err)
          }
      }()
  
      log.Printf("Server starting on :8080")
      if err := srv.ListenAndServe(); err != http.ErrServerClosed {
          log.Fatalf("Server failed to start: %v", err)
      }
  }`,
    tags: ["go", "http-server", "middleware", "production", "api"],
    createdAt: "2024-01-11",
    isFavorite: false,
  },
];