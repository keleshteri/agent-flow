import { AgentType, TaskType } from '../../types';
import { IBaseAgentConfig } from '../base/base-agent.interface';
import { BaseAgentConfigBuilder } from '../base/base-agent.config';

/**
 * Mary Agent Configuration
 * Specialized for data analysis and statistical computing
 */
export const MARY_CONFIG: IBaseAgentConfig = new BaseAgentConfigBuilder()
  .setBasicInfo(
    'Mary',
    AgentType.MARY,
    'Data Analysis & Statistics Expert specializing in data processing, statistical analysis, visualization, and insights generation.'
  )
  .setRole(
    'Data Analysis & Statistical Computing',
    'Data Scientist & Analytics Expert'
  )
  .setAvailableTasks([
    TaskType.DATA_ANALYSIS,
    TaskType.DATA_VISUALIZATION,
    TaskType.STATISTICAL_MODELING,
    TaskType.DATA_PROCESSING,
    TaskType.REPORTING
  ])
  .setSystemPrompt(`
You are Mary, a highly skilled Data Analysis & Statistics Expert. Your expertise includes:

**Core Competencies:**
- Statistical analysis and hypothesis testing
- Data cleaning, preprocessing, and transformation
- Predictive modeling and machine learning
- Data visualization and dashboard creation
- Business intelligence and reporting
- Time series analysis and forecasting
- A/B testing and experimental design

**Technical Skills:**
- Descriptive and inferential statistics
- Regression analysis (linear, logistic, polynomial)
- Classification and clustering algorithms
- Correlation and causation analysis
- Outlier detection and anomaly analysis
- Data quality assessment and validation
- Statistical significance testing

**Analysis Approach:**
1. **Data Understanding**: Thoroughly examine data structure, quality, and characteristics
2. **Exploratory Analysis**: Identify patterns, trends, and relationships
3. **Statistical Testing**: Apply appropriate statistical methods and tests
4. **Model Development**: Build and validate predictive models when needed
5. **Insight Generation**: Extract actionable insights from analysis results
6. **Visualization**: Create clear, informative charts and dashboards
7. **Reporting**: Communicate findings in business-friendly language

**Communication Style:**
- Precise and data-driven
- Clear explanations of statistical concepts
- Visual representations when helpful
- Actionable recommendations based on evidence
- Transparent about limitations and assumptions

**Quality Standards:**
- Validate data quality before analysis
- Use appropriate statistical methods
- Check assumptions and test significance
- Provide confidence intervals and error margins
- Document methodology and limitations
- Ensure reproducible results

Always prioritize accuracy, statistical rigor, and practical applicability in your analyses.
  `)
  .setModelParams(0.3, 3000) // Lower temperature for precision, higher tokens for detailed analysis
  .setPriority(8, 3) // High priority, can handle multiple analyses
  .setTaskConfidence({
    [TaskType.DATA_ANALYSIS]: 0.95,
    [TaskType.STATISTICAL_MODELING]: 0.9,
    [TaskType.DATA_PROCESSING]: 0.9,
    [TaskType.DATA_VISUALIZATION]: 0.85,
    [TaskType.REPORTING]: 0.8
  })
  .setCollaboration(
    ['Master Assistant', 'Sarah', 'John'], // Works well with coordination, project management, and research
    true, // Can work alone
    false // Does not require supervision
  )
  .setPerformance(
    45000, // 45 seconds max response time for complex analysis
    0.92, // 92% minimum accuracy
    0.03 // 3% maximum error rate
  )
  // Tools will be configured at runtime
  // .setTools([])
  .build();

/**
 * Mary-specific configuration options
 */
export const MARY_SETTINGS = {
  // Data analysis preferences
  analysis: {
    defaultSignificanceLevel: 0.05,
    confidenceInterval: 0.95,
    maxDatasetSize: 1000000, // 1M records
    autoOutlierDetection: true,
    defaultSamplingMethod: 'random',
    enableCaching: true,
    cacheExpirationHours: 24
  },
  
  // Statistical modeling settings
  modeling: {
    defaultTrainTestSplit: 0.8,
    crossValidationFolds: 5,
    maxModelComplexity: 'medium',
    autoFeatureSelection: true,
    enableEnsembleMethods: true,
    modelValidationMetrics: ['accuracy', 'precision', 'recall', 'f1']
  },
  
  // Visualization preferences
  visualization: {
    defaultChartLibrary: 'plotly',
    colorPalette: 'professional',
    interactiveCharts: true,
    exportFormats: ['png', 'svg', 'html'],
    maxDataPointsPerChart: 10000,
    autoAxisScaling: true
  },
  
  // Data processing settings
  processing: {
    missingValueStrategy: 'smart_imputation',
    outlierHandling: 'flag_and_analyze',
    dataTypeInference: true,
    autoDataCleaning: false, // Require explicit approval
    encodingDetection: true,
    memoryOptimization: true
  },
  
  // Reporting configuration
  reporting: {
    includeMethodology: true,
    includeAssumptions: true,
    includeLimitations: true,
    businessFriendlyLanguage: true,
    includeVisualizations: true,
    exportFormats: ['pdf', 'html', 'docx'],
    templateStyle: 'professional'
  },
  
  // Quality assurance
  quality: {
    dataQualityThreshold: 0.8,
    minimumSampleSize: 30,
    statisticalPowerThreshold: 0.8,
    effectSizeThreshold: 0.2,
    validateAssumptions: true,
    requireSignificanceTesting: true
  },
  
  // Performance optimization
  performance: {
    enableParallelProcessing: true,
    maxConcurrentAnalyses: 3,
    memoryLimitMB: 2048,
    timeoutMinutes: 30,
    enableProgressTracking: true,
    optimizeForSpeed: false // Prioritize accuracy over speed
  }
};

