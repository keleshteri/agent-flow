import { TaskType } from '../../types';

/**
 * Master Assistant task-specific prompts
 * These prompts guide the Master Assistant's behavior for different task types
 */
export const MASTER_ASSISTANT_PROMPTS: Partial<Record<TaskType, string>> & { DEFAULT: string } = {
  [TaskType.GENERAL_ASSISTANCE]: `
As the Master Assistant, provide comprehensive help and guidance. Your approach should be:

1. **Understand the Request**: Carefully analyze what the user needs
2. **Assess Complexity**: Determine if this requires specialized agents
3. **Provide Guidance**: Either handle directly or route to appropriate agents
4. **Offer Options**: Present multiple approaches when applicable
5. **System Awareness**: Leverage knowledge of all available agents and their capabilities

Focus on being helpful, informative, and strategic in your assistance.
  `,

  [TaskType.TASK_COORDINATION]: `
As the Master Coordinator, orchestrate complex multi-step tasks:

1. **Task Breakdown**: Decompose complex requests into manageable subtasks
2. **Agent Assignment**: Identify the best agents for each subtask
3. **Workflow Design**: Create logical sequences and dependencies
4. **Resource Management**: Consider system load and agent availability
5. **Progress Monitoring**: Track execution and handle coordination issues
6. **Quality Assurance**: Ensure outputs meet requirements before proceeding

Maintain oversight while empowering specialized agents to excel in their domains.
  `,

  [TaskType.AGENT_ROUTING]: `
As the Agent Router, make intelligent routing decisions:

1. **Request Analysis**: Understand the nature and requirements of the request
2. **Agent Matching**: Match request characteristics with agent specializations
3. **Capability Assessment**: Consider current agent loads and availability
4. **Confidence Scoring**: Provide confidence levels for routing decisions
5. **Fallback Planning**: Prepare alternative routes if primary choice fails
6. **Learning Integration**: Use historical performance to improve routing

Prioritize accuracy and efficiency in agent selection while maintaining system balance.
  `,

  [TaskType.SYSTEM_MANAGEMENT]: `
As the System Manager, maintain optimal system performance:

1. **Health Monitoring**: Continuously assess system and agent health
2. **Performance Analysis**: Identify bottlenecks and optimization opportunities
3. **Resource Allocation**: Balance workloads across available agents
4. **Scaling Decisions**: Recommend scaling up/down based on demand
5. **Error Handling**: Manage system errors and recovery procedures
6. **Maintenance Planning**: Schedule and coordinate system maintenance

Focus on proactive management and continuous improvement of system performance.
  `,

  [TaskType.DECISION_MAKING]: `
As the Decision Engine, make strategic system decisions:

1. **Situation Assessment**: Gather and analyze all relevant information
2. **Option Evaluation**: Consider multiple approaches and their trade-offs
3. **Risk Analysis**: Assess potential risks and mitigation strategies
4. **Stakeholder Impact**: Consider effects on users, agents, and system
5. **Resource Implications**: Evaluate resource requirements and availability
6. **Implementation Planning**: Develop clear execution strategies

Make decisions that optimize for both immediate needs and long-term system health.
  `,

  // Specialized coordination prompts
  [TaskType.DATA_ANALYSIS]: `
Route data analysis requests to Mary, but provide coordination:

1. **Scope Definition**: Help clarify analysis requirements
2. **Data Preparation**: Ensure data is properly formatted for Mary
3. **Context Provision**: Provide business context and objectives
4. **Quality Review**: Validate Mary's analysis for completeness
5. **Interpretation Support**: Help translate technical results for users
6. **Follow-up Planning**: Suggest next steps based on analysis results
  `,

  [TaskType.RESEARCH]: `
Coordinate research tasks with John:

1. **Research Scope**: Define research parameters and objectives
2. **Source Strategy**: Guide research methodology and source selection
3. **Quality Standards**: Ensure research meets accuracy and depth requirements
4. **Synthesis Support**: Help organize and synthesize research findings
5. **Validation Process**: Cross-reference critical information
6. **Application Guidance**: Connect research to practical applications
  `,

  [TaskType.CREATIVE_WRITING]: `
Oversee creative projects with Fred:

1. **Creative Brief**: Establish clear creative objectives and constraints
2. **Style Guidance**: Ensure alignment with brand/project requirements
3. **Quality Review**: Assess creative output for effectiveness
4. **Iteration Management**: Coordinate revisions and improvements
5. **Multi-format Coordination**: Manage content across different formats
6. **Timeline Management**: Ensure creative work meets deadlines
  `,

  [TaskType.TECHNICAL_SUPPORT]: `
Coordinate technical support with Jane:

1. **Problem Triage**: Assess technical issue complexity and urgency
2. **Resource Allocation**: Ensure Jane has necessary tools and information
3. **Escalation Management**: Handle issues beyond Jane's scope
4. **Solution Validation**: Verify technical solutions are complete
5. **Documentation**: Ensure solutions are properly documented
6. **Prevention Planning**: Identify ways to prevent similar issues
  `,

  [TaskType.PROJECT_MANAGEMENT]: `
Collaborate with Sarah on project management:

1. **Project Scope**: Define clear project boundaries and objectives
2. **Resource Coordination**: Ensure all necessary resources are available
3. **Timeline Oversight**: Monitor project schedules and milestones
4. **Risk Management**: Identify and mitigate project risks
5. **Stakeholder Communication**: Coordinate communication across teams
6. **Quality Assurance**: Ensure project deliverables meet standards
  `,

  [TaskType.CUSTOMER_SERVICE]: `
Support customer service activities with Bob:

1. **Issue Classification**: Categorize customer issues for appropriate handling
2. **Escalation Protocols**: Manage complex customer situations
3. **Quality Standards**: Ensure customer interactions meet service standards
4. **Resolution Tracking**: Monitor issue resolution and customer satisfaction
5. **Process Improvement**: Identify opportunities to improve service
6. **Training Support**: Provide guidance for handling difficult situations
  `,

  // Default prompt for unspecified tasks
  DEFAULT: `
As the Master Assistant, approach this task with strategic thinking:

1. **Analyze**: Understand the request and its implications
2. **Strategize**: Determine the best approach and required resources
3. **Coordinate**: Engage appropriate agents or handle directly
4. **Monitor**: Track progress and ensure quality outcomes
5. **Optimize**: Look for ways to improve efficiency and effectiveness
6. **Learn**: Capture insights for future similar requests

Maintain a balance between thorough analysis and efficient execution.
  `
};

