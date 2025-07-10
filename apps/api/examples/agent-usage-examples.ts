/**
 * Agent Usage Examples
 * 
 * This file demonstrates various ways to use the agent system
 * including single tasks, complex workflows, and real-time updates.
 */

import { Injectable } from '@nestjs/common';
import { AgentsService } from '../src/agents/agents.service';
import {
  CreateTaskDto,
  WorkflowDto,
  TaskType,
  TaskPriority,
  WorkflowStrategy,
  DependencyType
} from '../src/agents/dto';

@Injectable()
export class AgentUsageExamples {
  constructor(private readonly agentsService: AgentsService) {}

  /**
   * Example 1: Simple Task Execution
   * Execute a single task with Mary (Project Management)
   */
  async executeSimpleTask() {
    const taskDto: CreateTaskDto = {
      type: TaskType.PROJECT_PLANNING,
      description: 'Create a project plan for developing a new e-commerce website',
      priority: TaskPriority.HIGH,
      context: {
        project: 'E-commerce Website',
        audience: 'Online shoppers',
        deadline: '3 months',
        budget: '$50,000'
      },
      requirements: {
        functional: [
          'User registration and authentication',
          'Product catalog with search',
          'Shopping cart and checkout',
          'Payment processing',
          'Order management'
        ],
        nonFunctional: {
          performance: 'Page load time < 2 seconds',
          security: 'PCI DSS compliance',
          scalability: 'Support 10,000 concurrent users'
        }
      },
      deliverables: [
        'Project timeline',
        'Resource allocation plan',
        'Risk assessment',
        'Milestone definitions'
      ]
    };

    try {
      const result = await this.agentsService.executeTask(taskDto);
      console.log('Task completed:', result);
      return result;
    } catch (error) {
      console.error('Task failed:', error);
      throw error;
    }
  }

  /**
   * Example 2: Technical Development Task
   * Execute a software development task with Jane
   */
  async executeTechnicalTask() {
    const taskDto: CreateTaskDto = {
      type: TaskType.SOFTWARE_DEVELOPMENT,
      description: 'Implement a REST API for user authentication with JWT tokens',
      priority: TaskPriority.HIGH,
      agentId: 'jane', // Specifically request Jane
      context: {
        project: 'E-commerce API',
        deadline: '1 week'
      },
      requirements: {
        technical: {
          framework: 'NestJS',
          database: 'PostgreSQL',
          authentication: 'JWT',
          validation: 'class-validator'
        },
        functional: [
          'User registration endpoint',
          'User login endpoint',
          'Token refresh endpoint',
          'Password reset functionality',
          'Email verification'
        ],
        acceptanceCriteria: [
          'All endpoints return proper HTTP status codes',
          'Passwords are hashed using bcrypt',
          'JWT tokens expire after 1 hour',
          'Refresh tokens expire after 7 days',
          'Input validation on all endpoints'
        ]
      },
      parameters: {
        codeStyle: 'TypeScript strict mode',
        testCoverage: '90%',
        documentation: 'OpenAPI/Swagger'
      }
    };

    try {
      const result = await this.agentsService.executeTask(taskDto);
      console.log('Development task completed:', result);
      return result;
    } catch (error) {
      console.error('Development task failed:', error);
      throw error;
    }
  }

  /**
   * Example 3: Creative Content Task
   * Execute a marketing content creation task with Fred
   */
  async executeCreativeTask() {
    const taskDto: CreateTaskDto = {
      type: TaskType.MARKETING,
      description: 'Create a comprehensive marketing campaign for the new e-commerce website launch',
      priority: TaskPriority.MEDIUM,
      agentId: 'fred',
      context: {
        project: 'E-commerce Website Launch',
        audience: 'Tech-savvy millennials and Gen Z',
        budget: '$10,000',
        deadline: '2 weeks'
      },
      requirements: {
        functional: [
          'Brand messaging strategy',
          'Social media content calendar',
          'Email marketing templates',
          'Landing page copy',
          'Ad campaign concepts'
        ]
      },
      parameters: {
        tone: 'Modern, friendly, trustworthy',
        channels: ['Instagram', 'Facebook', 'Google Ads', 'Email'],
        objectives: ['Brand awareness', 'Lead generation', 'Conversion optimization']
      },
      deliverables: [
        'Marketing strategy document',
        '30-day content calendar',
        'Email templates (5)',
        'Ad copy variations (10)',
        'Landing page wireframes'
      ]
    };

    try {
      const result = await this.agentsService.executeTask(taskDto);
      console.log('Creative task completed:', result);
      return result;
    } catch (error) {
      console.error('Creative task failed:', error);
      throw error;
    }
  }

