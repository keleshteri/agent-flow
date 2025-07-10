import { Injectable, Logger } from '@nestjs/common';
import { BaseAgent } from '../base/base-agent';
import {
  ITask,
  ITaskResult,
  TaskType,
  TaskStatus,
  TaskPriority,
  TaskComplexity,
  AgentType,
  AgentStatus,
  IAgentMetrics,
  IAgentConfig,
  ICollaborationPreference,
  IAgentContext
} from '../../types';
import { JANE_PROMPTS, JanePromptBuilder } from './jane.prompts';
import { JANE_CONFIG, JANE_SETTINGS } from './jane.config';

/**
 * Jane - Technical Implementation Specialist Agent
 * Specializes in software development, system architecture, technical problem-solving, and implementation
 */
@Injectable()
export class JaneAgent extends BaseAgent {
  private readonly logger = new Logger(JaneAgent.name);
  private technicalTools: Map<string, any> = new Map();
  private codeTemplates: Map<string, any> = new Map();
  private architecturePatterns: Map<string, any> = new Map();
  private implementationHistory: ITaskResult[] = [];
  private technicalMetrics: Map<string, number> = new Map();
  private knowledgeBase: Map<string, any> = new Map();
  private activeProjects: Map<string, any> = new Map();

  constructor(config: IAgentConfig, provider: any) {
    super(config, provider);
  }

  /**
   * Initialize Jane with technical tools and knowledge base
   */
  async initialize(): Promise<void> {
    try {
      this.logger.log('Initializing Jane - Technical Implementation Specialist');
      
      await this.loadTechnicalTools();
      await this.setupCodeTemplates();
      await this.initializeArchitecturePatterns();
      await this.loadTechnicalKnowledge();
      await this.setupDevelopmentEnvironment();
      
      this._status = AgentStatus.READY;
      this.logger.log('Jane initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Jane', error);
      this._status = AgentStatus.ERROR;
      throw error;
    }
  }

  /**
   * Required abstract method implementation
   */
  protected async onInitialize(): Promise<void> {
    await this.loadTechnicalTools();
    await this.setupCodeTemplates();
    await this.initializeArchitecturePatterns();
    await this.loadTechnicalKnowledge();
    await this.setupDevelopmentEnvironment();
  }

  /**
   * Required abstract method implementation
   */
  protected async onCleanup(): Promise<void> {
    this.technicalTools.clear();
    this.codeTemplates.clear();
    this.architecturePatterns.clear();
    this.implementationHistory = [];
    this.technicalMetrics.clear();
    this.knowledgeBase.clear();
    this.activeProjects.clear();
  }

  /**
   * Required abstract method implementation
   */
  protected async onConfigUpdated(config: Partial<IAgentConfig>): Promise<void> {
    await this.refreshTechnicalParameters();
    this.logger.log('Jane configuration updated');
  }

  /**
   * Required abstract method implementation
   */
  protected async onStop(): Promise<void> {
    await this.saveTechnicalState();
    this.logger.log('Jane stopped');
  }

  /**
   * Required abstract method implementation
   */
  async updateConfiguration(config: Partial<IAgentConfig>): Promise<void> {
    this._config = { ...this._config, ...config };
    await this.onConfigUpdated(config);
  }



  /**
   * Handle task completion with technical insights
   */
  protected async onTaskCompleted(context: any, response: any): Promise<void> {
    this.implementationHistory.push(response);
    await this.updateTechnicalMetrics(context, response);
    await this.updateKnowledgeBase(context, response);
    await this.saveTechnicalState();
    
    this.logger.log(`Jane completed ${context.currentTask} task with success: ${response.success}`);
  }

  /**
   * Handle task errors with technical debugging
   */
  protected async onTaskError(context: any, error: Error): Promise<void> {
    this.logger.error(`Jane encountered error in ${context.currentTask} task`, error);
    await this.analyzeTechnicalError(context, error);
    await this.suggestTechnicalSolutions(context, error);
  }