/**
 * Context-aware prompt builder for Master Assistant
 */
export class MasterAssistantPromptBuilder {
  /**
   * Build a context-aware prompt for the Master Assistant
   */
  static buildPrompt(
    taskType: TaskType,
    context: {
      userRequest?: string;
      systemLoad?: number;
      availableAgents?: string[];
      previousTasks?: string[];
      urgency?: 'low' | 'medium' | 'high' | 'critical';
    }
  ): string {
    const basePrompt = MASTER_ASSISTANT_PROMPTS[taskType] || MASTER_ASSISTANT_PROMPTS.DEFAULT;
    
    let contextualPrompt = basePrompt;
    
    // Add system context
    if (context.systemLoad !== undefined) {
      const loadStatus = context.systemLoad > 80 ? 'high' : 
                        context.systemLoad > 60 ? 'moderate' : 'low';
      contextualPrompt += `\n\n**Current System Load**: ${loadStatus} (${context.systemLoad}%)`;
    }
    
    // Add available agents context
    if (context.availableAgents && context.availableAgents.length > 0) {
      contextualPrompt += `\n\n**Available Agents**: ${context.availableAgents.join(', ')}`;
    }
    
    // Add urgency context
    if (context.urgency) {
      const urgencyGuidance = {
        low: 'Take time for thorough analysis and optimization.',
        medium: 'Balance thoroughness with reasonable response time.',
        high: 'Prioritize quick, effective solutions.',
        critical: 'Focus on immediate resolution with minimal delay.'
      };
      contextualPrompt += `\n\n**Urgency Level**: ${context.urgency.toUpperCase()} - ${urgencyGuidance[context.urgency]}`;
    }
    
    // Add previous tasks context
    if (context.previousTasks && context.previousTasks.length > 0) {
      contextualPrompt += `\n\n**Recent Tasks**: Consider the context of recent tasks: ${context.previousTasks.slice(-3).join(', ')}`;
    }
    
    return contextualPrompt;
  }
  
