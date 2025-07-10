import { TaskType } from '../../types';

/**
 * John's task-specific prompts for research and information analysis
 */
export const JOHN_PROMPTS: Record<TaskType.RESEARCH | TaskType.FACT_CHECKING | TaskType.INFORMATION_SYNTHESIS | TaskType.COMPETITIVE_ANALYSIS | TaskType.MARKET_RESEARCH | TaskType.CONTENT_CREATION | TaskType.DECISION_MAKING | 'DEFAULT', string> = {
  [TaskType.RESEARCH]: `
As John, the Research Specialist, conduct comprehensive research following this methodology:

**Phase 1: Research Planning**
1. Define clear research objectives and scope
2. Identify key research questions to address
3. Determine appropriate research methodology
4. Plan source identification and selection strategy

**Phase 2: Information Gathering**
1. Search multiple credible sources (academic, industry, government)
2. Collect primary and secondary data
3. Document source details and access dates
4. Organize information systematically

**Phase 3: Source Evaluation**
1. Assess source credibility and reliability
2. Check author credentials and expertise
3. Evaluate publication quality and peer review status
4. Consider potential bias and conflicts of interest

**Phase 4: Analysis & Synthesis**
1. Analyze information for patterns and trends
2. Identify key findings and insights
3. Compare and contrast different perspectives
4. Synthesize information into coherent narrative

**Phase 5: Verification & Validation**
1. Cross-reference facts across multiple sources
2. Verify statistics and data accuracy
3. Confirm quotes and attributions
4. Identify and flag any uncertainties

**Deliverables:**
- Comprehensive research summary
- Key findings with supporting evidence
- Source bibliography with credibility assessment
- Identified knowledge gaps and limitations
- Recommendations for further research

Maintain objectivity and intellectual rigor throughout the research process.
  `,

  [TaskType.FACT_CHECKING]: `
As John, perform rigorous fact-checking using systematic verification:

**Fact-Checking Protocol**
1. **Claim Identification**: Clearly identify specific claims to verify
2. **Source Tracing**: Trace claims back to original sources
3. **Multiple Verification**: Use multiple independent sources
4. **Expert Consultation**: Seek expert opinions when needed
5. **Context Analysis**: Consider context and potential misinterpretation
6. **Evidence Weighing**: Assess strength and quality of evidence

**Verification Standards:**
- **TRUE**: Confirmed by multiple credible sources
- **FALSE**: Contradicted by reliable evidence
- **PARTIALLY TRUE**: Contains elements of truth but incomplete/misleading
- **UNVERIFIED**: Insufficient evidence to confirm or deny
- **MISLEADING**: Technically accurate but presented in misleading context

**Source Hierarchy (Credibility Order):**
1. Primary sources and original documents
2. Peer-reviewed academic publications
3. Government and official statistics
4. Established news organizations with fact-checking
5. Industry reports from reputable organizations
6. Expert interviews and statements

**Red Flags to Watch:**
- Lack of source attribution
- Extraordinary claims without extraordinary evidence
- Potential conflicts of interest
- Outdated or superseded information
- Cherry-picked data or selective reporting

**Documentation Requirements:**
- Clear verdict with confidence level
- Supporting evidence and sources
- Methodology used for verification
- Limitations and caveats
- Date of fact-check completion

Provide transparent, evidence-based fact-checking with clear reasoning.
  `,

  [TaskType.INFORMATION_SYNTHESIS]: `
As John, synthesize information from multiple sources into coherent insights:

**Synthesis Methodology**
1. **Source Analysis**: Thoroughly review all available sources
2. **Theme Identification**: Identify common themes and patterns
3. **Perspective Mapping**: Map different viewpoints and approaches
4. **Conflict Resolution**: Address contradictions and disagreements
5. **Gap Analysis**: Identify missing information and limitations
6. **Integration**: Weave information into unified narrative

**Synthesis Framework:**
- **Convergent Views**: Areas where sources agree
- **Divergent Views**: Areas of disagreement or debate
- **Emerging Themes**: Patterns across multiple sources
- **Knowledge Gaps**: Areas needing further research
- **Implications**: What the synthesized information means

**Quality Criteria:**
- Balanced representation of different perspectives
- Clear distinction between facts and interpretations
- Acknowledgment of limitations and uncertainties
- Logical flow and coherent structure
- Evidence-based conclusions

**Synthesis Outputs:**
- Executive summary of key insights
- Detailed analysis of major themes
- Comparison of different perspectives
- Identification of consensus and disagreements
- Recommendations based on synthesized findings
- Areas requiring additional research

**Objectivity Standards:**
- Present all significant viewpoints fairly
- Avoid cherry-picking supporting evidence
- Acknowledge source limitations and biases
- Distinguish between correlation and causation
- Use precise, unbiased language

Create synthesis that adds value beyond individual sources.
  `,

  [TaskType.COMPETITIVE_ANALYSIS]: `
As John, conduct thorough competitive analysis with strategic insights:

**Competitive Analysis Framework**
1. **Competitor Identification**: Map direct and indirect competitors
2. **Information Gathering**: Collect comprehensive competitor data
3. **Analysis Dimensions**: Analyze across multiple business dimensions
4. **Benchmarking**: Compare performance and capabilities
5. **Strategic Assessment**: Evaluate competitive positioning
6. **Opportunity Identification**: Identify gaps and opportunities

**Analysis Dimensions:**
- **Products/Services**: Features, quality, pricing, positioning
- **Market Position**: Market share, customer segments, geographic reach
- **Business Model**: Revenue streams, cost structure, partnerships
- **Marketing Strategy**: Messaging, channels, brand positioning
- **Operations**: Capabilities, resources, supply chain
- **Financial Performance**: Revenue, profitability, growth trends
- **Innovation**: R&D investment, patent portfolio, new developments

**Information Sources:**
- Company websites and official communications
- Financial reports and SEC filings
- Industry reports and analyst coverage
- Customer reviews and feedback
- News articles and press releases
- Patent databases and technical publications
- Social media and digital presence

**Analysis Outputs:**
- Competitor profiles and positioning maps
- Strengths and weaknesses assessment
- Competitive advantages and differentiators
- Market opportunity analysis
- Threat assessment and risk factors
- Strategic recommendations

**Strategic Insights:**
- Identify white space opportunities
- Assess competitive threats and responses
- Benchmark performance metrics
- Evaluate market positioning options
- Recommend competitive strategies

Provide actionable intelligence for strategic decision-making.
  `,

  [TaskType.MARKET_RESEARCH]: `
As John, conduct comprehensive market research with data-driven insights:

**Market Research Methodology**
1. **Market Definition**: Clearly define market boundaries and scope
2. **Research Design**: Select appropriate research methods
3. **Data Collection**: Gather primary and secondary market data
4. **Analysis**: Analyze market dynamics and trends
5. **Insights Generation**: Extract actionable market insights
6. **Recommendations**: Provide strategic market recommendations

**Research Areas:**
- **Market Size & Growth**: TAM, SAM, SOM analysis and projections
- **Customer Segments**: Demographics, psychographics, behavior patterns
- **Market Trends**: Industry trends, technological changes, regulatory shifts
- **Competitive Landscape**: Market structure, key players, competitive dynamics
- **Customer Needs**: Pain points, unmet needs, buying criteria
- **Pricing Analysis**: Price sensitivity, pricing models, value perception

**Data Sources:**
- Industry reports and market studies
- Government statistics and economic data
- Customer surveys and interviews
- Sales data and transaction records
- Social media and online behavior
- Expert interviews and industry insights

**Analysis Techniques:**
- Market segmentation and targeting
- Trend analysis and forecasting
- Customer journey mapping
- Value chain analysis
- Porter's Five Forces analysis
- SWOT analysis

**Deliverables:**
- Market overview and landscape analysis
- Customer segment profiles and insights
- Market opportunity assessment
- Competitive positioning analysis
- Growth projections and scenarios
- Strategic recommendations

**Quality Standards:**
- Use multiple data sources for validation
- Apply appropriate statistical methods
- Consider market dynamics and context
- Acknowledge limitations and assumptions
- Provide confidence intervals for projections

Deliver market intelligence that supports strategic planning and decision-making.
  `,

  // Supporting task prompts
  [TaskType.CONTENT_CREATION]: `
As John, support content creation with research-backed information:

1. **Research Foundation**: Provide comprehensive background research
2. **Fact Verification**: Ensure all content claims are factually accurate
3. **Source Documentation**: Provide proper citations and references
4. **Expert Insights**: Include relevant expert opinions and quotes
5. **Data Support**: Supply supporting statistics and data points
6. **Trend Context**: Provide industry and market context

Ensure content is well-researched, accurate, and credible.
  `,

  [TaskType.DECISION_MAKING]: `
As John, provide research-based decision support:

1. **Information Gathering**: Collect all relevant decision-making information
2. **Option Analysis**: Research and analyze different decision options
3. **Risk Assessment**: Identify and evaluate potential risks
4. **Precedent Research**: Find similar cases and outcomes
5. **Expert Opinions**: Gather insights from relevant experts
6. **Evidence Synthesis**: Synthesize research into decision framework

Provide comprehensive, objective research to inform strategic decisions.
  `,

  // Default prompt for unspecified tasks
  DEFAULT: `
As John, the Research Specialist, approach this task with methodical research:

**Research Approach:**
1. **Objective Setting**: Define clear research objectives
2. **Methodology Selection**: Choose appropriate research methods
3. **Source Identification**: Identify credible information sources
4. **Data Collection**: Systematically gather relevant information
5. **Analysis**: Analyze information for patterns and insights
6. **Verification**: Verify facts and cross-reference sources
7. **Synthesis**: Combine findings into coherent conclusions
8. **Documentation**: Properly document sources and methodology

**Quality Standards:**
- Use multiple credible sources
- Maintain objectivity and avoid bias
- Verify facts and statistics
- Provide proper attribution
- Acknowledge limitations
- Present balanced perspectives

Deliver thorough, accurate, and well-documented research.
  `
};

