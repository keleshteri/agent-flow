# Agent Flow - Usage Guide

This guide explains how to use the agents library and integrate it with the NestJS API.

## Overview

The agents library (`libs/agents`) provides specialized AI agents that can be integrated into your NestJS API (`apps/api`) to handle various tasks like data analysis, research, content creation, and technical implementation.

## Architecture

```
Agent Flow Architecture:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   NestJS API    │    │  Agents Library │
│   (React)       │◄──►│   (apps/api)    │◄──►│  (libs/agents)  │
│                 │    │                 │    │                 │
│ - Agent UI      │    │ - Agent Module  │    │ - Mary (Data)   │
│ - Task Forms    │    │ - Controllers   │    │ - John (Research)│
│ - Results View  │    │ - Services      │    │ - Fred (Creative)│
│                 │    │ - WebSockets    │    │ - Jane (Tech)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Step 1: Install Dependencies

First, ensure you have the necessary dependencies in your API:

```bash
# Navigate to the project root
cd d:\Development\Projects\Products\agent-flow

# Install dependencies
npm install

# Install additional dependencies for agents
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

## Step 2: Create Agent Module in NestJS API

Create the agent module structure in your NestJS API:

```
apps/api/src/
├── app/
├── agents/                    # New agent module
│   ├── agents.module.ts       # Main agents module
│   ├── agents.controller.ts   # REST API endpoints
│   ├── agents.service.ts      # Business logic
│   ├── agents.gateway.ts      # WebSocket gateway
│   └── dto/                   # Data transfer objects
│       ├── create-task.dto.ts
│       ├── task-result.dto.ts
│       └── agent-status.dto.ts
└── main.ts
```

## Step 3: Basic Usage Examples

### 3.1 Simple Agent Task Execution

```typescript
import { AgentFactory, TaskType } from '@agent-flow/agents';

// Create a data analysis agent
const mary = AgentFactory.createAgent('mary');

// Execute a data analysis task
const result = await mary.executeTask({
  type: TaskType.DATA_ANALYSIS,
  description: 'Analyze sales data for Q4 trends',
  data: {
    sales: [
      { month: 'Oct', revenue: 100000, customers: 500 },
      { month: 'Nov', revenue: 120000, customers: 600 },
      { month: 'Dec', revenue: 150000, customers: 750 }
    ]
  },
  requirements: {
    analysisType: 'trend_analysis',
    timeframe: 'quarterly',
    metrics: ['revenue', 'growth_rate', 'customer_acquisition']
  }
});

console.log('Analysis Results:', result.data);
console.log('Insights:', result.insights);
```

### 3.2 Multi-Agent Collaboration

```typescript
import { MasterAssistant, AgentRegistry, AgentFactory } from '@agent-flow/agents';

// Initialize the master assistant
const master = new MasterAssistant();

// Create and register agents
const registry = new AgentRegistry();
registry.registerAgent('mary', AgentFactory.createAgent('mary'));
registry.registerAgent('john', AgentFactory.createAgent('john'));
registry.registerAgent('fred', AgentFactory.createAgent('fred'));
registry.registerAgent('jane', AgentFactory.createAgent('jane'));

// Execute complex workflow
const workflow = {
  description: 'Create a comprehensive market analysis report',
  steps: [
    {
      agent: 'john',
      task: TaskType.RESEARCH,
      description: 'Research market trends and competitors',
      dependencies: []
    },
    {
      agent: 'mary',
      task: TaskType.DATA_ANALYSIS,
      description: 'Analyze market data and trends',
      dependencies: ['research']
    },
    {
      agent: 'fred',
      task: TaskType.CONTENT_CREATION,
      description: 'Create professional report with recommendations',
      dependencies: ['research', 'analysis']
    }
  ]
};

const result = await master.executeWorkflow(workflow);
```

## Step 4: NestJS Integration

### 4.1 Agents Service

