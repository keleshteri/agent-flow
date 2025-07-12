# NestJS Project Development Rules

## CRITICAL WORKFLOW RULES (Must Follow)

### Planning Phase (Mandatory)

1. **Always create a plan first** - Never start coding without a numbered todo list
2. **Ask before adding dependencies** - Confirm any packages/modules before installation
3. **Scope management** - Only implement what is specifically requested
4. **No scope creep** - Do not add extra modules, features, or "helpful" additions

### Implementation Rules

1. **One feature at a time** - Focus solely on the requested feature
2. **Ask for dependencies** - Before adding related modules, ask: "Do you need X module?"
3. **Minimal approach** - Create only the essential files/classes requested
4. **Incremental development** - Build step by step, confirm each step

### Response Format (Mandatory)

```
## Plan
1. Install dependencies: [specific list]
2. Create classes: [specific list]
3. Configure: [specific list]

## Dependencies/Modules Needed
Do you want me to also add:
- Database module (if config needs DB)?
- Validation module (if DTOs need validation)?
- [Other related modules]?

## Implementation
[Only the requested code - nothing extra]
```

### Examples:

- **Request**: "Add config module" → **Response**: Only config module, ask about database if needed
- **Request**: "Add user module" → **Response**: Only user module, ask about auth if needed
- **Request**: "Add database" → **Response**: Only database setup, ask about specific entities needed

## TypeScript Rules

1. **Always declare types explicitly** - avoid `any`, create custom types
2. **Use English** for all code/documentation
3. **One export per file** (single responsibility principle)
4. **JSDoc comments** for public classes/methods
5. **No blank lines within functions**
6. **Strict TypeScript configuration** enabled

## Naming Conventions

1. **PascalCase**: Classes, interfaces, types, enums (`UserService`, `IRepository`)
2. **camelCase**: Variables, functions, methods, properties (`getUserById`, `isValid`)
3. **kebab-case**: Files, directories, module names (`user-service.ts`, `order-module/`)
4. **UPPERCASE**: Environment variables, constants (`DATABASE_URL`, `MAX_RETRIES`)
5. **Verb-based functions**: `getUserById()`, `createOrder()`, `validateEmail()`
6. **Boolean variables**: `isLoading`, `hasError`, `canAccess`, `shouldRetry`
7. **Interface prefix**: Use `I` prefix when needed (`IUserRepository`, `IPaymentGateway`)

## Design Patterns (Mandatory)

### Repository Pattern

```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
}
```

### Factory Pattern

```typescript
interface INotificationFactory {
  createNotification(type: NotificationType): INotification;
}

@Injectable()
export class NotificationFactory implements INotificationFactory {
  createNotification(type: NotificationType): INotification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SmsNotification();
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
  }
}
```

### Strategy Pattern

```typescript
interface IPaymentStrategy {
  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult>;
}

@Injectable()
export class PaymentService {
  constructor(private readonly strategies: Map<PaymentType, IPaymentStrategy>) {}

  async processPayment(type: PaymentType, amount: number): Promise<PaymentResult> {
    const strategy = this.strategies.get(type);
    if (!strategy) throw new Error(`Payment strategy not found: ${type}`);
    return strategy.processPayment(amount);
  }
}
```

### Dependency Injection Pattern

```typescript
// Always use interfaces for dependency injection
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly userService: IUserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
}
```

## Modular Architecture (Strict Rules)

### Directory Structure

```
src/
├── common/                 # Shared utilities, types, constants
│   ├── decorators/
│   ├── guards/
│   ├── interfaces/
│   ├── types/
│   ├── constants/
│   └── utils/
├── core/                  # Global application concerns
│   ├── config/
│   ├── database/
│   ├── filters/
│   ├── interceptors/
│   ├── middlewares/
│   └── pipes/
├── shared/               # Reusable business modules
│   ├── auth/
│   ├── logging/
│   ├── notifications/
│   └── events/
└── modules/              # Independent business domains
    ├── users/
    ├── orders/
    ├── products/
    ├── payments/
    └── inventory/
```

### Business Module Structure (Mandatory)

```
modules/users/
├── controllers/
│   └── users.controller.ts
├── services/
│   ├── users.service.ts
│   └── user-validation.service.ts
├── repositories/
│   ├── users.repository.ts
│   └── user.repository.interface.ts
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── user-response.dto.ts
├── entities/
│   └── user.entity.ts
├── interfaces/
│   ├── user.interface.ts
│   └── user-service.interface.ts
├── events/
│   ├── user-created.event.ts
│   └── user-updated.event.ts
├── guards/
│   └── user-ownership.guard.ts
├── exceptions/
│   └── user-not-found.exception.ts
└── users.module.ts
```