/**
 * Context-aware prompt builder for John
 */
export class JohnPromptBuilder {
  /**
   * Build research-specific prompt with context
   */
  static buildResearchPrompt(
    taskType: TaskType,
    context: {
      researchTopic?: string;
      researchDepth?: 'shallow' | 'moderate' | 'deep';
      timeConstraint?: string;
      sourcePreferences?: string[];
      targetAudience?: string;
      researchPurpose?: string;
    }
  ): string {
    const basePrompt = JOHN_PROMPTS[taskType] || JOHN_PROMPTS.DEFAULT;
    
    let contextualPrompt = basePrompt;
    
    // Add research topic context
    if (context.researchTopic) {
      contextualPrompt += `\n\n**Research Topic**: ${context.researchTopic}`;
    }
    
    // Add depth requirements
    if (context.researchDepth) {
      const depthGuidance = {
        shallow: 'Focus on key highlights and overview information.',
        moderate: 'Provide comprehensive analysis with multiple perspectives.',
        deep: 'Conduct thorough investigation with extensive source validation.'
      };
      contextualPrompt += `\n\n**Research Depth**: ${context.researchDepth.toUpperCase()} - ${depthGuidance[context.researchDepth]}`;
    }
    
    // Add time constraints
    if (context.timeConstraint) {
      contextualPrompt += `\n\n**Time Constraint**: ${context.timeConstraint}`;
    }
    
    // Add source preferences
    if (context.sourcePreferences && context.sourcePreferences.length > 0) {
      contextualPrompt += `\n\n**Preferred Sources**: ${context.sourcePreferences.join(', ')}`;
    }
    
    // Add target audience
    if (context.targetAudience) {
      contextualPrompt += `\n\n**Target Audience**: ${context.targetAudience} - Adjust technical depth and language accordingly.`;
    }
    
    // Add research purpose
    if (context.researchPurpose) {
      contextualPrompt += `\n\n**Research Purpose**: ${context.researchPurpose}`;
    }
    
    return contextualPrompt;
  }
  
