# Agent Flow - Agents Library

A comprehensive TypeScript/NestJS library for managing specialized AI agents with distinct capabilities and expertise areas.

## Overview

The Agents Library provides a robust framework for creating, managing, and orchestrating AI agents with specialized skills. Each agent is designed with specific expertise areas and can collaborate with other agents to solve complex tasks.

## Architecture

### Core Components

- **BaseAgent**: Abstract base class providing common functionality
- **AgentFactory**: Factory for creating agent instances
- **AgentRegistry**: Registry for managing agent lifecycle
- **AgentRouter**: Intelligent routing system for task distribution
- **MasterAssistant**: Orchestrator agent for complex multi-agent workflows

### Agent Types

The library includes several specialized agents:

#### 1. Mary - Data Analysis Specialist
**Expertise**: Data analysis, statistics, visualization, and reporting

**Capabilities**:
- Statistical analysis and modeling
- Data visualization and reporting
- Data quality assessment
- Predictive modeling
- Business intelligence

**Use Cases**:
- Analyzing sales data trends
- Creating statistical reports
- Building predictive models
- Data quality auditing
- Performance metrics analysis

#### 2. John - Research & Information Specialist
**Expertise**: Research, fact-checking, information synthesis

**Capabilities**:
- Comprehensive research methodologies
- Fact-checking and verification
- Information synthesis from multiple sources
- Competitive analysis
- Market research

**Use Cases**:
- Market research and analysis
- Competitive intelligence
- Academic research
- Fact-checking claims
- Information gathering

#### 3. Fred - Creative Content Specialist
**Expertise**: Creative writing, design concepts, marketing content

**Capabilities**:
- Content creation and copywriting
- Creative writing and storytelling
- Design concept development
- Brand messaging
- Marketing campaigns

**Use Cases**:
- Blog posts and articles
- Marketing copy
- Brand storytelling
- Social media content
- Creative campaigns

#### 4. Jane - Technical Implementation Specialist
**Expertise**: Software development, system architecture, technical problem-solving

**Capabilities**:
- Software development and coding
- System architecture design
- Technical problem-solving
- Code review and optimization
- DevOps and deployment

**Use Cases**:
- Building web applications
- System architecture design
- Code review and optimization
- Technical documentation
- Deployment automation

#### 5. Sarah - Communication & Coordination Specialist
**Expertise**: Communication, project management, team coordination

**Capabilities**:
- Project planning and management
- Team communication and coordination
- Stakeholder management
- Process optimization
- Meeting facilitation

#### 6. Bob - Quality Assurance Specialist
**Expertise**: Testing, quality control, process improvement

**Capabilities**:
- Test planning and execution
- Quality assurance processes
- Bug tracking and resolution
- Process improvement
- Compliance verification

## Quick Start

### Installation

```bash
npm install @agent-flow/agents
```

### Basic Usage

```typescript
import { AgentFactory, TaskType } from '@agent-flow/agents';

// Create a data analysis agent
const mary = AgentFactory.createAgent('mary');

// Execute a data analysis task
const result = await mary.executeTask({
  type: TaskType.DATA_ANALYSIS,
  description: 'Analyze sales data for Q4 trends',
  data: salesData,
  requirements: {
    analysisType: 'trend_analysis',
    timeframe: 'quarterly',
    metrics: ['revenue', 'growth_rate', 'customer_acquisition']
  }
});

console.log(result.insights);
```

### Multi-Agent Collaboration

```typescript
import { MasterAssistant, AgentRegistry } from '@agent-flow/agents';

// Initialize the master assistant
const master = new MasterAssistant();

// Register specialized agents
const registry = new AgentRegistry();
registry.registerAgent('mary', AgentFactory.createAgent('mary'));
registry.registerAgent('john', AgentFactory.createAgent('john'));
registry.registerAgent('fred', AgentFactory.createAgent('fred'));

// Execute complex task requiring multiple agents
const result = await master.executeComplexTask({
  description: 'Create a comprehensive market analysis report with recommendations',
  requirements: {
    research: 'Market trends and competitor analysis',
    analysis: 'Statistical analysis of market data',
    content: 'Professional report with executive summary'
  },
  agents: ['john', 'mary', 'fred']
});
```

## Agent Configuration

Each agent can be configured with specific settings:

```typescript
import { createMaryConfig, ANALYSIS_COMPLEXITY } from '@agent-flow/agents';

// Configure Mary for advanced data analysis
const maryConfig = createMaryConfig({
  analysisComplexity: ANALYSIS_COMPLEXITY.ADVANCED,
  maxDataPoints: 1000000,
  enableVisualization: true,
  statisticalModels: ['regression', 'clustering', 'time_series'],
  outputFormat: 'detailed_report'
});

const mary = AgentFactory.createAgent('mary', maryConfig);
```

## Task Types

The library supports various task types:

