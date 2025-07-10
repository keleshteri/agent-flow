import { AgentType, TaskType } from '../../types';
import { IBaseAgentConfig } from '../base/base-agent.interface';
import { BaseAgentConfigBuilder } from '../base/base-agent.config';

/**
 * John Agent Configuration
 * Specialized for research and information analysis
 */
export const JOHN_CONFIG: IBaseAgentConfig = new BaseAgentConfigBuilder()
  .setBasicInfo(
    'John',
    AgentType.JOHN,
    'Research & Information Specialist focused on comprehensive research, fact-checking, information synthesis, and knowledge analysis.'
  )
  .setRole(
    'Research & Information Analysis',
    'Research Specialist & Information Analyst'
  )
  .setAvailableTasks([
    TaskType.RESEARCH,
    TaskType.FACT_CHECKING,
    TaskType.INFORMATION_SYNTHESIS,
    TaskType.COMPETITIVE_ANALYSIS,
    TaskType.MARKET_RESEARCH
  ])
  .setSystemPrompt(`
You are John, a highly skilled Research & Information Specialist. Your expertise includes:

**Core Competencies:**
- Comprehensive research methodology and execution
- Information gathering from diverse sources
- Fact-checking and verification processes
- Information synthesis and analysis
- Competitive intelligence and market research
- Source credibility assessment
- Knowledge gap identification

**Research Methodologies:**
- Systematic literature reviews
- Primary and secondary research
- Qualitative and quantitative analysis
- Cross-referencing and triangulation
- Meta-analysis and synthesis
- Trend analysis and forecasting
- Comparative analysis

**Information Sources:**
- Academic journals and publications
- Industry reports and whitepapers
- Government databases and statistics
- News and media sources
- Expert interviews and surveys
- Company reports and filings
- Patent databases and technical documentation

**Research Process:**
1. **Scope Definition**: Clearly define research objectives and parameters
2. **Source Identification**: Identify relevant and credible information sources
3. **Data Collection**: Systematically gather information using appropriate methods
4. **Verification**: Fact-check and validate information accuracy
5. **Analysis**: Analyze patterns, trends, and relationships
6. **Synthesis**: Combine findings into coherent insights
7. **Documentation**: Properly cite sources and document methodology

**Quality Standards:**
- Use multiple credible sources for verification
- Apply critical thinking and analytical rigor
- Maintain objectivity and avoid bias
- Distinguish between facts and opinions
- Provide proper attribution and citations
- Acknowledge limitations and uncertainties
- Ensure information currency and relevance

**Communication Style:**
- Objective and evidence-based
- Clear structure and logical flow
- Comprehensive yet concise
- Proper source attribution
- Balanced presentation of different viewpoints
- Transparent about methodology and limitations

Always prioritize accuracy, thoroughness, and intellectual honesty in your research.
  `)
  .setModelParams(0.4, 3500) // Moderate temperature for balanced creativity and accuracy, high tokens for detailed research
  .setPriority(7, 4) // High priority, can handle multiple research projects
  .setTaskConfidence({
    [TaskType.RESEARCH]: 0.95,
    [TaskType.FACT_CHECKING]: 0.9,
    [TaskType.INFORMATION_SYNTHESIS]: 0.85,
    [TaskType.COMPETITIVE_ANALYSIS]: 0.8,
    [TaskType.MARKET_RESEARCH]: 0.8
  })
  .setCollaboration(
    ['Master Assistant', 'Mary', 'Fred'], // Works well with coordination, data analysis, and content creation
    true, // Can work alone
    false // Does not require supervision
  )
  .setPerformance(
    60000, // 60 seconds max response time for thorough research
    0.9, // 90% minimum accuracy
    0.05 // 5% maximum error rate
  )
  // Tools will be configured at runtime
  // .setTools([])
  .build();

/**
 * John-specific configuration options
 */
export const JOHN_SETTINGS = {
  // Research preferences
  research: {
    defaultDepth: 'moderate', // 'shallow', 'moderate', 'deep'
    maxSourcesPerTopic: 20,
    preferredSourceTypes: ['academic', 'industry', 'government', 'news'],
    minimumSourceCredibility: 0.7,
    enableCrossReferencing: true,
    factCheckingThreshold: 0.8,
    researchTimeoutMinutes: 30
  },
  
  // Source management
  sources: {
    credibilityWeights: {
      academic: 0.9,
      government: 0.85,
      industry: 0.8,
      news: 0.7,
      blog: 0.5,
      social: 0.3
    },
    recencyWeights: {
      current_year: 1.0,
      last_year: 0.9,
      two_years: 0.8,
      three_years: 0.7,
      older: 0.5
    },
    requireMultipleSources: true,
    minimumSourceAgreement: 0.7
  },
  
  // Fact-checking configuration
  factChecking: {
    confidenceThreshold: 0.8,
    requirePrimarySource: true,
    enableAutomaticVerification: true,
    crossReferenceCount: 3,
    flagControversialClaims: true,
    trackClaimHistory: true
  },
  
  // Information synthesis
  synthesis: {
    identifyConflicts: true,
    highlightGaps: true,
    extractKeyThemes: true,
    generateSummaries: true,
    createTimelines: true,
    buildConceptMaps: false
  },
  
  // Competitive analysis
  competitive: {
    trackCompetitorUpdates: true,
    analyzeMarketPosition: true,
    identifyTrends: true,
    benchmarkPerformance: true,
    monitorPricing: true,
    assessStrategies: true
  },
  
  // Market research
  market: {
    segmentAnalysis: true,
    trendIdentification: true,
    opportunityAssessment: true,
    riskAnalysis: true,
    forecastGeneration: true,
    stakeholderMapping: true
  },
  
  // Quality assurance
  quality: {
    minimumSourceCount: 3,
    requireSourceDiversity: true,
    validateMethodology: true,
    checkForBias: true,
    verifyStatistics: true,
    confirmQuotes: true
  },
  
  // Performance optimization
  performance: {
    enableCaching: true,
    cacheExpirationHours: 48,
    parallelResearch: true,
    maxConcurrentQueries: 5,
    prioritizeRecent: true,
    optimizeForAccuracy: true
  }
};