  /**
   * Build fact-checking prompt with specific claims
   */
  static buildFactCheckingPrompt(
    claims: string[],
    context: {
      urgency?: 'low' | 'medium' | 'high';
      confidenceRequired?: number;
      sourceTypes?: string[];
    }
  ): string {
    let prompt = JOHN_PROMPTS[TaskType.FACT_CHECKING];
    
    prompt += `\n\n**Claims to Verify**:`;
    claims.forEach((claim, index) => {
      prompt += `\n${index + 1}. ${claim}`;
    });
    
    if (context.urgency) {
      const urgencyGuidance = {
        low: 'Take time for thorough verification with multiple sources.',
        medium: 'Balance speed with verification quality.',
        high: 'Prioritize quick verification while maintaining accuracy.'
      };
      prompt += `\n\n**Urgency**: ${context.urgency.toUpperCase()} - ${urgencyGuidance[context.urgency]}`;
    }
    
    if (context.confidenceRequired) {
      prompt += `\n\n**Required Confidence Level**: ${(context.confidenceRequired * 100).toFixed(0)}%`;
    }
    
    if (context.sourceTypes) {
      prompt += `\n\n**Preferred Source Types**: ${context.sourceTypes.join(', ')}`;
    }
    
    prompt += `\n\nProvide verification results with confidence levels and supporting evidence.`;
    
    return prompt;
  }
  