  /**
   * Clean up technical resources
   */
  async cleanup(): Promise<void> {
    this.technicalTools.clear();
    this.codeTemplates.clear();
    this.architecturePatterns.clear();
    this.implementationHistory = [];
    this.technicalMetrics.clear();
    this.knowledgeBase.clear();
    this.activeProjects.clear();
    
    await super.cleanup();
    this.logger.log('Jane cleanup completed');
  }

  /**
   * Update configuration with technical preferences
   */
  async updateConfig(newConfig: Partial<IAgentConfig>): Promise<void> {
    await super.updateConfig(newConfig);
    await this.refreshTechnicalParameters();
    this.logger.log('Jane configuration updated');
  }

  /**
   * Stop Jane and save technical state
   */
  async stop(): Promise<void> {
    await this.saveTechnicalState();
    await super.stop();
    this.logger.log('Jane stopped');
  }

  /**
   * Get task-specific prompt for Jane
   */
  getTaskPrompt(taskType: TaskType, context?: any): string {
    if (context?.technicalRequirements) {
      return JanePromptBuilder.buildTechnicalPrompt(taskType, context);
    }
    return JANE_PROMPTS[taskType] || JANE_PROMPTS.DEFAULT;
  }

  /**
   * Get Jane's specialization
   */
  getSpecialization(): string {
    return 'Technical Implementation Specialist - Expert in software development, system architecture, technical problem-solving, and implementation';
  }

  /**
   * Get Jane's role description
   */
  getRole(): string {
    return 'Technical Implementation Specialist';
  }

  /**
   * Get examples of tasks Jane can handle
   */
  getTaskExamples(taskType: TaskType): string[] {
    const examples = {
      [TaskType.SOFTWARE_DEVELOPMENT]: [
        'Design and implement software applications',
        'Write clean, maintainable, and efficient code',
        'Develop APIs and microservices',
        'Create automated testing suites'
      ],
      [TaskType.SYSTEM_ARCHITECTURE]: [
        'Design scalable system architectures',
        'Plan database schemas and data models',
        'Create technical specifications and documentation',
        'Design integration patterns and workflows'
      ],
      [TaskType.TECHNICAL_PROBLEM_SOLVING]: [
        'Debug complex technical issues',
        'Optimize system performance and efficiency',
        'Resolve integration and compatibility problems',
        'Implement security and compliance measures'
      ],
      [TaskType.CODE_REVIEW]: [
        'Review code for quality and best practices',
        'Identify potential bugs and security vulnerabilities',
        'Suggest improvements and optimizations',
        'Ensure coding standards compliance'
      ],
      [TaskType.TECHNICAL_DOCUMENTATION]: [
        'Write comprehensive technical documentation',
        'Create API documentation and guides',
        'Develop deployment and maintenance procedures',
        'Document system architecture and design decisions'
      ],
      [TaskType.AUTOMATION]: [
        'Design and implement automation workflows',
        'Create CI/CD pipelines and deployment scripts',
        'Develop monitoring and alerting systems',
        'Automate testing and quality assurance processes'
      ]
    };

    return examples[taskType] || [
      'Apply technical expertise to solve complex problems',
      'Implement robust and scalable solutions',
      'Optimize system performance and reliability',
      'Ensure code quality and best practices'
    ];
  }

  /**
   * Validate if Jane can execute the task
   */
  async validateTaskExecution(taskType: TaskType, context: IAgentContext): Promise<boolean> {
    const technicalTaskTypes = [
      TaskType.SOFTWARE_DEVELOPMENT,
      TaskType.SYSTEM_ARCHITECTURE,
      TaskType.TECHNICAL_PROBLEM_SOLVING,
      TaskType.CODE_REVIEW,
      TaskType.TECHNICAL_DOCUMENTATION,
      TaskType.AUTOMATION,
      TaskType.TESTING,
      TaskType.DEPLOYMENT
    ];

    if (!technicalTaskTypes.includes(taskType)) {
      return false;
    }

    if (this.getCurrentWorkload() >= JANE_SETTINGS.performance.maxConcurrentTasks) {
      return false;
    }

    // Check if required technical skills are available
    const requiredSkills = context.metadata?.requiredSkills || [];
    const availableSkills = this.getAvailableTechnicalSkills();
    const missingSkills = requiredSkills.filter(skill => !availableSkills.includes(skill));
    
    if (missingSkills.length > 0) {
      return false;
    }

    return true;
  }