/**
 * Validation rules specific to John
 */
export const JOHN_VALIDATION = {
  /**
   * Validate John-specific configuration
   */
  validateConfig(config: IBaseAgentConfig): boolean {
    // Must be John agent type
    if (config.type !== AgentType.JOHN) {
      return false;
    }
    
    // Must support core research tasks
    const requiredTasks = [
      TaskType.RESEARCH,
      TaskType.FACT_CHECKING
    ];
    
    const hasRequiredTasks = requiredTasks.every(task => 
      config.availableTasks.includes(task)
    );
    
    if (!hasRequiredTasks) {
      return false;
    }
    
    // Should have high accuracy requirements
    if (config.performance && config.performance.minAccuracy < 0.85) {
      return false;
    }
    
    // Should have reasonable response time for research
    if (config.performance && config.performance.maxResponseTime < 30000) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Get configuration recommendations for John
   */
  getRecommendations(config: IBaseAgentConfig): string[] {
    const recommendations: string[] = [];
    
    if (config.temperature > 0.5) {
      recommendations.push('Lower temperature (≤0.5) recommended for objective research');
    }
    
    if (config.maxTokens < 3000) {
      recommendations.push('Increase maxTokens to 3000+ for comprehensive research reports');
    }
    
    if (!config.availableTasks.includes(TaskType.INFORMATION_SYNTHESIS)) {
      recommendations.push('Add INFORMATION_SYNTHESIS task for comprehensive analysis');
    }
    
    if (!config.availableTasks.includes(TaskType.COMPETITIVE_ANALYSIS)) {
      recommendations.push('Add COMPETITIVE_ANALYSIS task for market intelligence');
    }
    
    if (config.performance && config.performance.maxResponseTime < 45000) {
      recommendations.push('Increase response time limit for thorough research');
    }
    
    return recommendations;
  },
  
  /**
   * Validate research request
   */
  validateResearchRequest(request: {
    topic?: string;
    scope?: string;
    timeframe?: string;
    sourceTypes?: string[];
    depth?: string;
    urgency?: string;
  }): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check topic specificity
    if (!request.topic || request.topic.length < 10) {
      issues.push('Research topic too vague or short');
      recommendations.push('Provide more specific research topic and objectives');
    }
    
    // Check scope definition
    if (!request.scope) {
      recommendations.push('Define research scope for better focus');
    }
    
    // Check timeframe
    if (request.timeframe && request.timeframe === 'immediate') {
      recommendations.push('Immediate timeframe may compromise research quality');
    }
    
    // Check source diversity
    if (request.sourceTypes && request.sourceTypes.length < 2) {
      recommendations.push('Consider using multiple source types for comprehensive research');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }
};

/**
 * Factory function to create John configuration
 */
export function createJohnConfig(
  overrides?: Partial<IBaseAgentConfig>
): IBaseAgentConfig {
  if (overrides) {
    return {
      ...JOHN_CONFIG,
      ...overrides,
      // Ensure critical properties are not overridden
      type: AgentType.JOHN,
      availableTasks: [
        ...JOHN_CONFIG.availableTasks,
        ...(overrides.availableTasks || [])
      ]
    };
  }
  
  return { ...JOHN_CONFIG };
}

/**
 * Research complexity levels for John
 */
export const RESEARCH_COMPLEXITY = {
  SHALLOW: {
    name: 'Shallow Research',
    description: 'Quick overview with basic information gathering',
    estimatedTime: 30000, // 30 seconds
    maxSources: 5,
    techniques: ['web_search', 'basic_synthesis']
  },
  
  MODERATE: {
    name: 'Moderate Research',
    description: 'Comprehensive research with multiple sources and analysis',
    estimatedTime: 120000, // 2 minutes
    maxSources: 15,
    techniques: ['multi_source', 'fact_checking', 'synthesis', 'analysis']
  },
  
  DEEP: {
    name: 'Deep Research',
    description: 'Extensive research with thorough analysis and verification',
    estimatedTime: 300000, // 5 minutes
    maxSources: 25,
    techniques: ['systematic_review', 'expert_sources', 'cross_validation', 'trend_analysis']
  },
  
  EXPERT: {
    name: 'Expert Research',
    description: 'Academic-level research with comprehensive methodology',
    estimatedTime: 600000, // 10 minutes
    maxSources: 50,
    techniques: ['literature_review', 'meta_analysis', 'primary_research', 'peer_review']
  }
};

/**
 * Source credibility scoring system
 */
export const SOURCE_CREDIBILITY = {
  ACADEMIC: {
    baseScore: 0.9,
    factors: ['peer_review', 'citation_count', 'author_reputation', 'journal_impact']
  },
  
  GOVERNMENT: {
    baseScore: 0.85,
    factors: ['official_status', 'data_methodology', 'transparency', 'update_frequency']
  },
  
  INDUSTRY: {
    baseScore: 0.8,
    factors: ['company_reputation', 'methodology_disclosure', 'bias_assessment', 'expertise']
  },
  
  NEWS: {
    baseScore: 0.7,
    factors: ['outlet_reputation', 'journalist_expertise', 'source_attribution', 'fact_checking']
  },
  
  EXPERT: {
    baseScore: 0.75,
    factors: ['credentials', 'experience', 'track_record', 'independence']
  }
};