```typescript
// apps/api/src/agents/agents.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { 
  AgentFactory, 
  AgentRegistry, 
  MasterAssistant,
  TaskType,
  ITask,
  ITaskResult
} from '@agent-flow/agents';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);
  private readonly registry = new AgentRegistry();
  private readonly master = new MasterAssistant();

  constructor() {
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  private initializeAgents(): void {
    try {
      // Register all specialized agents
      this.registry.registerAgent('mary', AgentFactory.createAgent('mary'));
      this.registry.registerAgent('john', AgentFactory.createAgent('john'));
      this.registry.registerAgent('fred', AgentFactory.createAgent('fred'));
      this.registry.registerAgent('jane', AgentFactory.createAgent('jane'));
      
      this.logger.log('All agents initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize agents', error);
      throw error;
    }
  }

  /**
   * Execute a single task with the appropriate agent
   */
  async executeTask(task: ITask): Promise<ITaskResult> {
    const agent = this.getAgentForTask(task.type);
    if (!agent) {
      throw new Error(`No agent available for task type: ${task.type}`);
    }

    return await agent.executeTask(task);
  }

  /**
   * Execute a complex workflow with multiple agents
   */
  async executeWorkflow(workflow: any): Promise<any> {
    return await this.master.executeWorkflow(workflow);
  }

  /**
   * Get all available agents
   */
  getAvailableAgents(): string[] {
    return Array.from(this.registry.getAllAgents().keys());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string) {
    return this.registry.getAgent(agentId);
  }

  /**
   * Get agent performance metrics
   */
  async getAgentMetrics(agentId: string) {
    const agent = this.registry.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    return await agent.getPerformanceMetrics();
  }

  /**
   * Get the best agent for a specific task type
   */
  private getAgentForTask(taskType: TaskType) {
    const taskAgentMap = {
      [TaskType.DATA_ANALYSIS]: 'mary',
      [TaskType.DATA_VISUALIZATION]: 'mary',
      [TaskType.STATISTICAL_MODELING]: 'mary',
      [TaskType.RESEARCH]: 'john',
      [TaskType.FACT_CHECKING]: 'john',
      [TaskType.INFORMATION_SYNTHESIS]: 'john',
      [TaskType.CONTENT_CREATION]: 'fred',
      [TaskType.CREATIVE_WRITING]: 'fred',
      [TaskType.DESIGN_CONCEPTS]: 'fred',
      [TaskType.SOFTWARE_DEVELOPMENT]: 'jane',
      [TaskType.SYSTEM_ARCHITECTURE]: 'jane',
      [TaskType.TECHNICAL_PROBLEM_SOLVING]: 'jane'
    };

    const agentId = taskAgentMap[taskType];
    return agentId ? this.registry.getAgent(agentId) : null;
  }
}
```

### 4.2 Agents Controller

