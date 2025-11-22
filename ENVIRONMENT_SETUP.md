# Environment Configuration Template

## Backend/.env Template

```bash
# PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/arogyayatra

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Backend Configuration
NODE_ENV=development
PORT=5000

# MCP Server Integration
MCP_SERVER_URL=http://localhost:3001

# Optional: Logging
LOG_LEVEL=debug

# Optional: CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Optional: API Rate Limiting
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=100
```

## MCP-Server/.env Template

```bash
# Ollama LLM Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# MCP Server Configuration
MCP_HTTP_PORT=3001
NODE_ENV=development

# Database (if using database in MCP)
DATABASE_URL=postgresql://postgres:password@localhost:5432/arogyayatra

# Backend Configuration
BACKEND_BASE_URL=http://localhost:5000
BACKEND_API_KEY=your_api_key_here

# Optional: Logging
LOG_LEVEL=debug

# Optional: Ollama Performance
OLLAMA_TIMEOUT_MS=300000
OLLAMA_TEMPERATURE=0.2
OLLAMA_TOP_P=0.9
```

## Optional Configurations

### Advanced Ollama Settings

```bash
# In MCP-Server/.env

# Model Selection (other options: mistral, neural-chat, etc.)
OLLAMA_MODEL=mistral  # Faster than llama2

# Generation Parameters
OLLAMA_TEMPERATURE=0.2  # Lower = more consistent (0.0-1.0)
OLLAMA_TOP_P=0.9        # Nucleus sampling (0.0-1.0)
OLLAMA_TOP_K=40         # Top-k sampling

# Performance
OLLAMA_TIMEOUT_MS=300000  # 5 minutes
OLLAMA_NUM_CTX=2048       # Context window size
OLLAMA_NUM_GPU=1          # GPU layers
```

### Database Backup Configuration

```bash
# In Backend/.env

# Backup Settings
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
BACKUP_RETENTION_DAYS=30

# Notification
BACKUP_NOTIFY_EMAIL=admin@hospital.com
```

### Production Hardening

```bash
# Production Backend/.env

NODE_ENV=production
LOG_LEVEL=error
DEBUG=false

# Security
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_TIMEOUT_MS=3600000

# HTTPS
HTTPS_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/cert.pem
SSL_KEY_PATH=/etc/ssl/private/key.pem
```

## Verification Script

```bash
#!/bin/bash
# verify-env.sh - Verify all required environment variables

echo "Checking Backend Configuration..."
check_var() {
  if [ -z "${!1}" ]; then
    echo "❌ $1 is not set"
    return 1
  else
    echo "✅ $1 is set"
    return 0
  fi
}

# Backend vars
check_var "DATABASE_URL"
check_var "JWT_SECRET"
check_var "MCP_SERVER_URL"

echo ""
echo "Checking MCP Server Configuration..."
check_var "OLLAMA_API_URL"
check_var "OLLAMA_MODEL"
check_var "MCP_HTTP_PORT"

echo ""
echo "Checking Ollama..."
curl -s http://localhost:11434/api/tags > /dev/null && echo "✅ Ollama is running" || echo "❌ Ollama is not running"

echo ""
echo "Configuration check complete!"
```

## Docker Compose Template (Optional)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: arogyayatra
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    environment:
      - OLLAMA_HOST=0.0.0.0:11434
    volumes:
      - ollama_data:/root/.ollama

  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/arogyayatra
      - MCP_SERVER_URL=http://mcp-server:3001
      - NODE_ENV=development
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - ollama
    links:
      - postgres
      - mcp-server

  mcp-server:
    build:
      context: ./MCP-Server
      dockerfile: Dockerfile
    environment:
      - OLLAMA_API_URL=http://ollama:11434
      - OLLAMA_MODEL=llama2
      - MCP_HTTP_PORT=3001
    ports:
      - "3001:3001"
    depends_on:
      - ollama
    links:
      - ollama

volumes:
  postgres_data:
  ollama_data:
```

## Environment Variable Reference

### Backend Required Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/db` | Database connection |
| `JWT_SECRET` | `secret_key_123` | JWT token signing |
| `MCP_SERVER_URL` | `http://localhost:3001` | MCP server address |

### MCP Server Required Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `OLLAMA_API_URL` | `http://localhost:11434` | Ollama service URL |
| `OLLAMA_MODEL` | `llama2` | Model to use |
| `MCP_HTTP_PORT` | `3001` | Port for MCP server |

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `development` | Environment type |
| `LOG_LEVEL` | `info` | Logging level |
| `OLLAMA_TEMPERATURE` | `0.2` | Generation randomness |
| `OLLAMA_TIMEOUT_MS` | `300000` | Request timeout |

## Setup Commands

### Quick Setup

```bash
# Backend
cp Backend/.env.example Backend/.env
# Edit Backend/.env with your values
cd Backend && npm install

# MCP Server
cp MCP-Server/.env.example MCP-Server/.env
# Edit MCP-Server/.env with your values
cd MCP-Server && npm install

# Start services
# Terminal 1
ollama serve

# Terminal 2
cd Backend && npm run dev

# Terminal 3
cd MCP-Server && npm run dev
```

### Production Setup

```bash
# 1. Create .env files with production values
# 2. Set strict permissions
chmod 600 Backend/.env
chmod 600 MCP-Server/.env

# 3. Build Docker images (if using Docker)
docker-compose build

# 4. Start services
docker-compose up -d

# 5. Verify
docker-compose ps
curl http://localhost:3001/health
```

## Troubleshooting Environment Issues

### "Cannot find module" Error
```bash
# Issue: Dependencies not installed
# Solution:
npm install
npm install express-validator  # For Backend
```

### "Connection refused" Error
```bash
# Issue: Service not running
# Solution:
# Check if all 3 services are running:
# - ollama serve
# - npm run dev (Backend)
# - npm run dev (MCP-Server)
```

### "Invalid environment variable" Error
```bash
# Issue: .env file not loaded
# Solution:
# Ensure .env file is in correct directory
# Restart the service
# Check file is named exactly ".env" (not ".env.example")
```

## Security Best Practices

✅ Never commit .env files to git
✅ Use strong JWT_SECRET in production (32+ characters)
✅ Use different secrets for dev and production
✅ Set proper database permissions
✅ Use HTTPS in production
✅ Rotate secrets regularly
✅ Don't log sensitive data
✅ Use environment-specific configurations

## Verification Checklist

After setting up environment variables:

- [ ] Backend can connect to PostgreSQL
- [ ] MCP Server can connect to Ollama
- [ ] Backend can reach MCP Server at configured URL
- [ ] All services start without errors
- [ ] Health checks return 200 OK
- [ ] No sensitive data in logs
- [ ] File permissions are secure
- [ ] .env file is gitignored

## Getting Help

If you encounter configuration issues:

1. **Check the service logs** - Look for specific error messages
2. **Verify connectivity** - Use curl to test endpoints
3. **Review documentation** - See OLLAMA_INTEGRATION_GUIDE.md
4. **Test health endpoints**:
   ```bash
   curl http://localhost:3001/health    # MCP Server
   curl http://localhost:5000/health    # Backend
   curl http://localhost:11434/api/tags # Ollama
   ```
