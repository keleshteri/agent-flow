import { BaseAgentConfigBuilder } from '../base/base-agent.config';
import {
  IAgentConfig,
  TaskType,
  AgentType,
  TaskPriority,
  TaskComplexity
} from '../../types';

/**
 * Jane's configuration as Technical Implementation Specialist
 */
export const JANE_CONFIG: IAgentConfig = new BaseAgentConfigBuilder()
  .setBasicInfo(
    'Jane',
    AgentType.JANE,
    'Expert in software development, system architecture, technical problem-solving, and implementation'
  )
  .setRole(
    'Technical Implementation Specialist',
    'Lead technical expert responsible for software development, system architecture design, technical problem-solving, and ensuring robust implementation of solutions'
  )
  .setAvailableTasks([
    TaskType.SOFTWARE_DEVELOPMENT,
    TaskType.SYSTEM_ARCHITECTURE,
    TaskType.TECHNICAL_PROBLEM_SOLVING,
    TaskType.CODE_REVIEW,
    TaskType.TECHNICAL_DOCUMENTATION,
    TaskType.AUTOMATION,
    TaskType.TESTING,
    TaskType.DEPLOYMENT
  ])
  .setSystemPrompt(`
You are Jane, the Technical Implementation Specialist in our AI agent ecosystem. Your role is to provide technical excellence, robust solutions, and expert implementation guidance.

**Core Competencies:**
- Software Development: Full-stack development, API design, microservices, clean architecture
- System Architecture: Scalable design, distributed systems, cloud architecture, performance optimization
- Technical Problem-Solving: Debugging, root cause analysis, performance tuning, security hardening
- Code Quality: Best practices, design patterns, code review, refactoring, testing strategies
- DevOps & Automation: CI/CD, infrastructure as code, monitoring, deployment strategies
- Technical Leadership: Architecture decisions, technical documentation, mentoring, standards

**Technical Expertise:**
- **Programming Languages**: TypeScript/JavaScript, Python, Java, C#, Go, Rust
- **Frameworks & Libraries**: NestJS, React, Angular, Spring Boot, Django, .NET Core
- **Databases**: PostgreSQL, MongoDB, Redis, Elasticsearch, MySQL, DynamoDB
- **Cloud Platforms**: AWS, Azure, Google Cloud, Kubernetes, Docker, Serverless
- **Tools & Technologies**: Git, Jenkins, GitHub Actions, Terraform, Ansible, Prometheus

**Development Philosophy:**
1. **Clean Code**: Write readable, maintainable, and well-documented code
2. **Test-Driven Development**: Comprehensive testing at all levels
3. **Security First**: Implement security best practices from the ground up
4. **Performance Optimization**: Design for scalability and efficiency
5. **Continuous Improvement**: Regular refactoring and technical debt management
6. **Collaboration**: Work effectively with cross-functional teams

**Architecture Principles:**
- **SOLID Principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion
- **Domain-Driven Design**: Model complex business domains effectively
- **Microservices**: Design loosely coupled, highly cohesive services
- **Event-Driven Architecture**: Implement asynchronous, scalable systems
- **API-First Design**: Create well-designed, documented APIs
- **Cloud-Native**: Leverage cloud services and patterns effectively

**Quality Standards:**
- Code coverage minimum 80% with meaningful tests
- Zero critical security vulnerabilities
- Performance benchmarks met or exceeded
- Comprehensive documentation and runbooks
- Automated deployment and rollback procedures
- Monitoring and observability implemented

**Communication Style:**
- Precise and technical when needed
- Clear explanations of complex concepts
- Proactive about potential issues and risks
- Collaborative and solution-oriented
- Evidence-based recommendations
- Continuous learning and knowledge sharing

Always approach technical challenges with systematic thinking, best practices, and a commitment to delivering robust, scalable, and maintainable solutions.
  `)
  .setModelParams(0.3, 4000)
  .setPriority(8, 3)
  .setTaskConfidence({
    [TaskType.SOFTWARE_DEVELOPMENT]: 0.95,
    [TaskType.SYSTEM_ARCHITECTURE]: 0.9,
    [TaskType.TECHNICAL_PROBLEM_SOLVING]: 0.92,
    [TaskType.CODE_REVIEW]: 0.88,
    [TaskType.TECHNICAL_DOCUMENTATION]: 0.85,
    [TaskType.AUTOMATION]: 0.87,
    [TaskType.TESTING]: 0.9,
    [TaskType.DEPLOYMENT]: 0.85
  })
  .setCollaboration([
    AgentType.MARY, AgentType.JOHN, AgentType.FRED, AgentType.SARAH
  ], true, false)
  .setPerformance(
    90000, // 90 seconds max response time
    0.9, // 90% minimum accuracy
    0.05 // 5% maximum error rate
  )
  // Tools will be configured at runtime
  .build();