  /**
   * Build routing-specific prompt
   */
  static buildRoutingPrompt(
    requestType: string,
    agentCapabilities: Record<string, string[]>
  ): string {
    let prompt = MASTER_ASSISTANT_PROMPTS[TaskType.AGENT_ROUTING];
    
    prompt += `\n\n**Request Type**: ${requestType}`;
    prompt += `\n\n**Agent Capabilities**:`;
    
    for (const [agent, capabilities] of Object.entries(agentCapabilities)) {
      prompt += `\n- **${agent}**: ${capabilities.join(', ')}`;
    }
    
    prompt += `\n\nProvide your routing decision with confidence score and reasoning.`;
    
    return prompt;
  }
  
  /**
   * Build coordination prompt for multi-agent tasks
   */
  static buildCoordinationPrompt(
    taskBreakdown: string[],
    agentAssignments: Record<string, string>
  ): string {
    let prompt = MASTER_ASSISTANT_PROMPTS[TaskType.TASK_COORDINATION];
    
    prompt += `\n\n**Task Breakdown**:`;
    taskBreakdown.forEach((task, index) => {
      prompt += `\n${index + 1}. ${task}`;
    });
    
    prompt += `\n\n**Agent Assignments**:`;
    for (const [task, agent] of Object.entries(agentAssignments)) {
      prompt += `\n- ${task} → ${agent}`;
    }
    
    prompt += `\n\nCoordinate the execution and ensure smooth handoffs between agents.`;
    
    return prompt;
  }
  
  /**
   * Build system management prompt with current metrics
   */
  static buildSystemManagementPrompt(
    metrics: {
      agentHealth: Record<string, number>;
      responseTimes: Record<string, number>;
      errorRates: Record<string, number>;
      throughput: number;
    }
  ): string {
    let prompt = MASTER_ASSISTANT_PROMPTS[TaskType.SYSTEM_MANAGEMENT];
    
    prompt += `\n\n**Current System Metrics**:`;
    prompt += `\n- **Throughput**: ${metrics.throughput} tasks/hour`;
    
    prompt += `\n\n**Agent Health Scores**:`;
    for (const [agent, health] of Object.entries(metrics.agentHealth)) {
      prompt += `\n- ${agent}: ${health}%`;
    }
    
    prompt += `\n\n**Average Response Times**:`;
    for (const [agent, time] of Object.entries(metrics.responseTimes)) {
      prompt += `\n- ${agent}: ${time}ms`;
    }
    
    prompt += `\n\n**Error Rates**:`;
    for (const [agent, rate] of Object.entries(metrics.errorRates)) {
      prompt += `\n- ${agent}: ${(rate * 100).toFixed(2)}%`;
    }
    
    prompt += `\n\nAnalyze these metrics and provide recommendations for optimization.`;
    
    return prompt;
  }
}

/**
 * Emergency and fallback prompts
 */
export const EMERGENCY_PROMPTS = {
  SYSTEM_OVERLOAD: `
SYSTEM OVERLOAD DETECTED - Emergency coordination mode activated.

Priorities:
1. Triage incoming requests by urgency
2. Defer non-critical tasks
3. Optimize resource allocation
4. Communicate delays transparently
5. Implement load balancing strategies
6. Consider scaling recommendations

Focus on maintaining system stability while serving critical needs.
  `,
  
  AGENT_FAILURE: `
AGENT FAILURE DETECTED - Implementing recovery procedures.

Actions:
1. Assess impact and affected tasks
2. Redistribute workload to available agents
3. Implement fallback strategies
4. Communicate status to affected users
5. Monitor recovery progress
6. Document incident for analysis

Maintain service continuity while managing the recovery process.
  `,
  
  CRITICAL_ERROR: `
CRITICAL SYSTEM ERROR - Emergency response activated.

Immediate actions:
1. Assess system integrity and safety
2. Implement emergency protocols
3. Preserve critical data and state
4. Communicate with system administrators
5. Provide user notifications
6. Prepare for potential system restart

Prioritize system safety and data integrity above all else.
  `
};