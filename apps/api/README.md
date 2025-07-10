# Agent Flow API

A powerful NestJS-based API for managing AI agents and executing complex tasks through a multi-agent system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TypeScript knowledge

### Installation

1. **Install dependencies** (from project root):
   ```bash
   npm install
   ```

2. **Start the API server**:
   ```bash
   # Development mode
   npx nx serve api
   
   # Or using npm script (if configured)
   npm run start:api
   ```

3. **Access the application**:
   - **API Server**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/api/docs
   - **WebSocket**: ws://localhost:3000/agents

## 📚 API Documentation

The API includes comprehensive Swagger documentation available at `/api/docs` when the server is running.

### Key Endpoints

#### Agent Management
- `GET /api/v1/agents` - Get all available agents
- `GET /api/v1/agents/{id}` - Get specific agent information
- `GET /api/v1/agents/health` - System health check
- `GET /api/v1/agents/metrics/{agentId}` - Get agent performance metrics

#### Task Execution
- `POST /api/v1/agents/tasks` - Execute a single task
- `GET /api/v1/agents/tasks/active` - Get active tasks
- `GET /api/v1/agents/tasks/{taskId}/status` - Check task status
- `DELETE /api/v1/agents/tasks/{taskId}` - Cancel a task

#### Workflow Management
- `POST /api/v1/agents/workflows` - Execute a complex workflow
- `GET /api/v1/agents/workflows/{workflowId}/status` - Check workflow status

#### Capabilities
- `GET /api/v1/agents/capabilities/{capability}` - Find agents by capability
- `GET /api/v1/agents/examples/{taskType}` - Get task examples
- `GET /api/v1/agents/task-types` - Get available task types

## 🤖 Available Agents

### Mary - Project Management Specialist
- **Expertise**: Project planning, task management, resource allocation
- **Tasks**: `project-planning`, `task-management`, `resource-allocation`, `progress-tracking`

### John - Research & Information Specialist  
- **Expertise**: Research, fact-checking, competitive analysis
- **Tasks**: `research`, `fact-checking`, `market-research`, `competitive-analysis`

### Fred - Creative Content Specialist
- **Expertise**: Creative writing, design concepts, marketing
- **Tasks**: `content-creation`, `creative-writing`, `design-concepts`, `marketing`

### Jane - Technical Implementation Specialist
- **Expertise**: Software development, system architecture, problem-solving
- **Tasks**: `software-development`, `system-architecture`, `code-review`, `testing`

### Sarah - Data Analysis Specialist
- **Expertise**: Data analysis, statistical modeling, business intelligence
- **Tasks**: `data-analysis`, `statistical-modeling`, `predictive-analytics`

### Bob - Customer Relations Specialist
- **Expertise**: Customer support, relationship management, communication
- **Tasks**: `customer-support`, `relationship-management`, `feedback-analysis`

## 💡 Usage Examples

### 1. Execute a Simple Task

```bash
curl -X POST "http://localhost:3000/api/v1/agents/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "software-development",
    "description": "Create a REST API endpoint for user authentication",
    "priority": "high",
    "agentId": "jane",
    "requirements": {
      "technical": {
        "framework": "NestJS",
        "database": "PostgreSQL"
      },
      "functional": [
        "User login endpoint",
        "JWT token generation",
        "Password validation"
      ]
    }
  }'
```

### 2. Execute a Complex Workflow

```bash
curl -X POST "http://localhost:3000/api/v1/agents/workflows" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "website-project",
    "name": "Website Development Project",
    "description": "Complete website development from planning to deployment",
    "steps": [
      {
        "id": "planning",
        "name": "Project Planning",
        "taskType": "project-planning",
        "description": "Create comprehensive project plan",
        "agentId": "mary"
      },
      {
        "id": "development",
        "name": "Development",
        "taskType": "software-development",
        "description": "Implement the website",
        "agentId": "jane",
        "dependencies": [
          {
            "stepId": "planning",
            "type": "blocking"
          }
        ]
      }
    ]
  }'
```

### 3. Check Agent Status

```bash
# Get all agents
curl "http://localhost:3000/api/v1/agents"

# Get specific agent
curl "http://localhost:3000/api/v1/agents/jane"

# Get agent metrics
curl "http://localhost:3000/api/v1/agents/metrics/jane"
```