```typescript
// apps/api/src/agents/agents.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  /**
   * Get all available agents
   */
  @Get()
  getAgents() {
    return {
      agents: this.agentsService.getAvailableAgents(),
      message: 'Available agents retrieved successfully'
    };
  }

  /**
   * Get specific agent information
   */
  @Get(':agentId')
  async getAgent(@Param('agentId') agentId: string) {
    try {
      const agent = this.agentsService.getAgent(agentId);
      if (!agent) {
        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
      }

      return {
        id: agentId,
        specialization: agent.getSpecialization(),
        role: agent.getRole(),
        status: agent.getStatus(),
        capabilities: agent.getCapabilities()
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get agent information',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Execute a task with an agent
   */
  @Post('execute')
  async executeTask(@Body() createTaskDto: CreateTaskDto) {
    try {
      const result = await this.agentsService.executeTask(createTaskDto);
      return {
        success: true,
        result,
        message: 'Task executed successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to execute task',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Execute a complex workflow
   */
  @Post('workflow')
  async executeWorkflow(@Body() workflow: any) {
    try {
      const result = await this.agentsService.executeWorkflow(workflow);
      return {
        success: true,
        result,
        message: 'Workflow executed successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to execute workflow',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get agent performance metrics
   */
  @Get(':agentId/metrics')
  async getAgentMetrics(@Param('agentId') agentId: string) {
    try {
      const metrics = await this.agentsService.getAgentMetrics(agentId);
      return {
        agentId,
        metrics,
        message: 'Agent metrics retrieved successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get agent metrics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

## Step 5: WebSocket Integration (Real-time Updates)

```typescript
// apps/api/src/agents/agents.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AgentsService } from './agents.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AgentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly agentsService: AgentsService) {}

  /**
   * Handle task execution with real-time updates
   */
  @SubscribeMessage('executeTask')
  async handleTaskExecution(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    try {
      // Notify task started
      client.emit('taskStarted', { taskId: data.id, status: 'started' });

      // Execute task
      const result = await this.agentsService.executeTask(data);

      // Notify task completed
      client.emit('taskCompleted', { 
        taskId: data.id, 
        status: 'completed', 
        result 
      });

      return result;
    } catch (error) {
      // Notify task failed
      client.emit('taskFailed', { 
        taskId: data.id, 
        status: 'failed', 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Handle workflow execution with progress updates
   */
  @SubscribeMessage('executeWorkflow')
  async handleWorkflowExecution(
    @MessageBody() workflow: any,
    @ConnectedSocket() client: Socket
  ) {
    try {
      // Notify workflow started
      client.emit('workflowStarted', { 
        workflowId: workflow.id, 
        status: 'started' 
      });

      // Execute workflow with progress updates
      const result = await this.agentsService.executeWorkflow(workflow);

      // Notify workflow completed
      client.emit('workflowCompleted', { 
        workflowId: workflow.id, 
        status: 'completed', 
        result 
      });

      return result;
    } catch (error) {
      client.emit('workflowFailed', { 
        workflowId: workflow.id, 
        status: 'failed', 
        error: error.message 
      });
      throw error;
    }
  }
}
```

## Step 6: Running the Application

### 6.1 Development Mode

```bash
# Start the API server
npm run serve api

# Start the frontend (if needed)
npm run serve web
```

### 6.2 Testing the Agents

```bash
# Test agent availability
curl http://localhost:3000/agents

# Test task execution
curl -X POST http://localhost:3000/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "type": "data_analysis",
    "description": "Analyze sales data",
    "data": {
      "sales": [100, 120, 150]
    }
  }'
```

## Step 7: Frontend Integration

```typescript
// Frontend React component example
import { useState } from 'react';
import io from 'socket.io-client';

const AgentDashboard = () => {
  const [socket] = useState(() => io('http://localhost:3000'));
  const [taskResult, setTaskResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeTask = async () => {
    setLoading(true);
    
    // Listen for task updates
    socket.on('taskCompleted', (data) => {
      setTaskResult(data.result);
      setLoading(false);
    });

    // Execute task
    socket.emit('executeTask', {
      id: 'task-1',
      type: 'data_analysis',
      description: 'Analyze user engagement data',
      data: { /* your data */ }
    });
  };

  return (
    <div>
      <button onClick={executeTask} disabled={loading}>
        {loading ? 'Processing...' : 'Analyze Data'}
      </button>
      {taskResult && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(taskResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

## Best Practices

1. **Error Handling**: Always implement proper error handling for agent tasks
2. **Monitoring**: Monitor agent performance and resource usage
3. **Caching**: Implement caching for frequently requested data
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Authentication**: Secure your agent endpoints with proper authentication
6. **Logging**: Implement comprehensive logging for debugging and monitoring

## Next Steps

1. Create the NestJS agent module files
2. Implement the DTOs for type safety
3. Add authentication and authorization
4. Implement caching and rate limiting
5. Add comprehensive testing
6. Deploy to production environment

This guide provides a complete foundation for integrating and using the agents library in your NestJS application.