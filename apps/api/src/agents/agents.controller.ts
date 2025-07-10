import { 
  Controller, 
  Post, 
  Get, 
  Delete,
  Body, 
  Param, 
  Query,
  HttpException, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { WorkflowDto } from './dto/workflow.dto';
import { TaskType } from '@agent-flow/agents';

/**
 * Controller for managing AI agents and task execution
 */
@Controller('agents')
export class AgentsController {
  private readonly logger = new Logger(AgentsController.name);

  constructor(private readonly agentsService: AgentsService) {}

  /**
   * Get all available agents with their current status
   */
  @Get()
  getAgents() {
    try {
      const agents = this.agentsService.getAvailableAgents();
      return {
        success: true,
        data: agents,
        count: agents.length,
        message: 'Available agents retrieved successfully'
      };
    } catch (error) {
      this.logger.error('Failed to get agents', error);
      throw new HttpException(
        'Failed to retrieve agents',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get specific agent information and capabilities
   */
  @Get(':agentId')
  async getAgent(@Param('agentId') agentId: string) {
    try {
      const agent = this.agentsService.getAgent(agentId);
      if (!agent) {
        throw new HttpException(
          `Agent '${agentId}' not found`,
          HttpStatus.NOT_FOUND
        );
      }

      return {
        success: true,
        data: {
          id: agentId,
          name: agent.getRole(),
          specialization: agent.getSpecialization(),
          status: agent.getStatus(),
          capabilities: agent.getCapabilities(),
          workload: agent.getCurrentWorkload(),
          isAvailable: agent.isAvailable()
        },
        message: 'Agent information retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get agent ${agentId}`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to retrieve agent information',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Execute a single task with the appropriate agent
   */
  @Post('execute')
  async executeTask(@Body() createTaskDto: CreateTaskDto) {
    try {
      this.logger.log(`Executing task: ${createTaskDto.type}`);
      
      const result = await this.agentsService.executeTask(createTaskDto);
      
      return {
        success: true,
        data: result,
        message: 'Task executed successfully'
      };
    } catch (error) {
      this.logger.error('Failed to execute task', error);
      throw new HttpException(
        error.message || 'Failed to execute task',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Execute a complex workflow with multiple agents
   */
  @Post('workflow')
  async executeWorkflow(@Body() workflowDto: WorkflowDto) {
    try {
      this.logger.log(`Executing workflow: ${workflowDto.description}`);
      
      const result = await this.agentsService.executeWorkflow(workflowDto);
      
      return {
        success: true,
        data: result,
        message: 'Workflow executed successfully'
      };
    } catch (error) {
      this.logger.error('Failed to execute workflow', error);
      throw new HttpException(
        error.message || 'Failed to execute workflow',
        HttpStatus.BAD_REQUEST
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
        success: true,
        data: {
          agentId,
          metrics,
          timestamp: new Date().toISOString()
        },
        message: 'Agent metrics retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get metrics for agent ${agentId}`, error);
      
      if (error.message.includes('not found')) {
        throw new HttpException(
          `Agent '${agentId}' not found`,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        'Failed to retrieve agent metrics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get task examples for a specific task type
   */
  @Get('examples/:taskType')
  getTaskExamples(@Param('taskType') taskType: string) {
    try {
      // Validate task type
      if (!Object.values(TaskType).includes(taskType as TaskType)) {
        throw new HttpException(
          `Invalid task type: ${taskType}`,
          HttpStatus.BAD_REQUEST
        );
      }
      
      const examples = this.agentsService.getTaskExamples(taskType as TaskType);
      
      return {
        success: true,
        data: {
          taskType,
          examples
        },
        message: 'Task examples retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get examples for task type ${taskType}`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to retrieve task examples',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get agents by capability
   */
  @Get('capability/:capability')
  getAgentsByCapability(@Param('capability') capability: string) {
    try {
      const agents = this.agentsService.getAgentsByCapability(capability);
      
      return {
        success: true,
        data: {
          capability,
          agents: agents.map(agent => ({
            id: agent.getId(),
            name: agent.getRole(),
            specialization: agent.getSpecialization(),
            status: agent.getStatus()
          })),
          count: agents.length
        },
        message: 'Agents by capability retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get agents by capability ${capability}`, error);
      throw new HttpException(
        'Failed to retrieve agents by capability',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get all active tasks
   */
  @Get('tasks/active')
  getActiveTasks() {
    try {
      const tasks = this.agentsService.getActiveTasks();
      
      return {
        success: true,
        data: tasks,
        count: tasks.length,
        message: 'Active tasks retrieved successfully'
      };
    } catch (error) {
      this.logger.error('Failed to get active tasks', error);
      throw new HttpException(
        'Failed to retrieve active tasks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get task status by ID
   */
  @Get('tasks/:taskId/status')
  getTaskStatus(@Param('taskId') taskId: string) {
    try {
      const taskStatus = this.agentsService.getTaskStatus(taskId);
      
      if (!taskStatus) {
        throw new HttpException(
          `Task '${taskId}' not found`,
          HttpStatus.NOT_FOUND
        );
      }
      
      return {
        success: true,
        data: {
          taskId,
          ...taskStatus
        },
        message: 'Task status retrieved successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to get status for task ${taskId}`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to retrieve task status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Cancel a running task
   */
  @Delete('tasks/:taskId')
  async cancelTask(@Param('taskId') taskId: string) {
    try {
      const cancelled = await this.agentsService.cancelTask(taskId);
      
      if (!cancelled) {
        throw new HttpException(
          `Task '${taskId}' not found or cannot be cancelled`,
          HttpStatus.BAD_REQUEST
        );
      }
      
      return {
        success: true,
        data: {
          taskId,
          status: 'cancelled'
        },
        message: 'Task cancelled successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to cancel task ${taskId}`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to cancel task',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get available task types
   */
  @Get('meta/task-types')
  getTaskTypes() {
    try {
      const taskTypes = Object.values(TaskType).map(type => ({
        type,
        description: this.getTaskTypeDescription(type),
        examples: this.agentsService.getTaskExamples(type)
      }));
      
      return {
        success: true,
        data: taskTypes,
        count: taskTypes.length,
        message: 'Task types retrieved successfully'
      };
    } catch (error) {
      this.logger.error('Failed to get task types', error);
      throw new HttpException(
        'Failed to retrieve task types',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Health check endpoint for agents
   */
  @Get('health')
  async healthCheck() {
    try {
      const agents = this.agentsService.getAvailableAgents();
      const activeAgents = agents.filter(agent => agent.status === 'ready');
      const activeTasks = this.agentsService.getActiveTasks();
      const runningTasks = activeTasks.filter(task => task.status === 'running');
      
      return {
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          agents: {
            total: agents.length,
            active: activeAgents.length,
            inactive: agents.length - activeAgents.length
          },
          tasks: {
            total: activeTasks.length,
            running: runningTasks.length,
            completed: activeTasks.filter(task => task.status === 'completed').length,
            failed: activeTasks.filter(task => task.status === 'failed').length
          }
        },
        message: 'Agents system is healthy'
      };
    } catch (error) {
      this.logger.error('Health check failed', error);
      throw new HttpException(
        'Agents system health check failed',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  /**
   * Get description for a task type
   */
  private getTaskTypeDescription(taskType: TaskType): string {
    const descriptions: Record<TaskType, string> = {
      // Master Assistant tasks
      [TaskType.GENERAL_ASSISTANCE]: 'Provide general assistance and guidance',
      [TaskType.TASK_COORDINATION]: 'Coordinate tasks between multiple agents',
      [TaskType.AGENT_ROUTING]: 'Route tasks to appropriate specialized agents',
      [TaskType.SYSTEM_MANAGEMENT]: 'Manage system operations and workflows',
      [TaskType.DECISION_MAKING]: 'Make informed decisions based on available data',
      
      // Data Analysis tasks
      [TaskType.DATA_ANALYSIS]: 'Analyze data to extract insights and patterns',
      [TaskType.DATA_VISUALIZATION]: 'Create visual representations of data',
      [TaskType.STATISTICAL_MODELING]: 'Build statistical models for prediction and analysis',
      [TaskType.DATA_PROCESSING]: 'Process and transform raw data',
      [TaskType.REPORTING]: 'Generate comprehensive reports and summaries',
      
      // Research tasks
      [TaskType.RESEARCH]: 'Conduct comprehensive research on topics',
      [TaskType.FACT_CHECKING]: 'Verify facts and claims for accuracy',
      [TaskType.INFORMATION_SYNTHESIS]: 'Combine information from multiple sources',
      [TaskType.COMPETITIVE_ANALYSIS]: 'Analyze competitors and market position',
      [TaskType.MARKET_RESEARCH]: 'Research market trends and opportunities',
      
      // Creative tasks
      [TaskType.CONTENT_CREATION]: 'Create engaging content and copy',
      [TaskType.CREATIVE_WRITING]: 'Write creative and narrative content',
      [TaskType.DESIGN_CONCEPTS]: 'Develop visual and design concepts',
      [TaskType.MULTIMEDIA_CONTENT]: 'Create multimedia content strategies',
      [TaskType.MARKETING]: 'Develop marketing campaigns and strategies',
      [TaskType.COMMUNICATION]: 'Create clear and effective communications',
      
      // Technical tasks
      [TaskType.SOFTWARE_DEVELOPMENT]: 'Develop software applications and systems',
      [TaskType.SYSTEM_ARCHITECTURE]: 'Design system architectures and technical solutions',
      [TaskType.TECHNICAL_PROBLEM_SOLVING]: 'Solve complex technical problems',
      [TaskType.CODE_REVIEW]: 'Review code for quality and best practices',
      [TaskType.TECHNICAL_DOCUMENTATION]: 'Create technical documentation and guides',
      [TaskType.AUTOMATION]: 'Design and implement automation solutions',
      [TaskType.TESTING]: 'Design and execute testing strategies',
      [TaskType.DEPLOYMENT]: 'Plan and execute deployment strategies',
      
      // Project Management tasks
      [TaskType.PROJECT_MANAGEMENT]: 'Manage projects from inception to completion',
      [TaskType.PROJECT_PLANNING]: 'Create detailed project plans and timelines',
      [TaskType.STRATEGIC_PLANNING]: 'Develop strategic plans and roadmaps',
      
      // Customer Service tasks
      [TaskType.CUSTOMER_SERVICE]: 'Provide customer support and assistance',
      [TaskType.TECHNICAL_SUPPORT]: 'Provide technical support and troubleshooting',
      
      // Brand and Storytelling
      [TaskType.BRAND_STORYTELLING]: 'Create compelling brand narratives and stories',
      
      // Legacy tasks
      [TaskType.GENERAL_QUERIES]: 'Handle general queries and questions',
      [TaskType.OVERSIGHT]: 'Provide oversight and quality assurance',
      [TaskType.WHEN_UNSURE]: 'Handle uncertain or ambiguous situations',
      [TaskType.BRAIN_STORMING]: 'Facilitate brainstorming and ideation sessions',
      [TaskType.DEEP_RESEARCH]: 'Conduct in-depth research and analysis',
      [TaskType.PROJECT_BRIEFING]: 'Create comprehensive project briefings',
      [TaskType.CREATE_PRD]: 'Create Product Requirements Documents',
      [TaskType.CORRECT_COURSE]: 'Provide course corrections and adjustments',
      [TaskType.CREATE_DEEP_RESEARCH_PROMPT]: 'Create prompts for deep research tasks',
      [TaskType.CREATE_ARCHITECTURE]: 'Design system and software architectures',
      [TaskType.CREATE_DEEP_RESEARCH_PROMPT_ARCH]: 'Create architecture research prompts',
      [TaskType.CREATE_FRONTEND_ARCHITECTURE]: 'Design frontend system architectures',
      [TaskType.CREATE_AI_FRONTEND_PROMPT]: 'Create AI-powered frontend prompts',
      [TaskType.CREATE_UX_UI_SPEC]: 'Create UX/UI specifications and designs',
      [TaskType.RUN_PO_MASTER_CHECKLIST]: 'Execute Product Owner master checklist',
      [TaskType.RUN_STORY_DRAFT_CHECKLIST]: 'Execute story draft checklist',
      [TaskType.RUN_CHANGE_CHECKLIST]: 'Execute change management checklist',
      [TaskType.DRAFT_STORY_FOR_DEV]: 'Draft user stories for development',
      [TaskType.EXTRACT_EPICS_AND_SHARD_ARCHITECTURE]: 'Extract epics and shard architecture',
      [TaskType.CORRECT_COURSE_PO]: 'Provide Product Owner course corrections',
      [TaskType.RUN_CHANGE_CHECKLIST_SM]: 'Execute Scrum Master change checklist',
      [TaskType.RUN_STORY_DOD_CHECKLIST]: 'Execute story Definition of Done checklist',
      [TaskType.RUN_STORY_DRAFT_CHECKLIST_SM]: 'Execute Scrum Master story draft checklist',
      [TaskType.CORRECT_COURSE_SM]: 'Provide Scrum Master course corrections',
      [TaskType.DRAFT_STORY_FOR_DEV_SM]: 'Draft stories for development (Scrum Master)'
    };

    return descriptions[taskType] || 'Task description not available';
  }
}