## 🔌 WebSocket Integration

Connect to the WebSocket for real-time updates:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/agents');

// Listen for task updates
socket.on('taskStarted', (data) => {
  console.log('Task started:', data);
});

socket.on('taskCompleted', (data) => {
  console.log('Task completed:', data);
});

socket.on('taskFailed', (data) => {
  console.log('Task failed:', data);
});

// Execute task via WebSocket
socket.emit('executeTask', {
  type: 'software-development',
  description: 'Create a new API endpoint',
  clientTaskId: 'my-task-123'
});

// Subscribe to agent status updates
socket.emit('subscribeAgentStatus', { agentId: 'jane' });

socket.on('agentStatusUpdate', (data) => {
  console.log('Agent status update:', data);
});
```

## 🏗️ Architecture

### Project Structure

```
apps/api/src/
├── agents/                 # Agent system module
│   ├── dto/               # Data Transfer Objects
│   ├── agents.controller.ts
│   ├── agents.service.ts
│   ├── agents.gateway.ts  # WebSocket gateway
│   └── agents.module.ts
├── app/                   # Main application module
└── main.ts               # Application bootstrap
```

### Key Components

- **AgentsController**: HTTP endpoints for agent operations
- **AgentsService**: Core business logic for agent management
- **AgentsGateway**: WebSocket gateway for real-time communication
- **DTOs**: Type-safe data validation and transformation

## 🔧 Configuration

### Environment Variables

```bash
# Server configuration
PORT=3000
NODE_ENV=development

# Agent configuration (optional)
AGENT_TIMEOUT=300000
MAX_CONCURRENT_TASKS=10
ENABLE_METRICS=true
```

### Agent Settings

Agents are configured through the `@agent-flow/agents` library. See the library documentation for detailed configuration options.

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npx nx test api

# E2E tests
npx nx e2e api-e2e

# Test coverage
npx nx test api --coverage
```

### Manual Testing

1. **Health Check**:
   ```bash
   curl "http://localhost:3000/api/v1/agents/health"
   ```

2. **List Agents**:
   ```bash
   curl "http://localhost:3000/api/v1/agents"
   ```

3. **Execute Simple Task**:
   ```bash
   curl -X POST "http://localhost:3000/api/v1/agents/tasks" \
     -H "Content-Type: application/json" \
     -d '{"type": "research", "description": "Research AI trends"}'
   ```

## 📊 Monitoring

### Health Checks

The API provides comprehensive health checks:

- **System Health**: `/api/v1/agents/health`
- **Agent Status**: Individual agent health and availability
- **Resource Usage**: Memory and CPU utilization
- **Task Metrics**: Success rates and performance data

### Metrics

Agent performance metrics include:

- Task completion rates
- Average response times
- Error rates and types
- Resource utilization
- Workload distribution

## 🚨 Error Handling

### Common Error Responses

```json
{
  "success": false,
  "error": "Agent 'invalid-agent' not found",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req-123456"
}
```

### Error Codes

- `400` - Bad Request (invalid task parameters)
- `404` - Not Found (agent or task not found)
- `409` - Conflict (agent busy or unavailable)
- `500` - Internal Server Error (system error)
- `503` - Service Unavailable (system overloaded)

## 🔒 Security

### Best Practices

- Input validation using class-validator
- CORS configuration for frontend integration
- Request rate limiting (recommended for production)
- Authentication/authorization (implement as needed)

### Production Considerations

- Enable HTTPS
- Configure proper CORS origins
- Implement authentication middleware
- Set up monitoring and logging
- Configure rate limiting
- Use environment variables for sensitive data

## 🚀 Deployment

### Development

```bash
npx nx serve api
```

### Production Build

```bash
# Build the application
npx nx build api

# Start production server
node dist/apps/api/main.js
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/apps/api ./
EXPOSE 3000
CMD ["node", "main.js"]
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include comprehensive tests
4. Update documentation
5. Use conventional commit messages

## 📝 License

MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the API documentation at `/api/docs`
2. Review the agent library documentation
3. Check the examples in `/examples`
4. Create an issue in the repository

---

**Happy coding with Agent Flow! 🚀**