## Module Independence Rules (Critical)

1. **Self-contained modules** - Each module must be completely independent
2. **No direct imports** - Business modules cannot directly import from other business modules
3. **Event-driven communication** - Use events for cross-module communication
4. **Shared services only** - Only import from `shared/` or `common/` directories
5. **Interface boundaries** - All module interactions through well-defined interfaces
6. **Database independence** - Each module can have its own database/schema

### ✅ Correct Module Communication

```typescript
// Event-driven communication
@Injectable()
export class OrderService {
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepo.save(orderData);

    // Notify other modules via events
    this.eventEmitter.emit('order.created', new OrderCreatedEvent(order));
    return order;
  }
}

// Listening to events in another module
@Injectable()
export class InventoryService {
  @OnEvent('order.created')
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.updateInventory(event.orderItems);
  }
}
```

### ❌ Forbidden Module Communication

```typescript
// NEVER DO THIS - Direct module dependency
import { UserService } from '../users/services/user.service';

@Injectable()
export class OrderService {
  constructor(private userService: UserService) {} // ❌ Forbidden
}
```

## Function Design Rules

1. **Short functions** - Maximum 20 lines, single responsibility
2. **Early returns** - Avoid deep nesting, return early on conditions
3. **Pure functions preferred** - No side effects when possible
4. **Higher-order functions** - Use `map()`, `filter()`, `reduce()` over loops
5. **Default parameters** - Instead of null/undefined checks
6. **RO-RO pattern** - Return objects for multiple values

```typescript
// ✅ Good function design
async function getUserProfile(params: GetUserProfileParams): Promise<UserProfileResult> {
  if (!params.userId) {
    return { success: false, error: 'User ID required' };
  }

  const user = await this.userRepo.findById(params.userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return {
    success: true,
    data: this.mapToProfileDto(user),
  };
}
```

## Data Transfer Objects (DTOs)

1. **Input validation** - Use class-validator decorators
2. **Output transformation** - Separate response DTOs
3. **Type safety** - All properties explicitly typed
4. **Immutable when possible** - Use readonly properties

```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;
}

export class UserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly isActive: boolean;
}
```

## Error Handling Rules

1. **Custom exceptions** - Create specific exception classes for business logic
2. **Global exception filters** - Consistent error response format
3. **Error context** - Include relevant information in errors
4. **Proper HTTP status codes** - Use appropriate status codes
5. **No silent failures** - Always handle or propagate errors

```typescript
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message || 'Internal server error',
    });
  }
}
```

## Testing Requirements