/**
 * Validation rules specific to Mary
 */
export const MARY_VALIDATION = {
  /**
   * Validate Mary-specific configuration
   */
  validateConfig(config: IBaseAgentConfig): boolean {
    // Must be Mary agent type
    if (config.type !== AgentType.MARY) {
      return false;
    }
    
    // Must support core data analysis tasks
    const requiredTasks = [
      TaskType.DATA_ANALYSIS,
      TaskType.DATA_PROCESSING
    ];
    
    const hasRequiredTasks = requiredTasks.every(task => 
      config.availableTasks.includes(task)
    );
    
    if (!hasRequiredTasks) {
      return false;
    }
    
    // Should have high accuracy requirements
    if (config.performance && config.performance.minAccuracy < 0.9) {
      return false;
    }
    
    // Should have lower temperature for precision
    if (config.temperature > 0.5) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Get configuration recommendations for Mary
   */
  getRecommendations(config: IBaseAgentConfig): string[] {
    const recommendations: string[] = [];
    
    if (config.temperature > 0.3) {
      recommendations.push('Lower temperature (≤0.3) recommended for precise data analysis');
    }
    
    if (config.maxTokens < 2500) {
      recommendations.push('Increase maxTokens to 2500+ for detailed analysis reports');
    }
    
    if (!config.availableTasks.includes(TaskType.DATA_VISUALIZATION)) {
      recommendations.push('Add DATA_VISUALIZATION task for comprehensive analysis');
    }
    
    if (!config.availableTasks.includes(TaskType.STATISTICAL_MODELING)) {
      recommendations.push('Add STATISTICAL_MODELING task for advanced analytics');
    }
    
    if (config.performance && config.performance.maxResponseTime < 30000) {
      recommendations.push('Increase response time limit for complex analyses');
    }
    
    return recommendations;
  },
  
  /**
   * Validate data analysis request
   */
  validateAnalysisRequest(request: {
    dataSize?: number;
    analysisType?: string;
    timeConstraint?: number;
    qualityRequirement?: number;
  }): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check data size limits
    if (request.dataSize && request.dataSize > MARY_SETTINGS.analysis.maxDatasetSize) {
      issues.push(`Dataset size (${request.dataSize}) exceeds maximum limit`);
      recommendations.push('Consider data sampling or chunked processing');
    }
    
    // Check time constraints
    if (request.timeConstraint && request.timeConstraint < 30000) {
      issues.push('Time constraint too tight for thorough analysis');
      recommendations.push('Allow at least 30 seconds for quality analysis');
    }
    
    // Check quality requirements
    if (request.qualityRequirement && request.qualityRequirement > 0.95) {
      recommendations.push('Very high quality requirement - expect longer processing time');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }
};

/**
 * Factory function to create Mary configuration
 */
export function createMaryConfig(
  overrides?: Partial<IBaseAgentConfig>
): IBaseAgentConfig {
  if (overrides) {
    return {
      ...MARY_CONFIG,
      ...overrides,
      // Ensure critical properties are not overridden
      type: AgentType.MARY,
      availableTasks: [
        ...MARY_CONFIG.availableTasks,
        ...(overrides.availableTasks || [])
      ]
    };
  }
  
  return { ...MARY_CONFIG };
}

/**
 * Analysis complexity levels for Mary
 */
export const ANALYSIS_COMPLEXITY = {
  SIMPLE: {
    name: 'Simple Analysis',
    description: 'Basic descriptive statistics and simple visualizations',
    estimatedTime: 15000, // 15 seconds
    maxDataPoints: 10000,
    techniques: ['descriptive_stats', 'basic_charts']
  },
  
  INTERMEDIATE: {
    name: 'Intermediate Analysis',
    description: 'Statistical testing, correlation analysis, and advanced visualizations',
    estimatedTime: 45000, // 45 seconds
    maxDataPoints: 100000,
    techniques: ['hypothesis_testing', 'correlation', 'regression', 'advanced_charts']
  },
  
  ADVANCED: {
    name: 'Advanced Analysis',
    description: 'Machine learning, predictive modeling, and comprehensive reporting',
    estimatedTime: 120000, // 2 minutes
    maxDataPoints: 500000,
    techniques: ['ml_models', 'feature_engineering', 'model_validation', 'ensemble_methods']
  },
  
  EXPERT: {
    name: 'Expert Analysis',
    description: 'Complex statistical modeling, time series analysis, and research-grade analysis',
    estimatedTime: 300000, // 5 minutes
    maxDataPoints: 1000000,
    techniques: ['advanced_modeling', 'time_series', 'causal_inference', 'experimental_design']
  }
};