# Environment Configuration Examples

## Backend/.env

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/arogya_yatra

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# Server
PORT=5000
NODE_ENV=development

# MCP Server
MCP_SERVER_URL=http://localhost:3001

# Ollama
OLLAMA_API_URL=http://localhost:11434

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## MCP-Server/.env

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/arogya_yatra

# Backend API
BACKEND_BASE_URL=http://localhost:5000
BACKEND_API_KEY=your_backend_api_key

# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Model Parameters
OLLAMA_TEMPERATURE=0.3
OLLAMA_TIMEOUT=30000

# Logging
LOG_LEVEL=debug
```

## FrontEnd/.env.local

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Features
NEXT_PUBLIC_ENABLE_AI_NOTES=true

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

---

## Production Deployment

### Backend/.env (Production)

```env
DATABASE_URL=postgresql://prod_user:secure_password@prod-db.rds.amazonaws.com:5432/arogya_yatra_prod

JWT_SECRET=generate_secure_random_string_min_32_chars

PORT=5000
NODE_ENV=production

MCP_SERVER_URL=https://mcp-server.your-domain.com

OLLAMA_API_URL=http://internal-ollama:11434

CORS_ORIGIN=https://app.your-domain.com

# SSL/TLS
HTTPS=true
SSL_CERT_PATH=/etc/ssl/certs/cert.pem
SSL_KEY_PATH=/etc/ssl/private/key.pem
```

### MCP-Server/.env (Production)

```env
DATABASE_URL=postgresql://prod_user:secure_password@prod-db.rds.amazonaws.com:5432/arogya_yatra_prod

BACKEND_BASE_URL=https://api.your-domain.com
BACKEND_API_KEY=secure_api_key_change_regularly

# Use a larger, more capable model in production
OLLAMA_API_URL=http://ollama-service:11434
OLLAMA_MODEL=neural-chat

OLLAMA_TEMPERATURE=0.25
OLLAMA_TIMEOUT=30000

LOG_LEVEL=info
```

### FrontEnd/.env.production

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com

NEXT_PUBLIC_ENABLE_AI_NOTES=true

# Security
NEXT_PUBLIC_ENABLE_CSP=true
NEXT_PUBLIC_ENABLE_RATE_LIMITING=true

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn
```

---

## Docker Compose Example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: arogya_yatra
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  ollama:
    image: ollama/ollama:latest
    environment:
      OLLAMA_HOST: 0.0.0.0:11434
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"
    command: ollama serve

  mcp-server:
    build:
      context: ./MCP-Server
    environment:
      DATABASE_URL: postgresql://postgres:secure_password@postgres:5432/arogya_yatra
      BACKEND_BASE_URL: http://backend:5000
      OLLAMA_API_URL: http://ollama:11434
      OLLAMA_MODEL: llama2
    depends_on:
      - postgres
      - ollama
    ports:
      - "3001:3001"

  backend:
    build:
      context: ./Backend
    environment:
      DATABASE_URL: postgresql://postgres:secure_password@postgres:5432/arogya_yatra
      JWT_SECRET: your_jwt_secret
      MCP_SERVER_URL: http://mcp-server:3001
      PORT: 5000
    depends_on:
      - postgres
      - mcp-server
    ports:
      - "5000:5000"

  frontend:
    build:
      context: ./FrontEnd
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000
    depends_on:
      - backend
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  ollama_data:
```

---

## Kubernetes Deployment Example

### ConfigMap (arogya-config.yaml)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: arogya-config
  namespace: default
data:
  BACKEND_BASE_URL: "https://api.your-domain.com"
  OLLAMA_MODEL: "llama2"
  OLLAMA_TEMPERATURE: "0.25"
  LOG_LEVEL: "info"
```

### Secret (arogya-secrets.yaml)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: arogya-secrets
  namespace: default
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@postgres:5432/arogya_yatra"
  JWT_SECRET: "your_secure_jwt_secret"
  BACKEND_API_KEY: "your_api_key"
```

### Deployment (backend.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arogya-backend
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: arogya-backend
  template:
    metadata:
      labels:
        app: arogya-backend
    spec:
      containers:
      - name: backend
        image: arogya/backend:latest
        ports:
        - containerPort: 5000
        envFrom:
        - configMapRef:
            name: arogya-config
        - secretRef:
            name: arogya-secrets
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
```

---

## Development vs Production Checklist

| Item | Dev | Prod |
|------|-----|------|
| Database | Local SQLite/PG | RDS/Cloud DB |
| Ollama | Local instance | GPU-accelerated server |
| API Rate Limiting | ❌ | ✅ |
| HTTPS | ❌ | ✅ |
| JWT Expiry | 7 days | 1 hour |
| CORS Origins | localhost:* | specific domains |
| Error Logging | Console | CloudWatch/ELK |
| Model Size | small (llama2) | large (neural-chat) |
| CPU/Memory | Minimal | High (Ollama needs 8GB+) |
| Backup | Manual | Automated daily |
| Monitoring | None | DataDog/New Relic |

---

## Monitoring Configuration

### Prometheus Metrics

```env
# Backend/.env
ENABLE_METRICS=true
METRICS_PORT=9090
```

### Logging Setup

```javascript
// Backend - Add to server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## Security Hardening Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Set strong JWT secret (32+ characters)
- [ ] Enable CORS for specific domains only
- [ ] Add rate limiting to API endpoints
- [ ] Enable database encryption
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable audit logging
- [ ] Set up regular backups
- [ ] Monitor for suspicious activities
- [ ] Keep dependencies updated
- [ ] Enable HTTPS only (no HTTP)
- [ ] Use secure cookies (HttpOnly, Secure, SameSite)
- [ ] Implement input validation/sanitization
- [ ] Add request/response logging

---

## Performance Tuning

### Database Connection Pool

```javascript
// Backend/config/db.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Ollama Optimization

```env
# MCP-Server/.env
OLLAMA_KEEP_ALIVE=5m
OLLAMA_MEMORY=16gb
OLLAMA_THREADS=8
```

### Frontend Caching

```javascript
// FrontEnd - Add cache headers
next.config.js
headers: {
  source: '/api/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'private, max-age=60'
    }
  ]
}
```

---

Generated: November 22, 2025
