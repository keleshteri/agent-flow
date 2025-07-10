/**
 * Enum defining all available tasks that agents can perform
 */
export enum TaskType {
  // Master Assistant tasks
  GENERAL_ASSISTANCE = 'general-assistance',
  TASK_COORDINATION = 'task-coordination',
  AGENT_ROUTING = 'agent-routing',
  SYSTEM_MANAGEMENT = 'system-management',
  DECISION_MAKING = 'decision-making',
  
  // Data Analysis tasks (Mary)
  DATA_ANALYSIS = 'data-analysis',
  DATA_VISUALIZATION = 'data-visualization',
  STATISTICAL_MODELING = 'statistical-modeling',
  DATA_PROCESSING = 'data-processing',
  REPORTING = 'reporting',
  
  // Research tasks (John)
  RESEARCH = 'research',
  FACT_CHECKING = 'fact-checking',
  INFORMATION_SYNTHESIS = 'information-synthesis',
  COMPETITIVE_ANALYSIS = 'competitive-analysis',
  MARKET_RESEARCH = 'market-research',
  
  // Creative tasks (Fred)
  CONTENT_CREATION = 'content-creation',
  CREATIVE_WRITING = 'creative-writing',
  DESIGN_CONCEPTS = 'design-concepts',
  MULTIMEDIA_CONTENT = 'multimedia-content',
  MARKETING = 'marketing',
  COMMUNICATION = 'communication',
  
  // Technical tasks (Jane)
  SOFTWARE_DEVELOPMENT = 'software-development',
  SYSTEM_ARCHITECTURE = 'system-architecture',
  TECHNICAL_PROBLEM_SOLVING = 'technical-problem-solving',
  CODE_REVIEW = 'code-review',
  TECHNICAL_DOCUMENTATION = 'technical-documentation',
  AUTOMATION = 'automation',
  TESTING = 'testing',
  DEPLOYMENT = 'deployment',
  
  // Project Management tasks
  PROJECT_MANAGEMENT = 'project-management',
  PROJECT_PLANNING = 'project-planning',
  STRATEGIC_PLANNING = 'strategic-planning',
  
  // Customer Service tasks
  CUSTOMER_SERVICE = 'customer-service',
  TECHNICAL_SUPPORT = 'technical-support',
  
  // Brand and Storytelling
  BRAND_STORYTELLING = 'brand-storytelling',
  
  // Legacy tasks (keeping for backward compatibility)
  GENERAL_QUERIES = 'general-queries',
  OVERSIGHT = 'oversight',
  WHEN_UNSURE = 'when-unsure',
  BRAIN_STORMING = 'brain-storming',
  DEEP_RESEARCH = 'deep-research',
  PROJECT_BRIEFING = 'project-briefing',
  CREATE_PRD = 'create-prd',
  CORRECT_COURSE = 'correct-course',
  CREATE_DEEP_RESEARCH_PROMPT = 'create-deep-research-prompt',
  CREATE_ARCHITECTURE = 'create-architecture',
  CREATE_DEEP_RESEARCH_PROMPT_ARCH = 'create-deep-research-prompt-arch',
  CREATE_FRONTEND_ARCHITECTURE = 'create-frontend-architecture',
  CREATE_AI_FRONTEND_PROMPT = 'create-ai-frontend-prompt',
  CREATE_UX_UI_SPEC = 'create-ux-ui-spec',
  RUN_PO_MASTER_CHECKLIST = 'run-po-master-checklist',
  RUN_STORY_DRAFT_CHECKLIST = 'run-story-draft-checklist',
  RUN_CHANGE_CHECKLIST = 'run-change-checklist',
  DRAFT_STORY_FOR_DEV = 'draft-story-for-dev',
  EXTRACT_EPICS_AND_SHARD_ARCHITECTURE = 'extract-epics-and-shard-architecture',
  CORRECT_COURSE_PO = 'correct-course-po',
  RUN_CHANGE_CHECKLIST_SM = 'run-change-checklist-sm',
  RUN_STORY_DOD_CHECKLIST = 'run-story-dod-checklist',
  RUN_STORY_DRAFT_CHECKLIST_SM = 'run-story-draft-checklist-sm',
  CORRECT_COURSE_SM = 'correct-course-sm',
  DRAFT_STORY_FOR_DEV_SM = 'draft-story-for-dev-sm',
}

/**
 * Enum for task priority levels
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

/**
 * Enum for task status
 */
export enum TaskStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  IN_PROGRESS = 'in-progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  RETRY = 'retry',
}

