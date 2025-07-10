import { BaseAgent } from '../base/base-agent';
import { IBaseAgent, IBaseAgentConfig } from '../base/base-agent.interface';
import {
  AgentType,
  TaskType,
  IAgentContext,
  IAgentResponse,
  IProvider
} from '../../types';
import { JOHN_PROMPTS } from './john.prompts';
import { JOHN_CONFIG } from './john.config';

/**
 * John Agent - Research & Information Specialist
 * Specializes in information gathering, research, fact-checking, and knowledge synthesis
 */
export class JohnAgent extends BaseAgent implements IBaseAgent {
  private researchHistory: Map<string, any[]> = new Map();
  private sourceDatabase: Map<string, any> = new Map();
  private factCheckCache: Map<string, any> = new Map();
  private researchMethods: Map<string, any> = new Map();

  constructor(config: IBaseAgentConfig, provider: IProvider) {
    super(config, provider);
  }

  /**
   * Initialize John with research capabilities
   */
  protected async onInitialize(): Promise<void> {
    console.log('Initializing John - Research & Information Specialist...');
    await this.loadResearchMethods();
    await this.setupInformationSources();
    await this.initializeFactCheckingTools();
  }

  /**
   * Handle completed research tasks
   */
  protected async onTaskCompleted(
    context: IAgentContext,
    response: IAgentResponse
  ): Promise<void> {
    // Store research results for future reference
    const sessionResearch = this.researchHistory.get(context.sessionId) || [];
    sessionResearch.push({
      taskType: context.currentTask,
      timestamp: new Date(),
      result: response.content,
      metadata: response.metadata,
      sources: this.extractSources(response.content)
    });
    this.researchHistory.set(context.sessionId, sessionResearch);

    // Update source reliability based on successful research
    if (response.success && context.currentTask === TaskType.RESEARCH) {
      await this.updateSourceReliability(context, response);
    }
  }

  /**
   * Handle research errors and provide alternative approaches
   */
  protected async onTaskError(
    context: IAgentContext,
    error: Error
  ): Promise<void> {
    console.error(`John research error for ${context.currentTask}:`, error.message);
    
    // Provide alternative research strategies
    if (context.currentTask === TaskType.RESEARCH) {
      await this.suggestAlternativeResearchMethods(context, error);
    }
  }

  /**
   * Cleanup John's research resources
   */
  protected async onCleanup(): Promise<void> {
    this.researchHistory.clear();
    this.sourceDatabase.clear();
    this.factCheckCache.clear();
    this.researchMethods.clear();
  }

  /**
   * Handle configuration updates for research parameters
   */
  protected async onConfigUpdated(config: Partial<IBaseAgentConfig>): Promise<void> {
    console.log('John configuration updated - refreshing research parameters');
    await this.refreshResearchParameters();
  }

  /**
   * Handle John stopping
   */
  protected async onStop(): Promise<void> {
    console.log('John stopping - saving research state...');
    await this.saveResearchState();
  }

  /**
   * Update John's configuration
   */
  async updateConfiguration(config: Partial<IBaseAgentConfig>): Promise<void> {
    await this.onConfigUpdated(config);
  }

  /**
   * Get task-specific prompt for John
   */
  getTaskPrompt(taskType: TaskType): string {
    return JOHN_PROMPTS[taskType] || JOHN_PROMPTS.DEFAULT;
  }

  /**
   * Get John's specialization
   */
  getSpecialization(): string {
    return 'Research & Information Analysis';
  }

  /**
   * Get John's role
   */
  getRole(): string {
    return 'Research Specialist & Information Analyst';
  }

  /**
   * Get available task types for John
   */
  getAvailableTaskTypes(): TaskType[] {
    return [
      TaskType.RESEARCH,
      TaskType.FACT_CHECKING,
      TaskType.INFORMATION_SYNTHESIS,
      TaskType.COMPETITIVE_ANALYSIS,
      TaskType.MARKET_RESEARCH
    ];
  }