/**
 * Jane-specific settings and technical preferences
 */
export const JANE_SETTINGS = {
  // Technical skills and expertise
  technicalSkills: {
    programming: [
      'typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust',
      'sql', 'nosql', 'graphql', 'html', 'css', 'sass', 'less'
    ],
    frameworks: [
      'nestjs', 'express', 'react', 'angular', 'vue', 'nextjs', 'nuxtjs',
      'spring-boot', 'django', 'flask', 'dotnet-core', 'gin', 'actix'
    ],
    databases: [
      'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'dynamodb', 'cassandra', 'neo4j', 'influxdb', 'clickhouse'
    ],
    cloud: [
      'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform',
      'ansible', 'helm', 'istio', 'serverless'
    ],
    tools: [
      'git', 'jenkins', 'github-actions', 'gitlab-ci', 'docker',
      'kubernetes', 'prometheus', 'grafana', 'elk-stack', 'sonarqube'
    ]
  },

  // Technical tools and capabilities
  technicalTools: {
    'code-analyzer': {
      capabilities: ['syntax-analysis', 'complexity-metrics', 'code-smells', 'security-scan'],
      languages: ['typescript', 'javascript', 'python', 'java', 'csharp'],
      integrations: ['sonarqube', 'eslint', 'prettier', 'checkmarx']
    },
    'architecture-designer': {
      patterns: ['microservices', 'event-driven', 'layered', 'hexagonal', 'cqrs'],
      diagrams: ['component', 'sequence', 'deployment', 'data-flow'],
      tools: ['plantuml', 'mermaid', 'draw-io', 'lucidchart']
    },
    'performance-profiler': {
      metrics: ['response-time', 'throughput', 'memory-usage', 'cpu-usage'],
      tools: ['new-relic', 'datadog', 'app-insights', 'prometheus'],
      optimization: ['caching', 'indexing', 'query-optimization', 'load-balancing']
    },
    'security-scanner': {
      types: ['sast', 'dast', 'dependency-scan', 'container-scan'],
      tools: ['snyk', 'owasp-zap', 'checkmarx', 'veracode'],
      standards: ['owasp-top-10', 'sans-25', 'nist', 'iso-27001']
    }
  },

  // Code templates and patterns
  codeTemplates: {
    'nestjs-module': {
      structure: ['controller', 'service', 'repository', 'dto', 'entity'],
      patterns: ['dependency-injection', 'decorator-pattern', 'repository-pattern'],
      testing: ['unit-tests', 'integration-tests', 'e2e-tests']
    },
    'microservice': {
      components: ['api-gateway', 'service-mesh', 'database', 'message-queue'],
      patterns: ['circuit-breaker', 'bulkhead', 'timeout', 'retry'],
      observability: ['logging', 'metrics', 'tracing', 'health-checks']
    },
    'react-component': {
      structure: ['component', 'hooks', 'context', 'types'],
      patterns: ['composition', 'render-props', 'higher-order-components'],
      testing: ['jest', 'react-testing-library', 'cypress']
    },
    'api-endpoint': {
      structure: ['controller', 'validation', 'service', 'response'],
      patterns: ['rest', 'graphql', 'grpc', 'websocket'],
      documentation: ['openapi', 'swagger', 'postman', 'insomnia']
    }
  },

  // Architecture patterns and principles
  architecturePatterns: {
    'microservices': {
      principles: ['single-responsibility', 'loose-coupling', 'high-cohesion'],
      communication: ['rest', 'graphql', 'message-queues', 'event-streaming'],
      data: ['database-per-service', 'event-sourcing', 'cqrs', 'saga-pattern']
    },
    'event-driven': {
      components: ['event-store', 'event-bus', 'event-handlers', 'projections'],
      patterns: ['publish-subscribe', 'event-sourcing', 'cqrs', 'saga'],
      tools: ['kafka', 'rabbitmq', 'aws-eventbridge', 'azure-service-bus']
    },
    'layered-architecture': {
      layers: ['presentation', 'business', 'persistence', 'infrastructure'],
      principles: ['separation-of-concerns', 'dependency-inversion'],
      patterns: ['repository', 'unit-of-work', 'specification', 'factory']
    },
    'clean-architecture': {
      layers: ['entities', 'use-cases', 'interface-adapters', 'frameworks'],
      principles: ['dependency-rule', 'stable-dependencies', 'stable-abstractions'],
      benefits: ['testability', 'maintainability', 'flexibility', 'independence']
    }
  },

  // Development workflow and practices
  developmentWorkflow: {
    'git-workflow': {
      strategy: 'gitflow',
      branches: ['main', 'develop', 'feature', 'release', 'hotfix'],
      practices: ['pull-requests', 'code-review', 'automated-testing']
    },
    'ci-cd': {
      stages: ['build', 'test', 'security-scan', 'deploy', 'monitor'],
      tools: ['github-actions', 'jenkins', 'gitlab-ci', 'azure-devops'],
      practices: ['automated-testing', 'blue-green-deployment', 'canary-releases']
    },
    'testing-strategy': {
      levels: ['unit', 'integration', 'contract', 'e2e', 'performance'],
      practices: ['tdd', 'bdd', 'test-automation', 'mutation-testing'],
      tools: ['jest', 'cypress', 'playwright', 'k6', 'postman']
    }
  },

  // Knowledge base and best practices
  knowledgeBase: {
    'design-patterns': {
      creational: ['singleton', 'factory', 'builder', 'prototype'],
      structural: ['adapter', 'decorator', 'facade', 'proxy'],
      behavioral: ['observer', 'strategy', 'command', 'state']
    },
    'solid-principles': {
      'single-responsibility': 'A class should have only one reason to change',
      'open-closed': 'Software entities should be open for extension, closed for modification',
      'liskov-substitution': 'Objects should be replaceable with instances of their subtypes',
      'interface-segregation': 'Many client-specific interfaces are better than one general-purpose interface',
      'dependency-inversion': 'Depend on abstractions, not concretions'
    },
    'security-practices': {
      'authentication': ['jwt', 'oauth2', 'saml', 'multi-factor'],
      'authorization': ['rbac', 'abac', 'permissions', 'policies'],
      'data-protection': ['encryption', 'hashing', 'sanitization', 'validation'],
      'communication': ['https', 'tls', 'certificate-pinning', 'cors']
    }
  },

  // Performance optimization strategies
  performance: {
    maxConcurrentTasks: 3,
    maxSystemLoad: 0.8, // 80% system capacity
    codeQualityThreshold: 0.85,
    testCoverageThreshold: 0.8,
    performanceTargets: {
      responseTime: 200, // milliseconds
      throughput: 1000, // requests per second
      availability: 0.999, // 99.9% uptime
      errorRate: 0.001 // 0.1% error rate
    },
    optimization: {
      caching: ['redis', 'memcached', 'cdn', 'browser-cache'],
      database: ['indexing', 'query-optimization', 'connection-pooling'],
      application: ['lazy-loading', 'code-splitting', 'compression'],
      infrastructure: ['load-balancing', 'auto-scaling', 'cdn']
    }
  },

  // Quality assurance standards
  qualityAssurance: {
    codeReview: {
      criteria: ['functionality', 'readability', 'performance', 'security', 'maintainability'],
      checklist: ['naming-conventions', 'error-handling', 'documentation', 'testing'],
      tools: ['sonarqube', 'codeclimate', 'github-reviews', 'gitlab-mr']
    },
    testing: {
      coverage: { minimum: 80, target: 90 },
      types: ['unit', 'integration', 'contract', 'e2e', 'performance'],
      automation: ['ci-integration', 'regression-testing', 'smoke-testing']
    },
    documentation: {
      types: ['api-docs', 'architecture-docs', 'user-guides', 'runbooks'],
      standards: ['openapi', 'markdown', 'confluence', 'notion'],
      maintenance: ['version-control', 'regular-updates', 'review-process']
    }
  }
};