  /**
   * Example 4: Research Task
   * Execute a market research task with John
   */
  async executeResearchTask() {
    const taskDto: CreateTaskDto = {
      type: TaskType.MARKET_RESEARCH,
      description: 'Conduct comprehensive market research for the e-commerce platform in the fashion industry',
      priority: TaskPriority.MEDIUM,
      agentId: 'john',
      context: {
        project: 'Fashion E-commerce Market Analysis',
        audience: 'Fashion retailers and consumers',
        deadline: '1 week'
      },
      requirements: {
        functional: [
          'Competitor analysis (top 10 players)',
          'Market size and growth trends',
          'Consumer behavior insights',
          'Technology trends in fashion e-commerce',
          'Pricing strategy recommendations'
        ]
      },
      parameters: {
        researchDepth: 'comprehensive',
        geographicScope: 'North America and Europe',
        timeframe: 'Last 3 years + 2-year forecast'
      },
      deliverables: [
        'Market research report (20-30 pages)',
        'Competitor analysis matrix',
        'Consumer persona profiles',
        'Market opportunity assessment',
        'Strategic recommendations'
      ]
    };

    try {
      const result = await this.agentsService.executeTask(taskDto);
      console.log('Research task completed:', result);
      return result;
    } catch (error) {
      console.error('Research task failed:', error);
      throw error;
    }
  }

  /**
   * Example 5: Complex Multi-Agent Workflow
   * Execute a complete project workflow involving multiple agents
   */
  async executeComplexWorkflow() {
    const workflowDto: WorkflowDto = {
      id: 'ecommerce-project-workflow',
      name: 'E-commerce Website Development Project',
      description: 'Complete end-to-end development of an e-commerce website from planning to launch',
      version: '1.0.0',
      priority: TaskPriority.HIGH,
      context: {
        project: 'Fashion E-commerce Platform',
        deadline: '6 months',
        budget: '$200,000'
      },
      steps: [
        {
          id: 'market-research',
          name: 'Market Research & Analysis',
          taskType: TaskType.MARKET_RESEARCH,
          description: 'Conduct comprehensive market research for fashion e-commerce',
          priority: TaskPriority.HIGH,
          agentId: 'john',
          expectedOutputs: ['market-analysis-report', 'competitor-matrix'],
          maxRetries: 2,
          timeout: 3600000 // 1 hour
        },
        {
          id: 'project-planning',
          name: 'Project Planning & Strategy',
          taskType: TaskType.PROJECT_PLANNING,
          description: 'Create detailed project plan based on market research findings',
          priority: TaskPriority.HIGH,
          agentId: 'mary',
          dependencies: [
            {
              stepId: 'market-research',
              type: DependencyType.BLOCKING
            }
          ],
          expectedOutputs: ['project-plan', 'timeline', 'resource-allocation'],
          maxRetries: 1
        },
        {
          id: 'system-architecture',
          name: 'System Architecture Design',
          taskType: TaskType.SYSTEM_ARCHITECTURE,
          description: 'Design the technical architecture for the e-commerce platform',
          priority: TaskPriority.HIGH,
          agentId: 'jane',
          dependencies: [
            {
              stepId: 'project-planning',
              type: DependencyType.BLOCKING
            }
          ],
          requirements: {
            technical: {
              scalability: '10,000 concurrent users',
              availability: '99.9% uptime',
              security: 'PCI DSS compliance'
            }
          },
          expectedOutputs: ['architecture-diagram', 'tech-stack-selection', 'database-schema']
        },
        {
          id: 'brand-strategy',
          name: 'Brand Strategy & Creative Direction',
          taskType: TaskType.BRAND_STORYTELLING,
          description: 'Develop brand identity and creative direction for the platform',
          priority: TaskPriority.MEDIUM,
          agentId: 'fred',
          dependencies: [
            {
              stepId: 'market-research',
              type: DependencyType.NON_BLOCKING
            }
          ],
          expectedOutputs: ['brand-guidelines', 'visual-identity', 'content-strategy']
        },
        {
          id: 'backend-development',
          name: 'Backend API Development',
          taskType: TaskType.SOFTWARE_DEVELOPMENT,
          description: 'Implement the backend API and database layer',
          priority: TaskPriority.HIGH,
          agentId: 'jane',
          dependencies: [
            {
              stepId: 'system-architecture',
              type: DependencyType.BLOCKING
            }
          ],
          requirements: {
            technical: {
              framework: 'NestJS',
              database: 'PostgreSQL',
              testing: 'Jest with 90% coverage'
            }
          },
          expectedOutputs: ['api-endpoints', 'database-implementation', 'test-suite'],
          timeout: 7200000 // 2 hours
        },
        {
          id: 'frontend-development',
          name: 'Frontend Application Development',
          taskType: TaskType.SOFTWARE_DEVELOPMENT,
          description: 'Implement the frontend user interface',
          priority: TaskPriority.HIGH,
          agentId: 'jane',
          dependencies: [
            {
              stepId: 'backend-development',
              type: DependencyType.NON_BLOCKING
            },
            {
              stepId: 'brand-strategy',
              type: DependencyType.NON_BLOCKING
            }
          ],
          requirements: {
            technical: {
              framework: 'React with TypeScript',
              styling: 'Tailwind CSS',
              stateManagement: 'Redux Toolkit'
            }
          },
          expectedOutputs: ['frontend-application', 'component-library', 'responsive-design']
        },
        {
          id: 'content-creation',
          name: 'Marketing Content Creation',
          taskType: TaskType.CONTENT_CREATION,
          description: 'Create all marketing and website content',
          priority: TaskPriority.MEDIUM,
          agentId: 'fred',
          dependencies: [
            {
              stepId: 'brand-strategy',
              type: DependencyType.BLOCKING
            }
          ],
          expectedOutputs: ['website-copy', 'product-descriptions', 'marketing-materials']
        },
        {
          id: 'testing-qa',
          name: 'Quality Assurance & Testing',
          taskType: TaskType.TESTING,
          description: 'Comprehensive testing of the entire platform',
          priority: TaskPriority.HIGH,
          agentId: 'jane',
          dependencies: [
            {
              stepId: 'frontend-development',
              type: DependencyType.BLOCKING
            },
            {
              stepId: 'backend-development',
              type: DependencyType.BLOCKING
            }
          ],
          expectedOutputs: ['test-results', 'bug-reports', 'performance-metrics']
        },
        {
          id: 'deployment',
          name: 'Production Deployment',
          taskType: TaskType.DEPLOYMENT,
          description: 'Deploy the platform to production environment',
          priority: TaskPriority.HIGH,
          agentId: 'jane',
          dependencies: [
            {
              stepId: 'testing-qa',
              type: DependencyType.BLOCKING
            }
          ],
          expectedOutputs: ['production-deployment', 'monitoring-setup', 'backup-strategy']
        },
        {
          id: 'launch-campaign',
          name: 'Launch Marketing Campaign',
          taskType: TaskType.MARKETING,
          description: 'Execute the marketing campaign for platform launch',
          priority: TaskPriority.HIGH,
          agentId: 'fred',
          dependencies: [
            {
              stepId: 'deployment',
              type: DependencyType.BLOCKING
            },
            {
              stepId: 'content-creation',
              type: DependencyType.BLOCKING
            }
          ],
          expectedOutputs: ['campaign-execution', 'social-media-posts', 'email-campaigns']
        }
      ],
      config: {
        strategy: WorkflowStrategy.CONDITIONAL,
        maxParallelSteps: 3,
        continueOnError: false,
        globalTimeout: 21600000, // 6 hours
        saveIntermediateResults: true,
        enableRollback: true
      },
      tags: ['e-commerce', 'full-stack', 'fashion', 'startup'],
      deliverables: [
        'Complete e-commerce platform',
        'Technical documentation',
        'User manuals',
        'Marketing materials',
        'Deployment guides'
      ]
    };

    try {
      console.log('Starting complex workflow...');
      const result = await this.agentsService.executeWorkflow(workflowDto);
      console.log('Workflow completed successfully:', result);
      return result;
    } catch (error) {
      console.error('Workflow failed:', error);
      throw error;
    }
  }