  /**
   * Get task examples for John
   */
  getTaskExamples(taskType?: TaskType): string[] {
    const examples: Partial<Record<TaskType, string[]>> = {
      [TaskType.RESEARCH]: [
        'Research market trends in renewable energy sector',
        'Investigate best practices for remote team management',
        'Analyze competitor strategies in the fintech industry',
        'Study the impact of AI on healthcare outcomes',
        'Research regulatory requirements for data privacy'
      ],
      [TaskType.FACT_CHECKING]: [
        'Verify claims about climate change statistics',
        'Fact-check financial data in quarterly reports',
        'Validate technical specifications of products',
        'Confirm historical events and dates',
        'Verify scientific study results and methodology'
      ],
      [TaskType.INFORMATION_SYNTHESIS]: [
        'Synthesize research from multiple academic papers',
        'Combine market research from various sources',
        'Create comprehensive industry overview',
        'Merge technical documentation into user guide',
        'Consolidate expert opinions on emerging trends'
      ],
      [TaskType.COMPETITIVE_ANALYSIS]: [
        'Analyze competitor product features and pricing',
        'Research competitor marketing strategies',
        'Compare industry benchmarks and performance',
        'Study competitor customer reviews and feedback',
        'Investigate competitor partnerships and alliances'
      ],
      [TaskType.MARKET_RESEARCH]: [
        'Research target market demographics and preferences',
        'Analyze market size and growth potential',
        'Study consumer behavior and buying patterns',
        'Research pricing strategies and market positioning',
        'Investigate market entry barriers and opportunities'
      ]
    };
    
    if (taskType) {
      return examples[taskType] || [];
    }
    
    // Return all examples if no specific task type requested
    return Object.values(examples).flat();
  }

  /**
   * Validate if John can execute a specific research task
   */
  async validateTaskExecution(
    taskType: TaskType,
    context: IAgentContext
  ): Promise<boolean> {
    const supportedTasks = [
      TaskType.RESEARCH,
      TaskType.FACT_CHECKING,
      TaskType.INFORMATION_SYNTHESIS,
      TaskType.COMPETITIVE_ANALYSIS,
      TaskType.MARKET_RESEARCH
    ];
    
    if (!supportedTasks.includes(taskType)) {
      return false;
    }

    // Additional validation for research-specific requirements
    if (taskType === TaskType.RESEARCH) {
      return await this.validateResearchRequirements(context);
    }

    return true;
  }

  /**
   * Get recommended next actions after research
   */
  getRecommendedNextActions(
    taskType: TaskType,
    result: IAgentResponse
  ): TaskType[] {
    switch (taskType) {
      case TaskType.RESEARCH:
        return [TaskType.INFORMATION_SYNTHESIS, TaskType.FACT_CHECKING, TaskType.REPORTING];
      case TaskType.FACT_CHECKING:
        return [TaskType.REPORTING, TaskType.DECISION_MAKING];
      case TaskType.INFORMATION_SYNTHESIS:
        return [TaskType.REPORTING, TaskType.CONTENT_CREATION];
      case TaskType.COMPETITIVE_ANALYSIS:
        return [TaskType.MARKET_RESEARCH, TaskType.STRATEGIC_PLANNING];
      case TaskType.MARKET_RESEARCH:
        return [TaskType.COMPETITIVE_ANALYSIS, TaskType.STRATEGIC_PLANNING];
      default:
        return [TaskType.RESEARCH];
    }
  }

  /**
   * Get John's confidence level for different research tasks
   */
  getTaskConfidence(taskType: TaskType): number {
    const confidenceMap: Record<string, number> = {
      research: 0.95,
      'fact-checking': 0.90,
      'information-synthesis': 0.88,
      'competitive-analysis': 0.85,
      'market-research': 0.87
    };
    
    return confidenceMap[taskType] || 0.5;
  }

  /**
   * Get current research workload
   */
  getCurrentWorkload(): number {
    const activeResearch = this.researchHistory.size;
    const cacheSize = this.factCheckCache.size;
    const maxCapacity = 15; // Configurable based on research complexity
    
    return Math.min(((activeResearch + cacheSize) / maxCapacity) * 100, 100);
  }