1. **Jest framework** with NestJS testing utilities
2. **AAA pattern** - Arrange, Act, Assert structure
3. **Descriptive test names** - `should_return_user_when_valid_id_provided`
4. **Unit tests** - For each service method and business logic
5. **Integration tests** - For controllers and module interactions
6. **E2E tests** - For complete user workflows
7. **Test isolation** - Each test independent, clean state
8. **Mock external dependencies** - Database, external APIs, etc.

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [UserService, { provide: 'IUserRepository', useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get('IUserRepository');
  });

  describe('getUserById', () => {
    it('should_return_user_when_valid_id_provided', async () => {
      // Arrange
      const userId = 'user-123';
      const expectedUser = new User(userId, 'test@example.com');
      repository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await service.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
```

## Performance & Scalability Rules

1. **Lazy loading** - For optional dependencies and heavy modules
2. **Connection pooling** - Database connections
3. **Caching strategies** - Redis for frequently accessed data
4. **Async operations** - Non-blocking operations with proper error handling
5. **Resource cleanup** - Use lifecycle hooks (OnDestroy)
6. **Pagination** - For list endpoints
7. **Database indexes** - On frequently queried fields

## Code Quality Standards

1. **SOLID principles** - Single responsibility, Open/closed, etc.
2. **DRY principle** - Don't repeat yourself
3. **Small classes** - Maximum 200 lines, 10 methods
4. **Composition over inheritance** - Prefer composition
5. **Immutable data structures** - Use readonly, avoid mutations
6. **Type guards** - For runtime type checking

## Security Rules

1. **Input validation** - All user inputs validated
2. **Authentication guards** - Protect all endpoints except public ones
3. **Authorization** - Role-based access control
4. **SQL injection prevention** - Use parameterized queries
5. **XSS prevention** - Sanitize outputs
6. **Rate limiting** - Prevent abuse
7. **CORS configuration** - Proper cross-origin settings

## Documentation Requirements

1. **API documentation** - Swagger/OpenAPI for all endpoints
2. **Code comments** - JSDoc for public methods
3. **README files** - For each module explaining its purpose
4. **Architecture diagrams** - High-level system design
5. **Environment setup** - Clear setup instructions

## Git Workflow Rules

1. **Feature branches** - One feature per branch
2. **Conventional commits** - Standardized commit messages
3. **Pull request reviews** - All code reviewed before merge
4. **Automated testing** - CI/CD pipeline with tests
5. **Version tagging** - Semantic versioning

Remember: These rules are non-negotiable. Every piece of code must follow these standards to ensure maintainability, scalability, and team consistency.

## TypeScript Rules

1. **Always declare types explicitly** - avoid `any`, create custom types
2. **Use English** for all code/documentation
3. **One export per file** (single responsibility principle)
4. **JSDoc comments** for public classes/methods
5. **No blank lines within functions**
6. **Strict TypeScript configuration** enabled

## Naming Conventions

1. **PascalCase**: Classes, interfaces, types, enums (`UserService`, `IRepository`)
2. **camelCase**: Variables, functions, methods, properties (`getUserById`, `isValid`)
3. **kebab-case**: Files, directories, module names (`user-service.ts`, `order-module/`)
4. **UPPERCASE**: Environment variables, constants (`DATABASE_URL`, `MAX_RETRIES`)
5. **Verb-based functions**: `getUserById()`, `createOrder()`, `validateEmail()`
6. **Boolean variables**: `isLoading`, `hasError`, `canAccess`, `shouldRetry`
7. **Interface prefix**: Use `I` prefix when needed (`IUserRepository`, `IPaymentGateway`)

## Design Patterns (Mandatory)

### Repository Pattern

```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
}
```

### Factory Pattern

```typescript
interface INotificationFactory {
  createNotification(type: NotificationType): INotification;
}

@Injectable()
export class NotificationFactory implements INotificationFactory {
  createNotification(type: NotificationType): INotification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SmsNotification();
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
  }
}
```

### Strategy Pattern

```typescript
interface IPaymentStrategy {
  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult>;
}

@Injectable()
export class PaymentService {
  constructor(private readonly strategies: Map<PaymentType, IPaymentStrategy>) {}

  async processPayment(type: PaymentType, amount: number): Promise<PaymentResult> {
    const strategy = this.strategies.get(type);
    if (!strategy) throw new Error(`Payment strategy not found: ${type}`);
    return strategy.processPayment(amount);
  }
}
```

### Dependency Injection Pattern

```typescript
// Always use interfaces for dependency injection
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly userService: IUserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
}
```

## Modular Architecture (Strict Rules)

### Directory Structure

```
src/
├── common/                 # Shared utilities, types, constants
│   ├── decorators/
│   ├── guards/
│   ├── interfaces/
│   ├── types/
│   ├── constants/
│   └── utils/
├── core/                  # Global application concerns
│   ├── config/
│   ├── database/
│   ├── filters/
│   ├── interceptors/
│   ├── middlewares/
│   └── pipes/
├── shared/               # Reusable business modules
│   ├── auth/
│   ├── logging/
│   ├── notifications/
│   └── events/
└── modules/              # Independent business domains
    ├── users/
    ├── orders/
    ├── products/
    ├── payments/
    └── inventory/
```

### Business Module Structure (Mandatory)

```
modules/users/
├── controllers/
│   └── users.controller.ts
├── services/
│   ├── users.service.ts
│   └── user-validation.service.ts
├── repositories/
│   ├── users.repository.ts
│   └── user.repository.interface.ts
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── user-response.dto.ts
├── entities/
│   └── user.entity.ts
├── interfaces/
│   ├── user.interface.ts
│   └── user-service.interface.ts
├── events/
│   ├── user-created.event.ts
│   └── user-updated.event.ts
├── guards/
│   └── user-ownership.guard.ts
├── exceptions/
│   └── user-not-found.exception.ts
└── users.module.ts
```

## Module Independence Rules (Critical)

1. **Self-contained modules** - Each module must be completely independent
2. **No direct imports** - Business modules cannot directly import from other business modules
3. **Event-driven communication** - Use events for cross-module communication
4. **Shared services only** - Only import from `shared/` or `common/` directories
5. **Interface boundaries** - All module interactions through well-defined interfaces
6. **Database independence** - Each module can have its own database/schema

### ✅ Correct Module Communication

```typescript
// Event-driven communication
@Injectable()
export class OrderService {
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepo.save(orderData);

    // Notify other modules via events
    this.eventEmitter.emit('order.created', new OrderCreatedEvent(order));
    return order;
  }
}