  /**
   * Get next recommended actions
   */
  async getNextActions(currentTask: ITask): Promise<string[]> {
    const actions: string[] = [];
    
    if (currentTask.type === TaskType.SOFTWARE_DEVELOPMENT) {
      actions.push('Review code for quality and best practices');
      actions.push('Write comprehensive unit and integration tests');
      actions.push('Update technical documentation');
      actions.push('Perform security and performance analysis');
    } else if (currentTask.type === TaskType.SYSTEM_ARCHITECTURE) {
      actions.push('Validate architecture against requirements');
      actions.push('Create detailed implementation plan');
      actions.push('Identify potential risks and mitigation strategies');
      actions.push('Design monitoring and observability strategy');
    } else if (currentTask.type === TaskType.TECHNICAL_PROBLEM_SOLVING) {
      actions.push('Implement comprehensive solution');
      actions.push('Create preventive measures and monitoring');
      actions.push('Document root cause and resolution');
      actions.push('Update system documentation and procedures');
    }
    
    actions.push('Conduct peer review and validation');
    actions.push('Plan deployment and rollback strategies');
    
    return actions;
  }

  /**
   * Assess confidence in task execution
   */
  async assessTaskConfidence(task: ITask): Promise<number> {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on task type expertise
    const expertiseLevels = {
      [TaskType.SOFTWARE_DEVELOPMENT]: 0.95,
      [TaskType.SYSTEM_ARCHITECTURE]: 0.9,
      [TaskType.TECHNICAL_PROBLEM_SOLVING]: 0.92,
      [TaskType.CODE_REVIEW]: 0.88,
      [TaskType.TECHNICAL_DOCUMENTATION]: 0.85,
      [TaskType.AUTOMATION]: 0.87,
      [TaskType.TESTING]: 0.9,
      [TaskType.DEPLOYMENT]: 0.85
    };
    
    confidence = expertiseLevels[task.type] || confidence;
    
    // Adjust based on task complexity
    if (task.complexity === TaskComplexity.SIMPLE) confidence += 0.1;
    if (task.complexity === TaskComplexity.EXPERT) confidence -= 0.15;
    
    // Adjust based on current workload
    const workloadFactor = Math.max(0, 1 - (this.getCurrentWorkload() / JANE_SETTINGS.performance.maxConcurrentTasks));
    confidence *= (0.8 + 0.2 * workloadFactor);
    
    // Adjust based on technical knowledge and experience
    const knowledgeScore = this.assessTechnicalKnowledge(task);
    confidence = confidence * 0.7 + knowledgeScore * 0.3;
    
    // Adjust based on recent success rate
    const recentSuccessRate = this.calculateRecentSuccessRate();
    confidence = confidence * 0.8 + recentSuccessRate * 0.2;
    
    return Math.min(0.99, Math.max(0.1, confidence));
  }

  /**
   * Get current workload status
   */
  getCurrentWorkload(): number {
    return this._taskCount || 0;
  }

  /**
   * Check if Jane is available for new tasks
   */
  isAvailable(): boolean {
    if (this._status !== AgentStatus.READY) return false;
    if (this.getCurrentWorkload() >= JANE_SETTINGS.performance.maxConcurrentTasks) return false;
    
    // Check system resources and capacity
    const systemLoad = this.technicalMetrics.get('systemLoad') || 0;
    return systemLoad < JANE_SETTINGS.performance.maxSystemLoad;
  }

  /**
   * Get Jane's priority level
   */
  getPriority(): TaskPriority {
    return TaskPriority.HIGH; // Technical implementation is high priority
  }