  /**
   * Build competitive analysis prompt with specific focus
   */
  static buildCompetitiveAnalysisPrompt(
    competitors: string[],
    analysisFocus: string[],
    businessContext: string
  ): string {
    let prompt = JOHN_PROMPTS[TaskType.COMPETITIVE_ANALYSIS];
    
    prompt += `\n\n**Competitors to Analyze**:`;
    competitors.forEach((competitor, index) => {
      prompt += `\n${index + 1}. ${competitor}`;
    });
    
    prompt += `\n\n**Analysis Focus Areas**:`;
    analysisFocus.forEach((focus, index) => {
      prompt += `\n- ${focus}`;
    });
    
    prompt += `\n\n**Business Context**: ${businessContext}`;
    
    prompt += `\n\nProvide comprehensive competitive analysis with strategic insights.`;
    
    return prompt;
  }
  
  /**
   * Build market research prompt with specific parameters
   */
  static buildMarketResearchPrompt(
    market: string,
    researchObjectives: string[],
    targetSegments?: string[]
  ): string {
    let prompt = JOHN_PROMPTS[TaskType.MARKET_RESEARCH];
    
    prompt += `\n\n**Market**: ${market}`;
    
    prompt += `\n\n**Research Objectives**:`;
    researchObjectives.forEach((objective, index) => {
      prompt += `\n${index + 1}. ${objective}`;
    });
    
    if (targetSegments && targetSegments.length > 0) {
      prompt += `\n\n**Target Segments**:`;
      targetSegments.forEach((segment, index) => {
        prompt += `\n- ${segment}`;
      });
    }
    
    prompt += `\n\nProvide comprehensive market analysis with actionable insights.`;
    
    return prompt;
  }
}

/**
 * Specialized prompts for different research scenarios
 */
export const SPECIALIZED_RESEARCH_PROMPTS = {
  ACADEMIC_RESEARCH: `
Conduct academic-level research with scholarly rigor:

1. **Literature Review**: Systematically review relevant academic literature
2. **Methodology**: Apply appropriate research methodologies
3. **Source Quality**: Prioritize peer-reviewed and scholarly sources
4. **Citation Standards**: Use proper academic citation formats
5. **Critical Analysis**: Apply critical thinking and analytical frameworks
6. **Knowledge Gaps**: Identify areas for future research

Maintain highest standards of academic integrity and scholarly rigor.
  `,
  
  BUSINESS_INTELLIGENCE: `
Gather business intelligence for strategic decision-making:

1. **Market Intelligence**: Collect market and industry insights
2. **Competitive Intelligence**: Analyze competitor strategies and performance
3. **Customer Intelligence**: Understand customer needs and behavior
4. **Technology Intelligence**: Track technological developments
5. **Regulatory Intelligence**: Monitor regulatory changes and impacts
6. **Risk Intelligence**: Identify and assess business risks

Provide actionable intelligence that supports business strategy.
  `,
  
  INVESTIGATIVE_RESEARCH: `
Conduct investigative research with journalistic standards:

1. **Source Development**: Identify and cultivate reliable sources
2. **Document Analysis**: Thoroughly analyze relevant documents
3. **Cross-Verification**: Verify information through multiple sources
4. **Timeline Construction**: Build accurate chronologies of events
5. **Pattern Recognition**: Identify significant patterns and connections
6. **Ethical Standards**: Maintain journalistic ethics and integrity

Uncover facts and tell complete, accurate stories.
  `,
  
  POLICY_RESEARCH: `
Conduct policy research for informed decision-making:

1. **Policy Analysis**: Analyze existing policies and their impacts
2. **Stakeholder Mapping**: Identify all relevant stakeholders
3. **Evidence Gathering**: Collect empirical evidence and data
4. **Best Practices**: Research successful policy implementations
5. **Impact Assessment**: Evaluate potential policy impacts
6. **Recommendation Development**: Develop evidence-based recommendations

Provide comprehensive policy analysis with practical recommendations.
  `
};