  /**
   * Check if John is available for new research tasks
   */
  isAvailable(): boolean {
    return this.getCurrentWorkload() < 80; // Available if under 80% load
  }

  /**
   * Get John's priority level
   */
  getPriority(): number {
    return 7; // High priority for research tasks
  }

  /**
   * Get John's collaboration preferences
   */
  getCollaborationPreferences(): {
    preferredPartners: string[];
    canWorkAlone: boolean;
    requiresSupervision: boolean;
  } {
    return {
      preferredPartners: ['Master Assistant', 'Mary', 'Fred'], // Works well with coordination, data analysis, and content creation
      canWorkAlone: true,
      requiresSupervision: false
    };
  }

  /**
   * Perform comprehensive research on a topic
   */
  async performResearch(
    topic: string,
    researchType: string,
    parameters?: {
      depth?: 'shallow' | 'moderate' | 'deep';
      sources?: string[];
      timeframe?: string;
      focus?: string[];
    }
  ): Promise<{
    summary: string;
    keyFindings: string[];
    sources: any[];
    recommendations: string[];
    relatedTopics?: string[];
  }> {
    // Simulate comprehensive research
    const research = {
      summary: await this.generateResearchSummary(topic, researchType),
      keyFindings: await this.extractKeyFindings(topic, researchType),
      sources: await this.gatherSources(topic, parameters?.sources),
      recommendations: await this.generateResearchRecommendations(topic),
      relatedTopics: await this.identifyRelatedTopics(topic)
    };

    // Cache results for future reference
    const cacheKey = this.generateResearchCacheKey(topic, researchType, parameters);
    this.sourceDatabase.set(cacheKey, research);

    return research;
  }

  /**
   * Fact-check information and claims
   */
  async factCheck(
    claims: string[],
    context?: string
  ): Promise<{
    results: Array<{
      claim: string;
      verdict: 'true' | 'false' | 'partially_true' | 'unverified';
      confidence: number;
      sources: any[];
      explanation: string;
    }>;
    overallReliability: number;
  }> {
    const results = [];
    let totalConfidence = 0;

    for (const claim of claims) {
      const factCheckResult = await this.checkSingleFact(claim, context);
      results.push(factCheckResult);
      totalConfidence += factCheckResult.confidence;
    }

    return {
      results,
      overallReliability: claims.length > 0 ? totalConfidence / claims.length : 0
    };
  }

  /**
   * Synthesize information from multiple sources
   */
  async synthesizeInformation(
    sources: any[],
    synthesisGoal: string
  ): Promise<{
    synthesis: string;
    keyThemes: string[];
    conflictingViews: string[];
    gaps: string[];
    confidence: number;
  }> {
    // Simulate information synthesis
    return {
      synthesis: await this.createSynthesis(sources, synthesisGoal),
      keyThemes: await this.identifyKeyThemes(sources),
      conflictingViews: await this.identifyConflicts(sources),
      gaps: await this.identifyKnowledgeGaps(sources, synthesisGoal),
      confidence: await this.calculateSynthesisConfidence(sources)
    };
  }

  /**
   * Get research history for a session
   */
  getResearchHistory(sessionId: string): any[] {
    return this.researchHistory.get(sessionId) || [];
  }

  /**
   * Get available research methods
   */
  getAvailableResearchMethods(): string[] {
    return Array.from(this.researchMethods.keys());
  }

  /**
   * Validate source credibility
   */
  async validateSourceCredibility(source: any): Promise<{
    credibilityScore: number;
    factors: string[];
    recommendations: string[];
  }> {
    // Simulate source credibility validation
    return {
      credibilityScore: 0.8,
      factors: ['Peer-reviewed publication', 'Established author', 'Recent publication date'],
      recommendations: ['Cross-reference with additional sources', 'Verify methodology']
    };
  }

  // Private helper methods

  /**
   * Load research methods and techniques
   */
  private async loadResearchMethods(): Promise<void> {
    this.researchMethods.set('systematic_review', {});
    this.researchMethods.set('meta_analysis', {});
    this.researchMethods.set('case_study', {});
    this.researchMethods.set('survey_research', {});
    this.researchMethods.set('content_analysis', {});
  }

