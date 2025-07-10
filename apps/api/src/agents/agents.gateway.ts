import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { WorkflowDto } from './dto/workflow.dto';

/**
 * WebSocket Gateway for real-time agent communication
 * Provides real-time updates for task execution and agent status
 */
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/agents',
})
export class AgentsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AgentsGateway.name);
  private connectedClients = new Map<string, Socket>();
  private clientSubscriptions = new Map<string, Set<string>>();

  constructor(private readonly agentsService: AgentsService) {}

  /**
   * Initialize WebSocket gateway
   */
  afterInit(server: Server) {
    this.logger.log('Agents WebSocket Gateway initialized');
  }

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    this.clientSubscriptions.set(client.id, new Set());

    // Send initial agent status
    this.sendAgentStatus(client);
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    this.clientSubscriptions.delete(client.id);
  }

  /**
   * Handle task execution with real-time updates
   */
  @SubscribeMessage('executeTask')
  async handleTaskExecution(
    @MessageBody() data: CreateTaskDto & { clientTaskId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientTaskId = data.clientTaskId || `client_task_${Date.now()}`;
    
    try {
      this.logger.log(`Executing task via WebSocket: ${data.type}`);
      
      // Notify task started
      client.emit('taskStarted', {
        clientTaskId,
        taskType: data.type,
        status: 'started',
        timestamp: new Date().toISOString()
      });

      // Subscribe client to task updates
      const subscriptions = this.clientSubscriptions.get(client.id);
      if (subscriptions) {
        subscriptions.add(clientTaskId);
      }

      // Execute task
      const result = await this.agentsService.executeTask(data);

      // Notify task completed
      client.emit('taskCompleted', {
        clientTaskId,
        taskType: data.type,
        status: 'completed',
        result,
        timestamp: new Date().toISOString()
      });

      // Unsubscribe from task updates
      if (subscriptions) {
        subscriptions.delete(clientTaskId);
      }

      return {
        success: true,
        clientTaskId,
        result
      };
    } catch (error) {
      this.logger.error(`Task execution failed via WebSocket:`, error);
      
      // Notify task failed
      client.emit('taskFailed', {
        clientTaskId,
        taskType: data.type,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Unsubscribe from task updates
      const subscriptions = this.clientSubscriptions.get(client.id);
      if (subscriptions) {
        subscriptions.delete(clientTaskId);
      }

      return {
        success: false,
        clientTaskId,
        error: error.message
      };
    }
  }

  /**
   * Handle workflow execution with progress updates
   */
  @SubscribeMessage('executeWorkflow')
  async handleWorkflowExecution(
    @MessageBody() data: WorkflowDto & { clientWorkflowId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientWorkflowId = data.clientWorkflowId || `client_workflow_${Date.now()}`;
    
    try {
      this.logger.log(`Executing workflow via WebSocket: ${data.description}`);
      
      // Notify workflow started
      client.emit('workflowStarted', {
        clientWorkflowId,
        description: data.description,
        status: 'started',
        totalSteps: data.steps?.length || 0,
        timestamp: new Date().toISOString()
      });

      // Subscribe client to workflow updates
      const subscriptions = this.clientSubscriptions.get(client.id);
      if (subscriptions) {
        subscriptions.add(clientWorkflowId);
      }

      // Execute workflow with progress updates
      const result = await this.executeWorkflowWithProgress(data, client, clientWorkflowId);

      // Notify workflow completed
      client.emit('workflowCompleted', {
        clientWorkflowId,
        description: data.description,
        status: 'completed',
        result,
        timestamp: new Date().toISOString()
      });

      // Unsubscribe from workflow updates
      if (subscriptions) {
        subscriptions.delete(clientWorkflowId);
      }

      return {
        success: true,
        clientWorkflowId,
        result
      };
    } catch (error) {
      this.logger.error(`Workflow execution failed via WebSocket:`, error);
      
      // Notify workflow failed
      client.emit('workflowFailed', {
        clientWorkflowId,
        description: data.description,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Unsubscribe from workflow updates
      const subscriptions = this.clientSubscriptions.get(client.id);
      if (subscriptions) {
        subscriptions.delete(clientWorkflowId);
      }

      return {
        success: false,
        clientWorkflowId,
        error: error.message
      };
    }
  }

  /**
   * Subscribe to agent status updates
   */
  @SubscribeMessage('subscribeAgentStatus')
  handleSubscribeAgentStatus(
    @MessageBody() data: { agentId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const agentId = data.agentId || 'all';
    
    this.logger.log(`Client ${client.id} subscribed to agent status: ${agentId}`);
    
    // Add subscription
    const subscriptions = this.clientSubscriptions.get(client.id);
    if (subscriptions) {
      subscriptions.add(`agent_status_${agentId}`);
    }

    // Send current status
    this.sendAgentStatus(client, agentId);

    return {
      success: true,
      message: `Subscribed to agent status: ${agentId}`
    };
  }

  /**
   * Unsubscribe from agent status updates
   */
  @SubscribeMessage('unsubscribeAgentStatus')
  handleUnsubscribeAgentStatus(
    @MessageBody() data: { agentId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const agentId = data.agentId || 'all';
    
    this.logger.log(`Client ${client.id} unsubscribed from agent status: ${agentId}`);
    
    // Remove subscription
    const subscriptions = this.clientSubscriptions.get(client.id);
    if (subscriptions) {
      subscriptions.delete(`agent_status_${agentId}`);
    }

    return {
      success: true,
      message: `Unsubscribed from agent status: ${agentId}`
    };
  }

  /**
   * Get current agent status
   */
  @SubscribeMessage('getAgentStatus')
  handleGetAgentStatus(
    @MessageBody() data: { agentId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const agentId = data.agentId;
    
    try {
      if (agentId) {
        const agent = this.agentsService.getAgent(agentId);
        if (!agent) {
          return {
            success: false,
            error: `Agent '${agentId}' not found`
          };
        }

        return {
          success: true,
          data: {
            id: agentId,
            name: agent.getRole(),
            status: agent.getStatus(),
            workload: agent.getCurrentWorkload(),
            isAvailable: agent.isAvailable()
          }
        };
      } else {
        const agents = this.agentsService.getAvailableAgents();
        return {
          success: true,
          data: agents
        };
      }
    } catch (error) {
      this.logger.error('Failed to get agent status', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get active tasks
   */
  @SubscribeMessage('getActiveTasks')
  handleGetActiveTasks(@ConnectedSocket() client: Socket) {
    try {
      const tasks = this.agentsService.getActiveTasks();
      return {
        success: true,
        data: tasks
      };
    } catch (error) {
      this.logger.error('Failed to get active tasks', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel a task
   */
  @SubscribeMessage('cancelTask')
  async handleCancelTask(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const cancelled = await this.agentsService.cancelTask(data.taskId);
      
      if (cancelled) {
        // Notify task cancelled
        client.emit('taskCancelled', {
          taskId: data.taskId,
          status: 'cancelled',
          timestamp: new Date().toISOString()
        });
      }

      return {
        success: cancelled,
        message: cancelled ? 'Task cancelled successfully' : 'Task not found or cannot be cancelled'
      };
    } catch (error) {
      this.logger.error('Failed to cancel task', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send agent status to client
   */
  private sendAgentStatus(client: Socket, agentId?: string) {
    try {
      if (agentId && agentId !== 'all') {
        const agent = this.agentsService.getAgent(agentId);
        if (agent) {
          client.emit('agentStatusUpdate', {
            id: agentId,
            name: agent.getRole(),
            status: agent.getStatus(),
            workload: agent.getCurrentWorkload(),
            isAvailable: agent.isAvailable(),
            timestamp: new Date().toISOString()
          });
        }
      } else {
        const agents = this.agentsService.getAvailableAgents();
        client.emit('agentStatusUpdate', {
          agents,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      this.logger.error('Failed to send agent status', error);
    }
  }

  /**
   * Execute workflow with progress updates
   */
  private async executeWorkflowWithProgress(
    workflow: WorkflowDto,
    client: Socket,
    clientWorkflowId: string
  ) {
    // Send progress updates during workflow execution
    const sendProgress = (step: number, total: number, stepDescription: string) => {
      client.emit('workflowProgress', {
        clientWorkflowId,
        step,
        total,
        stepDescription,
        progress: Math.round((step / total) * 100),
        timestamp: new Date().toISOString()
      });
    };

    // Execute workflow
    const result = await this.agentsService.executeWorkflow(workflow);

    // Send final progress
    if (workflow.steps) {
      sendProgress(workflow.steps.length, workflow.steps.length, 'Workflow completed');
    }

    return result;
  }

  /**
   * Broadcast agent status updates to all subscribed clients
   */
  broadcastAgentStatusUpdate(agentId: string) {
    this.connectedClients.forEach((client, clientId) => {
      const subscriptions = this.clientSubscriptions.get(clientId);
      if (subscriptions && 
          (subscriptions.has(`agent_status_${agentId}`) || subscriptions.has('agent_status_all'))) {
        this.sendAgentStatus(client, agentId);
      }
    });
  }

  /**
   * Broadcast task updates to all subscribed clients
   */
  broadcastTaskUpdate(taskId: string, update: any) {
    this.connectedClients.forEach((client, clientId) => {
      const subscriptions = this.clientSubscriptions.get(clientId);
      if (subscriptions && subscriptions.has(taskId)) {
        client.emit('taskUpdate', {
          taskId,
          ...update,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
}