```typescript
enum TaskType {
  // Data & Analysis
  DATA_ANALYSIS = 'data_analysis',
  DATA_VISUALIZATION = 'data_visualization',
  STATISTICAL_MODELING = 'statistical_modeling',
  
  // Research & Information
  RESEARCH = 'research',
  FACT_CHECKING = 'fact_checking',
  INFORMATION_SYNTHESIS = 'information_synthesis',
  
  // Creative & Content
  CONTENT_CREATION = 'content_creation',
  CREATIVE_WRITING = 'creative_writing',
  DESIGN_CONCEPTS = 'design_concepts',
  
  // Technical & Development
  SOFTWARE_DEVELOPMENT = 'software_development',
  SYSTEM_ARCHITECTURE = 'system_architecture',
  TECHNICAL_PROBLEM_SOLVING = 'technical_problem_solving',
  
  // Communication & Management
  PROJECT_MANAGEMENT = 'project_management',
  TEAM_COORDINATION = 'team_coordination',
  STAKEHOLDER_COMMUNICATION = 'stakeholder_communication',
  
  // Quality & Testing
  TESTING = 'testing',
  QUALITY_ASSURANCE = 'quality_assurance',
  PROCESS_IMPROVEMENT = 'process_improvement'
}
```

## Advanced Features

### Agent Collaboration

Agents can collaborate on complex tasks:

```typescript
// Define collaboration workflow
const workflow = {
  steps: [
    { agent: 'john', task: 'research', dependencies: [] },
    { agent: 'mary', task: 'analysis', dependencies: ['research'] },
    { agent: 'fred', task: 'report', dependencies: ['research', 'analysis'] }
  ]
};

const result = await master.executeWorkflow(workflow);
```

### Custom Prompts

Each agent supports custom prompts for specific scenarios:

```typescript
import { JanePromptBuilder } from '@agent-flow/agents';

// Build custom technical prompt
const prompt = JanePromptBuilder.buildSoftwareDevelopmentPrompt(
  {
    features: ['User authentication', 'Data visualization', 'API integration'],
    userStories: ['As a user, I want to login securely'],
    acceptanceCriteria: ['Login must use OAuth 2.0'],
    technicalSpecs: { framework: 'NestJS', database: 'PostgreSQL' }
  },
  {
    timeline: '4 weeks',
    team: '3 developers',
    technology: ['TypeScript', 'NestJS', 'React', 'PostgreSQL']
  }
);
```

### Performance Monitoring

Monitor agent performance and optimize workflows:

```typescript
// Get agent performance metrics
const metrics = await mary.getPerformanceMetrics();
console.log(metrics.averageResponseTime);
console.log(metrics.successRate);
console.log(metrics.taskComplexityHandled);

// Optimize agent configuration based on metrics
if (metrics.averageResponseTime > 5000) {
  mary.updateConfiguration({
    maxConcurrentTasks: 2,
    cacheEnabled: true
  });
}
```

## Best Practices

### 1. Agent Selection
- Choose the right agent for each task based on expertise
- Consider task complexity and agent capabilities
- Use the MasterAssistant for multi-step workflows

### 2. Task Definition
- Provide clear, specific task descriptions
- Include all necessary context and requirements
- Define success criteria and expected outputs

### 3. Configuration
- Configure agents based on your specific use case
- Monitor performance and adjust settings as needed
- Use appropriate complexity levels for tasks

### 4. Error Handling
- Implement proper error handling for agent tasks
- Use retry mechanisms for transient failures
- Monitor agent health and availability

### 5. Collaboration
- Design workflows that leverage each agent's strengths
- Minimize dependencies between agents when possible
- Use the registry for efficient agent management

## API Reference

### BaseAgent

Base class for all agents providing common functionality.

```typescript
abstract class BaseAgent {
  abstract executeTask(task: AgentTask): Promise<AgentTaskResult>;
  abstract getSpecialization(): string;
  abstract getCapabilities(): string[];
  
  // Common methods
  updateConfiguration(config: Partial<AgentConfig>): void;
  getPerformanceMetrics(): Promise<PerformanceMetrics>;
  stop(): Promise<void>;
}
```

### AgentFactory

Factory for creating agent instances.

```typescript
class AgentFactory {
  static createAgent(type: string, config?: AgentConfig): BaseAgent;
  static getAvailableAgents(): string[];
  static validateConfig(type: string, config: AgentConfig): boolean;
}
```

### AgentRegistry

Registry for managing agent lifecycle.

```typescript
class AgentRegistry {
  registerAgent(id: string, agent: BaseAgent): void;
  unregisterAgent(id: string): void;
  getAgent(id: string): BaseAgent | undefined;
  getAllAgents(): Map<string, BaseAgent>;
  getAgentsByCapability(capability: string): BaseAgent[];
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Adding New Agents

1. Create agent class extending `BaseAgent`
2. Implement required abstract methods
3. Create configuration and prompts
4. Add tests and documentation
5. Register in the factory

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/agent-flow.git

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/agent-flow/issues)
- Documentation: [Full documentation](https://docs.agent-flow.com)
- Community: [Discord server](https://discord.gg/agent-flow)