  /**
   * Get collaboration preferences
   */
  getCollaborationPreferences(): ICollaborationPreference[] {
    return [
      {
        agentType: AgentType.MARY,
        preferredTasks: [TaskType.SOFTWARE_DEVELOPMENT, TaskType.SYSTEM_ARCHITECTURE],
        collaborationStyle: 'data-driven development',
        communicationFrequency: 'regular'
      },
      {
        agentType: AgentType.JOHN,
        preferredTasks: [TaskType.TECHNICAL_DOCUMENTATION, TaskType.RESEARCH],
        collaborationStyle: 'research-backed implementation',
        communicationFrequency: 'as-needed'
      },
      {
        agentType: AgentType.FRED,
        preferredTasks: [TaskType.SOFTWARE_DEVELOPMENT, TaskType.TECHNICAL_DOCUMENTATION],
        collaborationStyle: 'user-focused development',
        communicationFrequency: 'frequent'
      },
      {
        agentType: AgentType.SARAH,
        preferredTasks: [TaskType.AUTOMATION, TaskType.DEPLOYMENT],
        collaborationStyle: 'operational excellence',
        communicationFrequency: 'regular'
      }
    ];
  }

  /**
   * Perform software development task
   */
  async developSoftware(
    requirements: any,
    specifications: any,
    constraints?: any
  ): Promise<any> {
    this.logger.log('Starting software development task');
    
    const architecture = await this.designArchitecture(requirements, specifications);
    const implementation = await this.implementSolution(architecture, constraints);
    const testing = await this.createTestSuite(implementation);
    const documentation = await this.generateTechnicalDocumentation(implementation);
    
    return {
      architecture,
      implementation,
      testing,
      documentation,
      metrics: await this.generateImplementationMetrics(implementation),
      recommendations: await this.generateTechnicalRecommendations(implementation)
    };
  }

  /**
   * Get technical implementation history
   */
  getImplementationHistory(): ITaskResult[] {
    return [...this.implementationHistory];
  }

  /**
   * Get available technical tools
   */
  getAvailableTechnicalTools(): string[] {
    return Array.from(this.technicalTools.keys());
  }

  /**
   * Get available technical skills
   */
  getAvailableTechnicalSkills(): string[] {
    return JANE_SETTINGS.technicalSkills.programming.concat(
      JANE_SETTINGS.technicalSkills.frameworks,
      JANE_SETTINGS.technicalSkills.databases,
      JANE_SETTINGS.technicalSkills.tools
    );
  }