/**
 * Enum for task categories
 */
export enum TaskCategory {
  ANALYSIS = 'analysis',
  RESEARCH = 'research',
  PLANNING = 'planning',
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  DOCUMENTATION = 'documentation',
  MANAGEMENT = 'management',
  COMMUNICATION = 'communication',
  QUALITY_ASSURANCE = 'quality-assurance',
}

/**
 * Enum for task complexity levels
 */
export enum TaskComplexity {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  EXPERT = 'expert',
  RESEARCH_REQUIRED = 'research-required',
}

/**
 * Enum for task execution modes
 */
export enum TaskExecutionMode {
  SYNCHRONOUS = 'synchronous',
  ASYNCHRONOUS = 'asynchronous',
  BATCH = 'batch',
  STREAMING = 'streaming',
  PARALLEL = 'parallel',
  SEQUENTIAL = 'sequential',
}

/**
 * Enum for task validation types
 */
export enum TaskValidationType {
  INPUT_VALIDATION = 'input-validation',
  OUTPUT_VALIDATION = 'output-validation',
  BUSINESS_RULES = 'business-rules',
  SECURITY_CHECK = 'security-check',
  QUALITY_CHECK = 'quality-check',
  COMPLIANCE_CHECK = 'compliance-check',
}

/**
 * Enum for task artifact types
 */
export enum TaskArtifactType {
  DOCUMENT = 'document',
  CODE = 'code',
  DIAGRAM = 'diagram',
  SPECIFICATION = 'specification',
  CHECKLIST = 'checklist',
  REPORT = 'report',
  PRESENTATION = 'presentation',
  TEMPLATE = 'template',
  DATASET = 'dataset',
  MODEL = 'model',
}

/**
 * Enum for task artifact formats
 */
export enum TaskArtifactFormat {
  MARKDOWN = 'markdown',
  JSON = 'json',
  YAML = 'yaml',
  XML = 'xml',
  HTML = 'html',
  PDF = 'pdf',
  DOCX = 'docx',
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  PLAIN_TEXT = 'plain-text',
  CSV = 'csv',
}

/**
 * Enum for task error types
 */
export enum TaskErrorType {
  VALIDATION_ERROR = 'validation-error',
  EXECUTION_ERROR = 'execution-error',
  TIMEOUT_ERROR = 'timeout-error',
  RESOURCE_ERROR = 'resource-error',
  DEPENDENCY_ERROR = 'dependency-error',
  PERMISSION_ERROR = 'permission-error',
  CONFIGURATION_ERROR = 'configuration-error',
  NETWORK_ERROR = 'network-error',
  UNKNOWN_ERROR = 'unknown-error',
}

/**
 * Enum for task lifecycle events
 */
export enum TaskLifecycleEvent {
  CREATED = 'created',
  QUEUED = 'queued',
  STARTED = 'started',
  PROGRESS_UPDATED = 'progress-updated',
  PAUSED = 'paused',
  RESUMED = 'resumed',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  RETRY_ATTEMPTED = 'retry-attempted',
}

/**
 * Enum for task scheduling types
 */
export enum TaskSchedulingType {
  IMMEDIATE = 'immediate',
  DELAYED = 'delayed',
  SCHEDULED = 'scheduled',
  RECURRING = 'recurring',
  CONDITIONAL = 'conditional',
  DEPENDENT = 'dependent',
}

/**
 * Enum for task resource requirements
 */
export enum TaskResourceType {
  CPU = 'cpu',
  MEMORY = 'memory',
  STORAGE = 'storage',
  NETWORK = 'network',
  GPU = 'gpu',
  API_CALLS = 'api-calls',
  TOKENS = 'tokens',
  TIME = 'time',
}

/**
 * Enum for task quality metrics
 */
export enum TaskQualityMetric {
  ACCURACY = 'accuracy',
  COMPLETENESS = 'completeness',
  RELEVANCE = 'relevance',
  CLARITY = 'clarity',
  CONSISTENCY = 'consistency',
  TIMELINESS = 'timeliness',
  EFFICIENCY = 'efficiency',
  USABILITY = 'usability',
}

/**
 * Enum for task collaboration types
 */
export enum TaskCollaborationType {
  SINGLE_AGENT = 'single-agent',
  MULTI_AGENT = 'multi-agent',
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  HIERARCHICAL = 'hierarchical',
  PEER_TO_PEER = 'peer-to-peer',
  REVIEW_BASED = 'review-based',
}