  /**
   * Setup information sources
   */
  private async setupInformationSources(): Promise<void> {
    console.log('Setting up information sources and databases...');
  }

  /**
   * Initialize fact-checking tools
   */
  private async initializeFactCheckingTools(): Promise<void> {
    console.log('Initializing fact-checking tools and databases...');
  }

  /**
   * Extract sources from research content
   */
  private extractSources(content: string): any[] {
    // Extract and parse source references
    return [];
  }

  /**
   * Update source reliability based on successful research
   */
  private async updateSourceReliability(
    context: IAgentContext,
    response: IAgentResponse
  ): Promise<void> {
    console.log('Updating source reliability metrics');
  }

  /**
   * Suggest alternative research methods
   */
  private async suggestAlternativeResearchMethods(
    context: IAgentContext,
    error: Error
  ): Promise<void> {
    console.log('Suggesting alternative research approaches:', error.message);
  }

  /**
   * Refresh research parameters
   */
  private async refreshResearchParameters(): Promise<void> {
    console.log('Refreshing research parameters...');
  }

  /**
   * Save research state
   */
  private async saveResearchState(): Promise<void> {
    console.log('Saving research state...');
  }

  /**
   * Validate research requirements
   */
  private async validateResearchRequirements(
    context: IAgentContext
  ): Promise<boolean> {
    // Check if context contains necessary research parameters
    return true; // Simplified validation
  }

  /**
   * Generate research summary
   */
  private async generateResearchSummary(topic: string, researchType: string): Promise<string> {
    return `Comprehensive research summary on ${topic} using ${researchType} methodology.`;
  }

  /**
   * Extract key findings from research
   */
  private async extractKeyFindings(topic: string, researchType: string): Promise<string[]> {
    return [
      'Key finding 1 from research',
      'Important trend identified',
      'Critical insight discovered'
    ];
  }

  /**
   * Gather sources for research
   */
  private async gatherSources(topic: string, preferredSources?: string[]): Promise<any[]> {
    return [
      { type: 'academic', title: 'Research paper on topic', credibility: 0.9 },
      { type: 'industry', title: 'Industry report', credibility: 0.8 },
      { type: 'news', title: 'Recent news article', credibility: 0.7 }
    ];
  }

  /**
   * Generate research recommendations
   */
  private async generateResearchRecommendations(topic: string): Promise<string[]> {
    return [
      'Recommendation based on research findings',
      'Suggested next steps for investigation',
      'Areas requiring further research'
    ];
  }

  /**
   * Identify related topics
   */
  private async identifyRelatedTopics(topic: string): Promise<string[]> {
    return ['Related topic 1', 'Related topic 2', 'Related topic 3'];
  }

  /**
   * Generate research cache key
   */
  private generateResearchCacheKey(topic: string, researchType: string, parameters?: any): string {
    return `${topic}_${researchType}_${Date.now()}`;
  }

  /**
   * Check a single fact
   */
  private async checkSingleFact(claim: string, context?: string): Promise<any> {
    return {
      claim,
      verdict: 'true' as const,
      confidence: 0.85,
      sources: [],
      explanation: 'Fact-checking explanation'
    };
  }

  /**
   * Create synthesis from sources
   */
  private async createSynthesis(sources: any[], goal: string): Promise<string> {
    return 'Synthesized information from multiple sources';
  }

  /**
   * Identify key themes
   */
  private async identifyKeyThemes(sources: any[]): Promise<string[]> {
    return ['Theme 1', 'Theme 2', 'Theme 3'];
  }

  /**
   * Identify conflicting views
   */
  private async identifyConflicts(sources: any[]): Promise<string[]> {
    return ['Conflicting view 1', 'Disagreement on methodology'];
  }

  /**
   * Identify knowledge gaps
   */
  private async identifyKnowledgeGaps(sources: any[], goal: string): Promise<string[]> {
    return ['Gap in current research', 'Area needing more investigation'];
  }

  /**
   * Calculate synthesis confidence
   */
  private async calculateSynthesisConfidence(sources: any[]): Promise<number> {
    return 0.8; // Based on source quality and agreement
  }
}