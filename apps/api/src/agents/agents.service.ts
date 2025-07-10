import { Injectable, Logger } from '@nestjs/common';
import {
  MasterAssistantAgent,
  ITask,
  ITaskResult,
  BaseAgent,
  IAgentContext,
  TaskType,
  TaskPriority,
  TaskComplexity,
  TaskStatus
} from '@agent-flow/agents';
import { MaryAgent } from '@agent-flow/agents';
import { JohnAgent } from '@agent-flow/agents';
import { FredAgent } from '@agent-flow/agents';
import { JaneAgent } from '@agent-flow/agents';
import { CreateTaskDto } from './dto/create-task.dto';
import { WorkflowDto } from './dto/workflow.dto';
import { MockProvider } from './mock-provider';

/**
 * Service for managing and executing agent tasks
 */
@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);
  private readonly agents = new Map<string, BaseAgent>();
  private readonly master: MasterAssistantAgent;
  private readonly activeTasks = new Map<string, any>();

  constructor() {
    // Initialize master agent with basic config
    this.master = new MasterAssistantAgent(
      {
        id: 'master',
        name: 'Master Assistant',
        type: 'master-assistant' as any,
        description: 'Master assistant for task coordination',
        availableTasks: [TaskType.TASK_COORDINATION, TaskType.GENERAL_ASSISTANCE, TaskType.AGENT_ROUTING],
        systemPrompt: 'You are the master assistant coordinator.',
        maxTokens: 4000,
        temperature: 0.7,
        metadata: {},
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        specialization: 'Task Coordination',
        role: 'Master Coordinator',
        priority: 10,
        maxConcurrentTasks: 5,
        collaboration: {
          preferredPartners: [],
          canWorkAlone: true,
          requiresSupervision: false
        },
        tools: [],
        performance: {
          maxResponseTime: 30000,
          minAccuracy: 0.9,
          maxErrorRate: 0.1
        }
      },
      new MockProvider('master-provider')
    );
    
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  private async initializeAgents(): Promise<void> {
    try {
      this.logger.log('Initializing agents...');
      
      // Create specialized agents with basic configs
      const mary = new MaryAgent(
        {
          id: 'mary',
          name: 'Mary - Data Analyst',
          type: 'data-analyst' as any,
          description: 'Data analysis and statistics expert',
          availableTasks: [TaskType.DATA_ANALYSIS, TaskType.DATA_VISUALIZATION, TaskType.STATISTICAL_MODELING, TaskType.DATA_PROCESSING, TaskType.REPORTING],
          systemPrompt: 'You are Mary, a data analysis specialist.',
          maxTokens: 4000,
          temperature: 0.3,
          metadata: {},
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          specialization: 'Data Analysis',
          role: 'Data Analyst',
          priority: 8,
          maxConcurrentTasks: 3,
          collaboration: {
            preferredPartners: ['john'],
            canWorkAlone: true,
            requiresSupervision: false
          },
          tools: [],
          performance: {
            maxResponseTime: 45000,
            minAccuracy: 0.95,
            maxErrorRate: 0.05
          }
        },
        new MockProvider('mary-provider')
      );
      
      const john = new JohnAgent(
        {
          id: 'john',
          name: 'John - Researcher',
          type: 'researcher' as any,
          description: 'Research and information gathering specialist',
          availableTasks: [TaskType.RESEARCH, TaskType.FACT_CHECKING, TaskType.INFORMATION_SYNTHESIS, TaskType.MARKET_RESEARCH],
          systemPrompt: 'You are John, a research specialist.',
          maxTokens: 4000,
          temperature: 0.5,
          metadata: {},
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          specialization: 'Research',
          role: 'Research Specialist',
          priority: 7,
          maxConcurrentTasks: 4,
          collaboration: {
            preferredPartners: ['mary'],
            canWorkAlone: true,
            requiresSupervision: false
          },
          tools: [],
          performance: {
            maxResponseTime: 60000,
            minAccuracy: 0.9,
            maxErrorRate: 0.1
          }
        },
        new MockProvider('john-provider')
      );
      
      const fred = new FredAgent(
        {
          id: 'fred',
          name: 'Fred - Creative',
          type: 'creative' as any,
          description: 'Creative content and design specialist',
          availableTasks: [TaskType.CREATIVE_WRITING, TaskType.CONTENT_CREATION, TaskType.DESIGN_CONCEPTS, TaskType.MARKETING],
          systemPrompt: 'You are Fred, a creative content specialist.',
          tools: [],
          maxTokens: 4000,
          temperature: 0.8,
          priority: 6,
          maxConcurrentTasks: 3,
          metadata: {
            specialization: 'Creative Content',
            role: 'Creative Specialist',
            collaboration: {
              preferredPartners: ['jane'],
              canWorkAlone: true,
              requiresSupervision: false
            },
            performance: {
              maxResponseTime: 40000,
              minAccuracy: 0.85,
              maxErrorRate: 0.15
            }
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        new MockProvider('fred-provider')
      );
      
      const jane = new JaneAgent(
        {
          id: 'jane',
          name: 'Jane - Technical Writer',
          type: 'technical-writer' as any,
          description: 'Technical writing and documentation specialist',
          availableTasks: [TaskType.TECHNICAL_DOCUMENTATION, TaskType.CODE_REVIEW, TaskType.SOFTWARE_DEVELOPMENT, TaskType.SYSTEM_ARCHITECTURE],
          systemPrompt: 'You are Jane, a technical writing specialist.',
          tools: [],
          maxTokens: 4000,
          temperature: 0.4,
          priority: 7,
          maxConcurrentTasks: 3,
          metadata: {
            specialization: 'Technical Writing',
            role: 'Technical Writer',
            collaboration: {
              preferredPartners: ['fred'],
              canWorkAlone: true,
              requiresSupervision: false
            },
            performance: {
              maxResponseTime: 35000,
              minAccuracy: 0.92,
              maxErrorRate: 0.08
            }
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        new MockProvider('jane-provider')
      );
      
      // Initialize agents
      await Promise.all([
        mary.initialize(),
        john.initialize(),
        fred.initialize(),
        jane.initialize(),
        this.master.initialize()
      ]);
      
      // Store agents in map
      this.agents.set('mary', mary);
      this.agents.set('john', john);
      this.agents.set('fred', fred);
      this.agents.set('jane', jane);
      
      this.logger.log('All agents initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize agents', error);
      throw error;
    }
  }

  /**
   * Execute a single task with the appropriate agent
   */
  async executeTask(createTaskDto: CreateTaskDto): Promise<ITaskResult> {
    const taskId = this.generateTaskId();
    
    try {
      this.logger.log(`Executing task ${taskId} of type ${createTaskDto.type}`);
      
      // Get the appropriate agent for the task first
      const agent = this.getAgentForTask(createTaskDto.type);
      if (!agent) {
        throw new Error(`No agent available for task type: ${createTaskDto.type}`);
      }
      
      // Convert DTO to ITask
      const task: ITask = {
        id: taskId,
        type: createTaskDto.type,
        complexity: TaskComplexity.MODERATE, // Default complexity
        input: {
          prompt: createTaskDto.description,
          context: createTaskDto.parameters || {},
          requirements: [],
          constraints: []
        },
        priority: createTaskDto.priority || TaskPriority.MEDIUM,
        sessionId: 'default-session',
        userId: 'default-user',
        deadline: createTaskDto.context?.deadline ? new Date(createTaskDto.context.deadline) : undefined,
        metadata: createTaskDto.context || {},
        createdAt: new Date()
      };
      
      // Track active task
      this.activeTasks.set(taskId, {
        task,
        startTime: new Date(),
        status: 'running'
      });
      
      // Create agent context for execution
      const agentContext = {
        sessionId: task.metadata.sessionId || 'default-session',
        userId: task.metadata.userId || 'default-user',
        conversationHistory: [],
        currentTask: task.type,
        metadata: task.metadata,
        timestamp: new Date()
      };
      
      // Validate that the agent can execute the task
      const canExecute = await agent.validateTaskExecution(task.type, agentContext);
      if (!canExecute) {
        throw new Error(`Agent cannot execute task type: ${task.type}`);
      }
      
      // Execute the task
      const agentResponse = await agent.executeTask(task.type, agentContext);
      
      // Convert agent response to task result
      const result: ITaskResult = {
        taskId: task.id,
        taskType: task.type,
        status: agentResponse.success ? TaskStatus.COMPLETED : TaskStatus.FAILED,
        output: agentResponse.success ? {
          result: agentResponse.content,
          artifacts: [],
          metadata: agentResponse.metadata,
          executionTime: agentResponse.metadata.executionTime || 0,
          tokensUsed: agentResponse.metadata.tokensUsed
        } : undefined,
        error: agentResponse.error,
        executedBy: agentResponse.agentType,
        startTime: new Date(task.createdAt),
        endTime: new Date(),
        metadata: agentResponse.metadata
      };
      
      // Update task tracking
      this.activeTasks.set(taskId, {
        task,
        startTime: this.activeTasks.get(taskId)?.startTime,
        endTime: new Date(),
        status: 'completed',
        result
      });
      
      this.logger.log(`Task ${taskId} completed successfully`);
      return result;
      
    } catch (error) {
      this.logger.error(`Task ${taskId} failed:`, error);
      
      // Update task tracking
      this.activeTasks.set(taskId, {
        task: this.activeTasks.get(taskId)?.task,
        startTime: this.activeTasks.get(taskId)?.startTime,
        endTime: new Date(),
        status: 'failed',
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Execute a complex workflow with multiple agents
   */
  async executeWorkflow(workflowDto: WorkflowDto): Promise<any> {
    const workflowId = this.generateTaskId();
    
    try {
      this.logger.log(`Executing workflow ${workflowId}: ${workflowDto.description}`);
      
      // Track workflow
      this.activeTasks.set(workflowId, {
        workflow: workflowDto,
        startTime: new Date(),
        status: 'running'
      });
      
      // Execute workflow using master assistant coordination
      const result = await this.master.executeTask(TaskType.TASK_COORDINATION, {
        sessionId: workflowId,
        userId: 'system',
        conversationHistory: [],
        currentTask: TaskType.TASK_COORDINATION,
        metadata: {
          workflowId,
          description: workflowDto.description,
          steps: workflowDto.steps
        },
        timestamp: new Date()
      });
      
      // Update workflow tracking
      this.activeTasks.set(workflowId, {
        workflow: workflowDto,
        startTime: this.activeTasks.get(workflowId)?.startTime,
        endTime: new Date(),
        status: 'completed',
        result
      });
      
      this.logger.log(`Workflow ${workflowId} completed successfully`);
      return result;
      
    } catch (error) {
      this.logger.error(`Workflow ${workflowId} failed:`, error);
      
      // Update workflow tracking
      this.activeTasks.set(workflowId, {
        workflow: workflowDto,
        startTime: this.activeTasks.get(workflowId)?.startTime,
        endTime: new Date(),
        status: 'failed',
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Get all available agents
   */
  getAvailableAgents(): Array<{ id: string; name: string; specialization: string; status: string }> {
    return Array.from(this.agents.entries()).map(([id, agent]) => ({
      id,
      name: agent.getRole(),
      specialization: agent.getSpecialization(),
      status: agent.getStatus()
    }));
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get agent performance metrics
   */
  async getAgentMetrics(agentId: string) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    // Return basic metrics since getPerformanceMetrics doesn't exist
    return {
      agentId,
      tasksCompleted: 0,
      averageResponseTime: 0,
      successRate: 100
    };
  }

  /**
   * Get task status and history
   */
  getTaskStatus(taskId: string) {
    return this.activeTasks.get(taskId);
  }

  /**
   * Get all active tasks
   */
  getActiveTasks() {
    return Array.from(this.activeTasks.entries()).map(([id, task]) => ({
      id,
      ...task
    }));
  }

  /**
   * Cancel a running task
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const taskInfo = this.activeTasks.get(taskId);
    if (!taskInfo || taskInfo.status !== 'running') {
      return false;
    }

    try {
      // Update task status
      this.activeTasks.set(taskId, {
        ...taskInfo,
        status: 'cancelled',
        endTime: new Date()
      });

      this.logger.log(`Task ${taskId} cancelled`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to cancel task ${taskId}:`, error);
      return false;
    }
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability: string): BaseAgent[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.getCapabilities().includes(capability)
    );
  }

  /**
   * Get task examples for a specific task type
   */
  getTaskExamples(taskType: TaskType): string[] {
    const agent = this.getAgentForTask(taskType);
    return agent ? agent.getTaskExamples(taskType) : [];
  }

  /**
   * Get the best agent for a specific task type
   */
  private getAgentForTask(taskType: TaskType): BaseAgent | null {
    const taskAgentMap: Record<TaskType, string> = {
      // Master Assistant tasks - route to master or most appropriate agent
      [TaskType.GENERAL_ASSISTANCE]: 'mary', // Default to Mary for general assistance
      [TaskType.TASK_COORDINATION]: 'mary', // Mary handles coordination
      [TaskType.AGENT_ROUTING]: 'mary', // Mary handles routing decisions
      [TaskType.SYSTEM_MANAGEMENT]: 'jane', // Jane handles technical system management
      [TaskType.DECISION_MAKING]: 'mary', // Mary handles decision making
      
      // Data Analysis tasks (Mary)
      [TaskType.DATA_ANALYSIS]: 'mary',
      [TaskType.DATA_VISUALIZATION]: 'mary',
      [TaskType.STATISTICAL_MODELING]: 'mary',
      [TaskType.DATA_PROCESSING]: 'mary',
      [TaskType.REPORTING]: 'mary',
      
      // Research tasks (John)
      [TaskType.RESEARCH]: 'john',
      [TaskType.FACT_CHECKING]: 'john',
      [TaskType.INFORMATION_SYNTHESIS]: 'john',
      [TaskType.COMPETITIVE_ANALYSIS]: 'john',
      [TaskType.MARKET_RESEARCH]: 'john',
      
      // Creative tasks (Fred)
      [TaskType.CONTENT_CREATION]: 'fred',
      [TaskType.CREATIVE_WRITING]: 'fred',
      [TaskType.DESIGN_CONCEPTS]: 'fred',
      [TaskType.MULTIMEDIA_CONTENT]: 'fred',
      [TaskType.MARKETING]: 'fred',
      [TaskType.COMMUNICATION]: 'fred',
      
      // Technical tasks (Jane)
      [TaskType.SOFTWARE_DEVELOPMENT]: 'jane',
      [TaskType.SYSTEM_ARCHITECTURE]: 'jane',
      [TaskType.TECHNICAL_PROBLEM_SOLVING]: 'jane',
      [TaskType.CODE_REVIEW]: 'jane',
      [TaskType.TECHNICAL_DOCUMENTATION]: 'jane',
      [TaskType.AUTOMATION]: 'jane',
      [TaskType.TESTING]: 'jane',
      [TaskType.DEPLOYMENT]: 'jane',
      
      // Project Management tasks (Mary)
      [TaskType.PROJECT_MANAGEMENT]: 'mary',
      [TaskType.PROJECT_PLANNING]: 'mary',
      [TaskType.STRATEGIC_PLANNING]: 'mary',
      
      // Customer Service tasks (Fred - communication specialist)
      [TaskType.CUSTOMER_SERVICE]: 'fred',
      [TaskType.TECHNICAL_SUPPORT]: 'jane', // Technical support goes to Jane
      
      // Brand and Storytelling (Fred)
      [TaskType.BRAND_STORYTELLING]: 'fred',
      
      // Legacy tasks - route to most appropriate agents
      [TaskType.GENERAL_QUERIES]: 'mary',
      [TaskType.OVERSIGHT]: 'mary',
      [TaskType.WHEN_UNSURE]: 'mary',
      [TaskType.BRAIN_STORMING]: 'fred', // Creative brainstorming
      [TaskType.DEEP_RESEARCH]: 'john',
      [TaskType.PROJECT_BRIEFING]: 'mary',
      [TaskType.CREATE_PRD]: 'mary', // Product requirements
      [TaskType.CORRECT_COURSE]: 'mary',
      [TaskType.CREATE_DEEP_RESEARCH_PROMPT]: 'john',
      [TaskType.CREATE_ARCHITECTURE]: 'jane',
      [TaskType.CREATE_DEEP_RESEARCH_PROMPT_ARCH]: 'jane',
      [TaskType.CREATE_FRONTEND_ARCHITECTURE]: 'jane',
      [TaskType.CREATE_AI_FRONTEND_PROMPT]: 'jane',
      [TaskType.CREATE_UX_UI_SPEC]: 'fred', // Design-related
      [TaskType.RUN_PO_MASTER_CHECKLIST]: 'mary',
      [TaskType.RUN_STORY_DRAFT_CHECKLIST]: 'mary',
      [TaskType.RUN_CHANGE_CHECKLIST]: 'mary',
      [TaskType.DRAFT_STORY_FOR_DEV]: 'mary',
      [TaskType.EXTRACT_EPICS_AND_SHARD_ARCHITECTURE]: 'jane',
      [TaskType.CORRECT_COURSE_PO]: 'mary',
      [TaskType.RUN_CHANGE_CHECKLIST_SM]: 'mary',
      [TaskType.RUN_STORY_DOD_CHECKLIST]: 'mary',
      [TaskType.RUN_STORY_DRAFT_CHECKLIST_SM]: 'mary',
      [TaskType.CORRECT_COURSE_SM]: 'mary',
      [TaskType.DRAFT_STORY_FOR_DEV_SM]: 'mary'
    };

    const agentId = taskAgentMap[taskType];
    return agentId ? this.agents.get(agentId) || null : null;
  }

  /**
   * Generate a unique task ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup resources on module destroy
   */
  async onModuleDestroy() {
    this.logger.log('Cleaning up agents...');
    
    await Promise.all(
      Array.from(this.agents.values()).map(agent => 
        typeof (agent as any).cleanup === 'function' ? (agent as any).cleanup() : Promise.resolve()
      )
    );
    
    this.activeTasks.clear();
    this.logger.log('Agents cleanup completed');
  }
}