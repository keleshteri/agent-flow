import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

/**
 * Bootstrap the NestJS application with agent system
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend integration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Agent Flow API')
    .setDescription(
      'A comprehensive API for managing AI agents and executing tasks through a multi-agent system. ' +
      'This API provides endpoints for task execution, workflow management, agent monitoring, and real-time updates.'
    )
    .setVersion('1.0.0')
    .addTag('agents', 'Agent management and information')
    .addTag('tasks', 'Task execution and management')
    .addTag('workflows', 'Complex workflow orchestration')
    .addTag('monitoring', 'System monitoring and health checks')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.agent-flow.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Agent Flow API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log('🚀 Agent Flow API is running!');
  logger.log(`📡 Server: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🔌 WebSocket: ws://localhost:${port}/agents`);
  logger.log('');
  logger.log('Available Agents:');
  logger.log('  👩‍💼 Mary  - Project Management Specialist');
  logger.log('  🔍 John  - Research & Information Specialist');
  logger.log('  🎨 Fred  - Creative Content Specialist');
  logger.log('  👩‍💻 Jane  - Technical Implementation Specialist');
  logger.log('  📊 Sarah - Data Analysis Specialist');
  logger.log('  🤝 Bob   - Customer Relations Specialist');
  logger.log('');
  logger.log('Quick Start:');
  logger.log('  1. Visit the API documentation at /api/docs');
  logger.log('  2. Try the health check: GET /api/v1/agents/health');
  logger.log('  3. Get available agents: GET /api/v1/agents');
  logger.log('  4. Execute a task: POST /api/v1/agents/tasks');
  logger.log('');
  logger.log('WebSocket Events:');
  logger.log('  - Connect to /agents namespace for real-time updates');
  logger.log('  - Listen for: taskStarted, taskCompleted, taskFailed');
  logger.log('  - Send: executeTask, executeWorkflow, subscribeAgentStatus');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
