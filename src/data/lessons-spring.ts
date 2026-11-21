import { Lesson } from '@/lib/types';

export const springLessons: Lesson[] = [
  {
    id: 'spring-request-lifecycle',
    slug: 'spring-request-lifecycle',
    title: 'Spring Boot Request Lifecycle',
    subtitle: 'From incoming HTTP packet to JSON response — trace the complete layered path through Spring MVC.',
    moduleId: '04',
    moduleTitle: '04. Spring Boot & Microservices',
    duration: '12 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The Front Controller pattern and DispatcherServlet mechanics',
      'Filter Chain (Security, Logging, CORS) vs HandlerInterceptors',
      'HandlerMapping and HandlerAdapter method execution',
      'The Controller -> Service -> Repository layered architecture',
      'HttpMessageConverter and Jackson JSON serialization',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'HTTP Request Hits the Servlet Container',
        subtitle: 'Embedded Tomcat and the Filter Chain',
        type: 'problem',
        content: `When a client transmits an HTTP \`GET /api/v1/policies/POL-101\` request, it first arrives at the embedded Web Server (such as embedded Tomcat, Jetty, or Undertow).

Tomcat passes the raw \`HttpServletRequest\` through the configured **Servlet Filter Chain** before reaching Spring itself.

Filters operate at the low-level HTTP boundary and handle:
- **Security Authentication**: Spring Security \`SecurityFilterChain\` validates OAuth2/JWT tokens
- **CORS Handling**: Validates \`Access-Control-Allow-Origin\` headers
- **Correlation ID Injection**: Adds an \`X-Correlation-ID\` to MDC for distributed logging
- **Request Tracing**: Begins Zipkin / OpenTelemetry span timers`,
        keyIdea: 'Servlet Filters run outside Spring MVC to perform cross-cutting protocol checks like security and CORS.',
        diagramState: 'http-arrives',
      },
      {
        id: 'step-2',
        title: 'DispatcherServlet: The Front Controller',
        subtitle: 'Central routing orchestrator of Spring MVC',
        type: 'concept',
        content: `Once past the servlet filters, the request enters **\`DispatcherServlet\`**, the single entry point ("Front Controller") for the entire Spring web framework.

The DispatcherServlet coordinates:
1. **\`HandlerMapping\`**: Scans \`@RequestMapping\` annotations to discover which Controller method matches the incoming URI and HTTP method.
2. **\`HandlerInterceptor\`**: Executes \`preHandle()\` hooks before invoking the controller.
3. **\`HandlerAdapter\`**: Dispatches the request, reflecting over method arguments to resolve \`@PathVariable\`, \`@RequestParam\`, and deserializing JSON payloads via \`@RequestBody\`.`,
        keyIdea: 'DispatcherServlet routes requests by consulting HandlerMapping and delegating invocation to HandlerAdapter.',
        diagramState: 'dispatcher-dispatch',
      },
      {
        id: 'step-3',
        title: 'Controller, Service & Repository Layers',
        subtitle: 'Separation of concerns in clean enterprise code',
        type: 'solution',
        content: `The request flows through three distinct enterprise layers:

1. **Controller Layer (\`@RestController\`)**:
   - Thin boundary responsible only for HTTP protocol details.
   - Validates input annotations (\`@Valid\`, \`@NotNull\`).
   - Converts HTTP request payloads into domain DTOs.
2. **Service Layer (\`@Service\`)**:
   - Holds core business domain logic, calculation rules, and orchestration.
   - Manages database transaction boundaries with \`@Transactional\`.
3. **Repository Layer (\`@Repository\`)**:
   - Manages persistence operations using Spring Data (MongoDB, JPA/Hibernate, or SQL).`,
        keyIdea: 'Controllers translate HTTP to domain DTOs; Services enforce business invariants; Repositories manage database persistence.',
        codeExample: {
          title: 'LayeredArchitectureExample.java',
          code: `@RestController
@RequestMapping("/api/v1/policies")
public class PolicyController {
    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(@PathVariable String id) {
        PolicyDTO dto = policyService.fetchPolicyDetails(id);
        return ResponseEntity.ok(PolicyResponseDTO.from(dto));
    }
}`,
        },
        diagramState: 'controller-service',
      },
      {
        id: 'step-4',
        title: 'Repository to Database & Back',
        subtitle: 'Executing persistence queries and DTO mapping',
        type: 'insight',
        content: `The Service delegates persistence to the Repository. In modern microservices, this queries a document store like **MongoDB** (using \`MongoTemplate\` or Spring Data repositories) or relational databases like PostgreSQL.

Once records are fetched:
1. Domain Entities are mapped to **DTOs (Data Transfer Objects)** to prevent leaking internal database schemas or sensitive password/audit hashes to consumers.
2. The Service returns the DTO to the Controller.
3. The Controller returns a \`ResponseEntity<T>\`.`,
        keyIdea: 'DTO mapping decouples internal persistence schema from external public API contracts.',
        diagramState: 'repo-db',
      },
      {
        id: 'step-5',
        title: 'HttpMessageConverter: Serialization & Response',
        subtitle: 'Transforming Java objects into JSON bytes',
        type: 'recap',
        content: `In the final phase, DispatcherServlet delegates the returned object to **\`MappingJackson2HttpMessageConverter\`**.

Jackson reads the Java DTO, applies configuration rules (such as snake_case formatting or ignoring nulls), and serializes the Java object into JSON byte streams sent back through the TCP socket with an **\`HTTP 200 OK\`** header.

If an exception was thrown anywhere along the pipeline, Spring’s **\`@RestControllerAdvice\`** intercepts the error to construct a consistent JSON error response (RFC 7807 Problem Details).`,
        keyIdea: 'HttpMessageConverters serialize Java DTOs into JSON responses or convert exceptions into RFC-standard error payloads.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'dependency-injection',
    slug: 'dependency-injection',
    title: 'Dependency Injection & Inversion of Control',
    subtitle: 'Understand the Spring ApplicationContext, Bean lifecycle, and why constructor injection is superior.',
    moduleId: '04',
    moduleTitle: '04. Spring Boot & Microservices',
    duration: '10 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'Inversion of Control (IoC) vs Dependency Injection (DI)',
      'The Spring IoC Container and ApplicationContext',
      'Constructor Injection vs Field Injection (@Autowired)',
      'Bean scopes: Singleton vs Prototype vs Request',
      'The 7 stages of the Spring Bean Lifecycle',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Inversion of Control (IoC)',
        subtitle: 'Don’t call us, we’ll call you (The Hollywood Principle)',
        type: 'concept',
        content: `In traditional programming, if \`PolicyService\` needs a \`DatabaseConnection\`, it directly instantiates it:
\`private DatabaseConnection db = new DatabaseConnection();\`

This tightly couples classes, makes unit testing with mocks impossible, and scatters configuration across the entire codebase.

**Inversion of Control (IoC)** reverses this control. You do not instantiate your dependencies. Instead, an external runtime container—the **Spring IoC Container (\`ApplicationContext\`)**—instantiates objects ("beans"), wires them together, and injects them wherever required.`,
        keyIdea: 'IoC delegates object creation and dependency wiring to the Spring container, resulting in loosely coupled, testable code.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Constructor Injection vs Field Injection',
        subtitle: 'Why @Autowired on fields is considered an anti-pattern',
        type: 'solution',
        content: `There are three ways to inject dependencies in Spring:
1. **Field Injection (\`@Autowired private Service service;\`)**: Uses reflection.
   - *Problems*: Hides dependencies, makes classes impossible to instantiate in unit tests without Spring, and allows circular dependencies.
2. **Setter Injection**: Useful only for optional dependencies.
3. **Constructor Injection (Recommended Best Practice)**:
   - Enforces **immutability** via \`final\` fields.
   - Guarantees dependencies are never \`null\` when the object exists.
   - Allows straightforward unit testing via plain \`new Service(mockRepo)\` with zero Spring overhead!
   - In Spring 4.3+, single constructors do not even require the \`@Autowired\` annotation.`,
        keyIdea: 'Always use constructor injection with final fields for immutability, thread safety, and effortless unit testing.',
        codeExample: {
          title: 'ConstructorInjectionBestPractice.java',
          code: `@Service
public class PolicyServiceImpl implements PolicyService {
    // Immutable dependencies
    private final PolicyRepository policyRepository;
    private final NotificationClient notificationClient;

    // Explicit constructor injection (no @Autowired needed)
    public PolicyServiceImpl(PolicyRepository policyRepository,
                             NotificationClient notificationClient) {
        this.policyRepository = Objects.requireNonNull(policyRepository);
        this.notificationClient = Objects.requireNonNull(notificationClient);
    }
}`,
        },
        interviewTip: 'Why is constructor injection preferred over field injection? It enables immutability (final fields), prevents NullPointerExceptions by making dependencies required at instantiation time, and simplifies unit testing without reflection or Spring test runners.',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Spring Bean Lifecycle',
        subtitle: 'From instantiation to destruction',
        type: 'insight',
        content: `Every Spring bean passes through a strictly orchestrated lifecycle:
1. **Instantiation**: The container invokes the constructor via reflection.
2. **Populate Properties**: Dependencies are injected.
3. **BeanNameAware / BeanFactoryAware**: Informs bean of container context.
4. **BeanPostProcessor (Before Initialization)**: Runs \`postProcessBeforeInitialization()\`.
5. **Initialization (\`@PostConstruct\` / \`InitializingBean\`)**: Runs custom initialization logic.
6. **BeanPostProcessor (After Initialization)**: AOP proxies (for \`@Transactional\`, \`@Async\`, \`@Secured\`) wrap the bean here!
7. **Ready for Use**: Bean serves requests in the application.
8. **Destruction (\`@PreDestroy\`)**: Cleanup connections on shutdown.`,
        keyIdea: 'AOP proxies (like @Transactional) wrap beans during the BeanPostProcessor phase after bean initialization.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'microservices-patterns',
    slug: 'microservices-patterns',
    title: 'Microservices Communication & Resilience',
    subtitle: 'Service discovery, Circuit Breakers, Retries, and API Gateways in enterprise distributed systems.',
    moduleId: '04',
    moduleTitle: '04. Spring Boot & Microservices',
    duration: '12 min',
    difficulty: 'Advanced',
    youllLearn: [
      'Synchronous REST (RestTemplate, WebClient) vs Asynchronous messaging',
      'The Circuit Breaker pattern (Resilience4j): Closed, Open, Half-Open states',
      'Exponential backoff and Jitter in retry policies',
      'API Gateway pattern for routing, rate-limiting, and auth offloading',
      'Preventing cascading failures across distributed microservices',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Cascading Failures in Distributed Systems',
        subtitle: 'How one slow microservice can crash your entire platform',
        type: 'problem',
        content: `In a microservices architecture, Service A calls Service B, which calls Service C.

If Service C becomes slow or unresponsive, threads in Service B will block waiting on socket timeouts. Within seconds, Service B exhausts its Tomcat thread pool and crashes. Service A's thread pool follows immediately.

This chain reaction is called a **Cascading Failure**.

To prevent outages, distributed architectures deploy defensive patterns:
- **Timeouts**: Never allow requests to wait indefinitely.
- **Circuit Breakers**: Stop calling a failing service before thread exhaustion occurs.
- **Bulkheads**: Isolate thread pools so one failing downstream integration does not consume all resources.`,
        keyIdea: 'Unprotected inter-service calls lead to cascading failures through thread pool exhaustion.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'The Circuit Breaker Pattern (Resilience4j)',
        subtitle: 'Closed -> Open -> Half-Open state machine',
        type: 'solution',
        content: `A **Circuit Breaker** acts like an electrical fuse in your code:

1. **CLOSED (Normal State)**: Requests flow freely to the downstream service. The circuit breaker measures error rates and latency.
2. **OPEN (Tripped)**: If the failure rate exceeds a threshold (e.g. 50% failures over 20 requests), the circuit trips **OPEN**. All subsequent requests are rejected immediately without making network calls, preventing thread starvation! A fallback method is invoked instantly.
3. **HALF-OPEN (Testing Recovery)**: After a wait duration (e.g. 30 seconds), the circuit transitions to **HALF-OPEN**, allowing a limited trial batch of requests through. If they succeed, the circuit resets to **CLOSED**; if they fail, it trips back to **OPEN**.`,
        keyIdea: 'Circuit breakers prevent cascading outages by failing fast and allowing troubled services breathing room to recover.',
        codeExample: {
          title: 'Resilience4jCircuitBreaker.java',
          code: `@Service
public class PaymentGatewayClient {
    private final RestClient restClient;

    public PaymentGatewayClient(RestClient restClient) {
        this.restClient = restClient;
    }

    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    @Retry(name = "paymentService")
    public PaymentResponse authorizePayment(PaymentRequest request) {
        return restClient.post()
            .uri("/api/v1/payments/authorize")
            .body(request)
            .retrieve()
            .body(PaymentResponse.class);
    }

    // Fallback method executed immediately when circuit is OPEN or call fails
    public PaymentResponse paymentFallback(PaymentRequest request, Throwable ex) {
        log.warn("Payment service unavailable, queueing for asynchronous retry. Error: {}", ex.getMessage());
        return PaymentResponse.queuedForLater(request.getTransactionId());
    }
}`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'API Gateway: Centralized Ingress',
        subtitle: 'Unified routing, SSL termination, and rate limiting',
        type: 'insight',
        content: `Exposing dozens of internal microservices directly to client applications creates tight coupling, CORS nightmares, and fragmented authentication logic.

An **API Gateway** acts as the single entry point for all external traffic:
- **Dynamic Routing**: Dispatches requests based on path and header rules.
- **Authentication & Token Validation**: Offloads JWT verification from individual microservices.
- **Rate Limiting**: Protects backend clusters from DDoS and brute-force spikes.
- **Protocol Translation**: Translates external HTTP/JSON into internal gRPC or messaging protocols.`,
        keyIdea: 'An API Gateway provides a hardened single perimeter for security, rate limiting, and intelligent routing.',
        diagramState: 'recap',
      },
    ],
  },
];