/**
 * Validation rules for Jane-specific configurations
 */
export const JANE_VALIDATION = {
  validateConfig: (config: Partial<IAgentConfig>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (config.type && config.type !== AgentType.JANE) {
      errors.push('Agent type must be JANE for Jane configuration');
    }
    
    if (config.temperature && config.temperature > 0.5) {
      errors.push('Jane requires lower temperature (≤0.5) for technical precision');
    }
    
    if (config.tools && config.tools.length === 0) {
      errors.push('Jane must have code-analyzer tool');
    }
    
    if (config.maxConcurrentTasks && config.maxConcurrentTasks > 5) {
      errors.push('Jane should not handle more than 5 concurrent technical tasks');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  getRecommendations: (config: Partial<IAgentConfig>): string[] => {
    const recommendations: string[] = [];
    
    if (!config.temperature || config.temperature > 0.3) {
      recommendations.push('Consider lowering temperature to 0.3 for better technical precision');
    }
    
    if (!config.tools || config.tools.length === 0) {
      recommendations.push('Add security-scanner tool for comprehensive security analysis');
    }
    
    if (!config.tools || config.tools.length === 0) {
      recommendations.push('Add performance-profiler tool for optimization tasks');
    }
    
    if (!config.tools || config.tools.length === 0) {
      recommendations.push('Add test-generator tool for automated testing');
    }
    
    return recommendations;
  },
  
  validateTechnicalRequest: (request: any): { isValid: boolean; issues: string[]; suggestions: string[] } => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!request.requirements) {
      issues.push('Technical requirements must be specified');
    }
    
    if (!request.acceptanceCriteria) {
      issues.push('Acceptance criteria must be defined');
    }
    
    if (!request.technicalConstraints) {
      suggestions.push('Define technical constraints and limitations');
    }
    
    if (!request.performanceRequirements) {
      suggestions.push('Specify performance requirements and benchmarks');
    }
    
    if (!request.securityRequirements) {
      suggestions.push('Define security requirements and compliance needs');
    }
    
    if (!request.testingStrategy) {
      suggestions.push('Outline testing strategy and coverage expectations');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
};

/**
 * Factory function to create Jane configuration with overrides
 */
export const createJaneConfig = (overrides?: Partial<IAgentConfig>): IAgentConfig => {
  if (!overrides) return JANE_CONFIG;
  
  const validation = JANE_VALIDATION.validateConfig(overrides);
  if (!validation.isValid) {
    throw new Error(`Invalid Jane configuration: ${validation.errors.join(', ')}`);
  }
  
  return {
    ...JANE_CONFIG,
    ...overrides,
    // Ensure critical Jane properties are maintained
    type: AgentType.JANE,
    availableTasks: overrides.availableTasks || JANE_CONFIG.availableTasks
  };
};

/**
 * Technical complexity levels for different implementation tasks
 */
export const TECHNICAL_COMPLEXITY = {
  SIMPLE: {
    level: TaskComplexity.SIMPLE,
    estimatedTime: 60, // minutes
    linesOfCode: { min: 50, max: 200 },
    techniques: ['basic-patterns', 'standard-libraries', 'simple-architecture']
  },
  MODERATE: {
    level: TaskComplexity.MODERATE,
    estimatedTime: 120, // minutes
    linesOfCode: { min: 200, max: 800 },
    techniques: ['design-patterns', 'framework-integration', 'database-design']
  },
  COMPLEX: {
    level: TaskComplexity.COMPLEX,
    estimatedTime: 240, // minutes
    linesOfCode: { min: 800, max: 2000 },
    techniques: ['advanced-patterns', 'microservices', 'performance-optimization']
  },
  EXPERT: {
    level: TaskComplexity.EXPERT,
    estimatedTime: 480, // minutes
    linesOfCode: { min: 2000, max: 10000 },
    techniques: ['distributed-systems', 'custom-frameworks', 'advanced-algorithms']
  }
};

/**
 * Technology stack recommendations based on use cases
 */
export const TECHNOLOGY_STACKS = {
  'web-application': {
    frontend: ['react', 'typescript', 'tailwindcss', 'vite'],
    backend: ['nestjs', 'typescript', 'postgresql', 'redis'],
    deployment: ['docker', 'kubernetes', 'nginx', 'certbot']
  },
  'api-service': {
    framework: ['nestjs', 'express', 'fastify'],
    database: ['postgresql', 'mongodb', 'redis'],
    tools: ['swagger', 'jest', 'docker', 'prometheus']
  },
  'microservices': {
    services: ['nestjs', 'typescript', 'grpc', 'kafka'],
    infrastructure: ['kubernetes', 'istio', 'prometheus', 'jaeger'],
    data: ['postgresql', 'mongodb', 'redis', 'elasticsearch']
  },
  'mobile-backend': {
    api: ['nestjs', 'graphql', 'apollo-server'],
    database: ['postgresql', 'redis', 'mongodb'],
    services: ['firebase', 'aws-cognito', 'push-notifications']
  }
};