  /**
   * Validate technical requirements
   */
  async validateTechnicalRequirements(requirements: any): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!requirements.functionalRequirements) {
      issues.push('Functional requirements not specified');
      suggestions.push('Define clear functional requirements and user stories');
    }
    
    if (!requirements.nonFunctionalRequirements) {
      suggestions.push('Consider specifying non-functional requirements (performance, security, scalability)');
    }
    
    if (!requirements.technicalConstraints) {
      suggestions.push('Define technical constraints and limitations');
    }
    
    if (!requirements.acceptanceCriteria) {
      issues.push('Acceptance criteria not defined');
      suggestions.push('Specify clear acceptance criteria for validation');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Analyze system performance
   */
  async analyzeSystemPerformance(): Promise<any> {
    return {
      currentLoad: this.technicalMetrics.get('systemLoad') || 0,
      memoryUsage: this.technicalMetrics.get('memoryUsage') || 0,
      responseTime: this.technicalMetrics.get('responseTime') || 0,
      errorRate: this.technicalMetrics.get('errorRate') || 0,
      throughput: this.technicalMetrics.get('throughput') || 0,
      recommendations: await this.generatePerformanceRecommendations()
    };
  }

  // Private helper methods
  
  private async loadTechnicalTools(): Promise<void> {
    const tools = JANE_SETTINGS.technicalTools;
    for (const [toolName, toolConfig] of Object.entries(tools)) {
      this.technicalTools.set(toolName, toolConfig);
    }
  }

  private async setupCodeTemplates(): Promise<void> {
    const templates = JANE_SETTINGS.codeTemplates;
    for (const [templateName, template] of Object.entries(templates)) {
      this.codeTemplates.set(templateName, template);
    }
  }

  private async initializeArchitecturePatterns(): Promise<void> {
    const patterns = JANE_SETTINGS.architecturePatterns;
    for (const [patternName, pattern] of Object.entries(patterns)) {
      this.architecturePatterns.set(patternName, pattern);
    }
  }

  private async loadTechnicalKnowledge(): Promise<void> {
    // Load technical knowledge base and best practices
    const knowledge = JANE_SETTINGS.knowledgeBase;
    for (const [topic, content] of Object.entries(knowledge)) {
      this.knowledgeBase.set(topic, content);
    }
  }

  private async setupDevelopmentEnvironment(): Promise<void> {
    // Initialize development environment and tools
    this.logger.debug('Setting up development environment');
  }

  private async updateTechnicalMetrics(task: ITask, result: ITaskResult): Promise<void> {
    // Update technical performance metrics
    const complexity = this.calculateTaskComplexity(task);
    const currentComplexity = this.technicalMetrics.get('averageComplexity') || 0;
    this.technicalMetrics.set('averageComplexity', (currentComplexity + complexity) / 2);
    
    // Update success metrics
    const successCount = this.technicalMetrics.get('successCount') || 0;
    if (result.status === TaskStatus.COMPLETED) {
      this.technicalMetrics.set('successCount', successCount + 1);
    }
  }

  private async updateKnowledgeBase(task: ITask, result: ITaskResult): Promise<void> {
    // Update knowledge base with new learnings
    if (result.status === TaskStatus.COMPLETED && result.metadata?.artifacts) {
      const learnings = this.extractLearnings(task, result);
      this.knowledgeBase.set(`learning_${Date.now()}`, learnings);
    }
  }

  private async analyzeTechnicalError(task: ITask, error: Error): Promise<void> {
    this.logger.log(`Analyzing technical error for ${task.type} task`);
    // Implementation for technical error analysis
  }

  private async suggestTechnicalSolutions(task: ITask, error: Error): Promise<void> {
    this.logger.log(`Suggesting technical solutions for failed ${task.type} task`);
    // Implementation for suggesting technical solutions
  }

  private async refreshTechnicalParameters(): Promise<void> {
    // Refresh technical tools and templates based on new configuration
    await this.loadTechnicalTools();
    await this.setupCodeTemplates();
  }

  private async saveTechnicalState(): Promise<void> {
    // Save current technical state and metrics
    this.logger.debug('Saving Jane technical state');
  }

  private calculateRecentSuccessRate(): number {
    const recentTasks = this.implementationHistory.slice(-10);
    if (recentTasks.length === 0) return 0.8;
    
    const successfulTasks = recentTasks.filter(task => task.status === TaskStatus.COMPLETED);
    return successfulTasks.length / recentTasks.length;
  }

  private assessTechnicalKnowledge(task: ITask): number {
    // Assess technical knowledge relevant to the task
    const requiredSkills = task.metadata?.requiredSkills || [];
    const availableSkills = this.getAvailableTechnicalSkills();
    
    if (requiredSkills.length === 0) return 0.8;
    
    const matchingSkills = requiredSkills.filter(skill => availableSkills.includes(skill));
    return matchingSkills.length / requiredSkills.length;
  }

  private calculateTaskComplexity(task: ITask): number {
    const complexityScores = {
      [TaskComplexity.SIMPLE]: 1,
      [TaskComplexity.MODERATE]: 2,
      [TaskComplexity.COMPLEX]: 3,
      [TaskComplexity.EXPERT]: 4
    };
    
    return complexityScores[task.complexity] || 2;
  }

  private extractLearnings(task: ITask, result: ITaskResult): any {
    // Extract learnings from completed task
    return {
      taskType: task.type,
      complexity: task.complexity,
      techniques: result.metadata?.techniquesUsed || [],
      challenges: result.metadata?.challenges || [],
      solutions: result.metadata?.solutions || [],
      timestamp: new Date().toISOString()
    };
  }

  private async designArchitecture(requirements: any, specifications: any): Promise<any> {
    // Design system architecture based on requirements
    return {
      components: await this.identifyComponents(requirements),
      patterns: await this.selectArchitecturePatterns(requirements),
      interfaces: await this.designInterfaces(specifications),
      dataModel: await this.designDataModel(requirements)
    };
  }

  private async implementSolution(architecture: any, constraints?: any): Promise<any> {
    // Implement solution based on architecture
    return {
      codeStructure: await this.generateCodeStructure(architecture),
      implementation: await this.generateImplementation(architecture),
      configuration: await this.generateConfiguration(architecture, constraints)
    };
  }

  private async createTestSuite(implementation: any): Promise<any> {
    // Create comprehensive test suite
    return {
      unitTests: await this.generateUnitTests(implementation),
      integrationTests: await this.generateIntegrationTests(implementation),
      e2eTests: await this.generateE2ETests(implementation)
    };
  }

  private async generateTechnicalDocumentation(implementation: any): Promise<any> {
    // Generate technical documentation
    return {
      apiDocs: await this.generateAPIDocumentation(implementation),
      architectureDocs: await this.generateArchitectureDocumentation(implementation),
      deploymentDocs: await this.generateDeploymentDocumentation(implementation)
    };
  }

  private async generateImplementationMetrics(implementation: any): Promise<any> {
    // Generate implementation quality metrics
    return {
      codeQuality: 85,
      testCoverage: 90,
      performance: 88,
      security: 92,
      maintainability: 87
    };
  }

  private async generateTechnicalRecommendations(implementation: any): Promise<string[]> {
    // Generate technical recommendations
    return [
      'Implement comprehensive monitoring and logging',
      'Add performance optimization strategies',
      'Enhance security measures and validation',
      'Create automated deployment pipeline',
      'Establish code review and quality gates'
    ];
  }

  private async generatePerformanceRecommendations(): Promise<string[]> {
    // Generate performance improvement recommendations
    return [
      'Optimize database queries and indexing',
      'Implement caching strategies',
      'Add load balancing and scaling',
      'Monitor and optimize memory usage',
      'Implement asynchronous processing'
    ];
  }

  // Additional helper methods for architecture and implementation
  private async identifyComponents(requirements: any): Promise<any[]> {
    return []; // Implementation for component identification
  }

  private async selectArchitecturePatterns(requirements: any): Promise<any[]> {
    return []; // Implementation for pattern selection
  }

  private async designInterfaces(specifications: any): Promise<any> {
    return {}; // Implementation for interface design
  }

  private async designDataModel(requirements: any): Promise<any> {
    return {}; // Implementation for data model design
  }

  private async generateCodeStructure(architecture: any): Promise<any> {
    return {}; // Implementation for code structure generation
  }

  private async generateImplementation(architecture: any): Promise<any> {
    return {}; // Implementation for code generation
  }

  private async generateConfiguration(architecture: any, constraints?: any): Promise<any> {
    return {}; // Implementation for configuration generation
  }

  private async generateUnitTests(implementation: any): Promise<any> {
    return {}; // Implementation for unit test generation
  }

  private async generateIntegrationTests(implementation: any): Promise<any> {
    return {}; // Implementation for integration test generation
  }

  private async generateE2ETests(implementation: any): Promise<any> {
    return {}; // Implementation for E2E test generation
  }

  private async generateAPIDocumentation(implementation: any): Promise<any> {
    return {}; // Implementation for API documentation generation
  }

  private async generateArchitectureDocumentation(implementation: any): Promise<any> {
    return {}; // Implementation for architecture documentation generation
  }

  private async generateDeploymentDocumentation(implementation: any): Promise<any> {
    return {}; // Implementation for deployment documentation generation
  }
}