// Listening to events in another module
@Injectable()
export class InventoryService {
  @OnEvent('order.created')
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.updateInventory(event.orderItems);
  }
}
```

### ❌ Forbidden Module Communication

```typescript
// NEVER DO THIS - Direct module dependency
import { UserService } from '../users/services/user.service';

@Injectable()
export class OrderService {
  constructor(private userService: UserService) {} // ❌ Forbidden
}
```

## Function Design Rules

1. **Short functions** - Maximum 20 lines, single responsibility
2. **Early returns** - Avoid deep nesting, return early on conditions
3. **Pure functions preferred** - No side effects when possible
4. **Higher-order functions** - Use `map()`, `filter()`, `reduce()` over loops
5. **Default parameters** - Instead of null/undefined checks
6. **RO-RO pattern** - Return objects for multiple values

```typescript
// ✅ Good function design
async function getUserProfile(params: GetUserProfileParams): Promise<UserProfileResult> {
  if (!params.userId) {
    return { success: false, error: 'User ID required' };
  }

  const user = await this.userRepo.findById(params.userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  return {
    success: true,
    data: this.mapToProfileDto(user),
  };
}
```

## Data Transfer Objects (DTOs)

1. **Input validation** - Use class-validator decorators
2. **Output transformation** - Separate response DTOs
3. **Type safety** - All properties explicitly typed
4. **Immutable when possible** - Use readonly properties

```typescript
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;
}

export class UserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly isActive: boolean;
}
```

## Error Handling Rules

1. **Custom exceptions** - Create specific exception classes for business logic
2. **Global exception filters** - Consistent error response format
3. **Error context** - Include relevant information in errors
4. **Proper HTTP status codes** - Use appropriate status codes
5. **No silent failures** - Always handle or propagate errors

```typescript
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message || 'Internal server error',
    });
  }
}
```

## Testing Requirements

1. **Jest framework** with NestJS testing utilities
2. **AAA pattern** - Arrange, Act, Assert structure
3. **Descriptive test names** - `should_return_user_when_valid_id_provided`
4. **Unit tests** - For each service method and business logic
5. **Integration tests** - For controllers and module interactions
6. **E2E tests** - For complete user workflows
7. **Test isolation** - Each test independent, clean state
8. **Mock external dependencies** - Database, external APIs, etc.

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [UserService, { provide: 'IUserRepository', useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get('IUserRepository');
  });

  describe('getUserById', () => {
    it('should_return_user_when_valid_id_provided', async () => {
      // Arrange
      const userId = 'user-123';
      const expectedUser = new User(userId, 'test@example.com');
      repository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await service.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
```

## Performance & Scalability Rules

1. **Lazy loading** - For optional dependencies and heavy modules
2. **Connection pooling** - Database connections
3. **Caching strategies** - Redis for frequently accessed data
4. **Async operations** - Non-blocking operations with proper error handling
5. **Resource cleanup** - Use lifecycle hooks (OnDestroy)
6. **Pagination** - For list endpoints
7. **Database indexes** - On frequently queried fields

## Code Quality Standards

1. **SOLID principles** - Single responsibility, Open/closed, etc.
2. **DRY principle** - Don't repeat yourself
3. **Small classes** - Maximum 200 lines, 10 methods
4. **Composition over inheritance** - Prefer composition
5. **Immutable data structures** - Use readonly, avoid mutations
6. **Type guards** - For runtime type checking

## Security Rules

1. **Input validation** - All user inputs validated
2. **Authentication guards** - Protect all endpoints except public ones
3. **Authorization** - Role-based access control
4. **SQL injection prevention** - Use parameterized queries
5. **XSS prevention** - Sanitize outputs
6. **Rate limiting** - Prevent abuse
7. **CORS configuration** - Proper cross-origin settings

## Documentation Requirements

1. **API documentation** - Swagger/OpenAPI for all endpoints
2. **Code comments** - JSDoc for public methods
3. **README files** - For each module explaining its purpose
4. **Architecture diagrams** - High-level system design
5. **Environment setup** - Clear setup instructions

## Git Workflow Rules

1. **Feature branches** - One feature per branch
2. **Conventional commits** - Standardized commit messages
3. **Pull request reviews** - All code reviewed before merge
4. **Automated testing** - CI/CD pipeline with tests
5. **Version tagging** - Semantic versioning

Remember: These rules are non-negotiable. Every piece of code must follow these standards to ensure maintainability, scalability, and team consistency.