  /**
   * Example 6: Agent Status Monitoring
   * Monitor agent status and performance
   */
  async monitorAgentStatus() {
    try {
      // Get all available agents
      const agents = await this.agentsService.getAvailableAgents();
      console.log('Available agents:', agents);

      // Get specific agent information
      const maryInfo = await this.agentsService.getAgentInfo('mary');
      console.log('Mary agent info:', maryInfo);

      // Get agent performance metrics
      const metrics = await this.agentsService.getAgentMetrics('jane');
      console.log('Jane performance metrics:', metrics);

      // Get active tasks
      const activeTasks = await this.agentsService.getActiveTasks();
      console.log('Active tasks:', activeTasks);

      return {
        agents,
        maryInfo,
        metrics,
        activeTasks
      };
    } catch (error) {
      console.error('Failed to monitor agent status:', error);
      throw error;
    }
  }

  /**
   * Example 7: Task Management
   * Demonstrate task status checking and cancellation
   */
  async manageTask(taskId: string) {
    try {
      // Check task status
      const status = await this.agentsService.getTaskStatus(taskId);
      console.log('Task status:', status);

      // Cancel task if needed
      if (status.status === 'running') {
        const cancelled = await this.agentsService.cancelTask(taskId);
        console.log('Task cancelled:', cancelled);
        return { status, cancelled };
      }

      return { status };
    } catch (error) {
      console.error('Failed to manage task:', error);
      throw error;
    }
  }

  /**
   * Example 8: Agent Capability Discovery
   * Find the best agent for a specific task type
   */
  async findBestAgent(capability: string) {
    try {
      const agents = await this.agentsService.findAgentsByCapability(capability);
      console.log(`Agents capable of ${capability}:`, agents);

      // Get task examples for the capability
      const examples = await this.agentsService.getTaskExamples(capability as TaskType);
      console.log('Task examples:', examples);

      return { agents, examples };
    } catch (error) {
      console.error('Failed to find agents:', error);
      throw error;
    }
  }

  /**
   * Example 9: System Health Check
   * Check the overall health of the agent system
   */
  async checkSystemHealth() {
    try {
      const health = await this.agentsService.getSystemHealth();
      console.log('System health:', health);
      return health;
    } catch (error) {
      console.error('Failed to check system health:', error);
      throw error;
    }
  }
}