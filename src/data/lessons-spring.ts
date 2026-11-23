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
        subtitle: 'The front security gate of an office business park',
        type: 'problem',
        content: `Think of driving into a corporate office business park. Before you ever see the receptionist in the main lobby, you have to stop at the front security gate:
- The security guards check whether your car has a visitor permit (**CORS check**).
- They check your driver's license (**Spring Security authentication**).
- They clip a visitor badge with an ID number to your shirt so everything you do inside can be tracked (**Correlation ID / Distributed Tracing**).
- If your credentials don't check out, the guards turn your car around at the gate—you never even step foot in the building!

When a client sends an HTTP request (like \`GET /api/v1/policies/POL-101\`), it first arrives at the embedded web server (like **Embedded Tomcat**). 

Tomcat feeds the raw \`HttpServletRequest\` through the **Servlet Filter Chain** before Spring MVC even wakes up. Filters handle protocol-level checks:
- **Spring Security (\`SecurityFilterChain\`)**: Validates OAuth2 and JWT tokens.
- **CORS Handling**: Inspects \`Access-Control-Allow-Origin\` headers.
- **Correlation ID Tracking**: Attaches an \`X-Correlation-ID\` to logs so you can trace the request across microservices.`,
        keyIdea: 'Servlet Filters act as the front security checkpoint outside Spring MVC, validating tokens, CORS headers, and tracing IDs.',
        diagramState: 'http-arrives',
        diagramAlt: 'Architecture diagram illustrating The front security gate of an office business park: The front security gate of an office business park.',
      },
      {
        id: 'step-2',
        title: 'DispatcherServlet: The Front Controller',
        subtitle: 'The central hotel receptionist directing guests',
        type: 'concept',
        content: `Once through the security gate, you walk through the glass doors of a 5-star hotel lobby. Right in the center stands the head receptionist. You don't wander randomly into the basement or kitchen looking for a room; you speak to the receptionist, and they coordinate everything for you.

In Spring MVC, this head receptionist is **\`DispatcherServlet\`**, which implements the **Front Controller pattern**. Every single web request passes through this single hub!

The DispatcherServlet coordinates three helpers:
1. **\`HandlerMapping\`**: Looks at the hotel directory to see which controller handles this URL (e.g. mapping \`/api/v1/policies\` to \`PolicyController\`).
2. **\`HandlerInterceptor\`**: Runs \`preHandle()\` hooks (like checking user permissions or logging timing metrics).
3. **\`HandlerAdapter\`**: The actual hotel escort who calls the specific Java method, automatically converting incoming JSON or URL parameters into Java objects!`,
        keyIdea: 'DispatcherServlet acts as the central traffic controller, consulting HandlerMapping and delegating invocation to HandlerAdapter.',
        diagramState: 'dispatcher-dispatch',
        diagramAlt: 'Architecture diagram illustrating The central hotel receptionist directing guests: The central hotel receptionist directing guests.',
      },
      {
        id: 'step-3',
        title: 'Controller, Service & Repository Layers',
        subtitle: 'The waitstaff, head chef, and pantry clerk in a restaurant',
        type: 'solution',
        content: `Think of dining at a fine restaurant:
1. **The Waiter (\`@RestController\`)**:
   Greets you at the table, takes your order, and makes sure you didn't ask for something ridiculous like "grilled ice cubes" (**Input Validation with \`@Valid\`**). The waiter does not cook the meal; they hand the order slip to the kitchen.
2. **The Head Chef (\`@Service\`)**:
   Applies culinary recipes, business rules, discounts, and tax calculations. The chef coordinates the entire dish and ensures everything is cooked to perfection (**Transactional boundaries with \`@Transactional\`**).
3. **The Pantry Clerk (\`@Repository\`)**:
   Knows where every raw ingredient is stored in the pantry or refrigerator (**The Database**). The chef asks the clerk for 2 steaks, and the clerk fetches them.

This three-layer separation keeps your enterprise code organized, easy to read, and simple to test!`,
        keyIdea: 'Controllers handle HTTP communication, Services execute business rules, and Repositories manage database access.',
        codeExample: {
          title: 'LayeredArchitectureExample.java',
          code: `import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/policies")
public class PolicyController {
    private final PolicyService policyService;

    // Clean constructor injection:
    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(@PathVariable String id) {
        // Controller delegates business logic to the service layer:
        PolicyDTO dto = policyService.fetchPolicyDetails(id);
        return ResponseEntity.ok(PolicyResponseDTO.from(dto));
    }
}`,
        },
        diagramState: 'controller-service',
        diagramAlt: 'Architecture diagram illustrating LayeredArchitectureExample.java: The waitstaff, head chef, and pantry clerk in a restaurant.',
      },
      {
        id: 'step-4',
        title: 'Repository to Database & Back',
        subtitle: 'Packaging takeaway meals in clean boxes',
        type: 'insight',
        content: `When the chef finishes cooking a gourmet meal for takeout, they don't hand the customer a hot, greasy kitchen frying pan! They carefully place the food into a clean, labeled takeout box.

In enterprise software:
- The database returns internal **Entities** (which match table columns or MongoDB documents).
- Before sending data back to the user, the Service maps internal entities into **Data Transfer Objects (DTOs)**.
- **Why DTOs matter**: You never want to accidentally expose sensitive database fields (like password hashes, internal IDs, or credit card secrets) to external public API consumers!`,
        keyIdea: 'Mapping internal database entities to clean DTOs prevents accidental data leaks and protects your internal database schema.',
        diagramState: 'repo-db',
        diagramAlt: 'Architecture diagram illustrating Packaging takeaway meals in clean boxes: Packaging takeaway meals in clean boxes.',
      },
      {
        id: 'step-5',
        title: 'HttpMessageConverter: Serialization & Response',
        subtitle: 'Translating Java objects into universal JSON packets',
        type: 'recap',
        content: `Once your Controller returns a DTO inside a \`ResponseEntity\`, DispatcherServlet hands the Java object to **\`MappingJackson2HttpMessageConverter\`**.

Jackson reads your Java object and converts it into standard **JSON text**:
- It converts camelCase fields into client-friendly formats.
- It omits empty or null values if configured.
- It writes the JSON bytes into the HTTP response body alongside an **\`HTTP 200 OK\`** header.

If an unexpected error happened anywhere along the journey, Spring's **\`@RestControllerAdvice\`** catches the exception and turns it into a friendly, standardized error JSON payload (RFC 7807) so the client app always understands what went wrong!`,
        keyIdea: 'HttpMessageConverters serialize Java DTOs into JSON streams, while @RestControllerAdvice catches errors to format friendly error responses.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Translating Java objects into universal JSON packets: Translating Java objects into universal JSON packets.',
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
        subtitle: 'Plugging into a standard wall outlet vs hardwiring a lamp into the power grid',
        type: 'concept',
        content: `Think of buying a reading lamp for your bedroom:
- **Tight Coupling**: You buy a lamp, but instead of having a standard electrical cord, the lamp wires must be soldered directly into the high-voltage electrical wires inside your drywall. If you ever want to move the lamp to the living room or test a new light bulb, you have to smash open the wall with a hammer!
- **Inversion of Control**: The lamp comes with a standard universal plug. Your bedroom wall has a standard electrical outlet. You simply plug the lamp in. If you want to replace the lamp with a desk fan, you unplug the lamp and plug the fan in!

In classic code, classes used to create their own dependencies directly:
\`private DatabaseConnection db = new DatabaseConnection();\`
This tightly welded classes together and made testing with mock databases nearly impossible.

**Inversion of Control (IoC)** reverses this control. Instead of your class building its own tools, the **Spring IoC Container (\`ApplicationContext\`)** creates all objects ("Beans"), configures them, and hands them into your class automatically!`,
        keyIdea: 'IoC lets the Spring container build and wire objects together, resulting in flexible, loosely coupled, easily testable applications.',
        diagramState: 'ioc-container',
        diagramAlt: 'Architecture diagram illustrating Plugging into a standard wall outlet vs hardwiring a lamp into the power grid: Plugging into a standard wall outlet vs hardwiring a lamp into the power grid.',
      },
      {
        id: 'step-2',
        title: 'Constructor Injection vs Field Injection',
        subtitle: 'A bicycle with pedals in the box vs waiting for a mechanic to visit your house',
        type: 'solution',
        content: `Imagine ordering a bicycle online:
- **Field Injection (\`@Autowired\` on private fields)**: The bicycle arrives on your doorstep with no pedals. The delivery box says: *"Do not ride yet! A technician will arrive at an unknown time tomorrow with specialized tools to attach your pedals."* If you try to ride it today in a simple unit test, you fall flat on your face with a \`NullPointerException\`!
- **Constructor Injection (The Gold Standard)**: The bicycle arrives fully assembled with pedals, handlebars, and wheels securely attached right out of the box. You can hop on and ride immediately!

**Why Constructor Injection Wins**:
1. **Guaranteed Non-Null**: You cannot create the object without providing its required dependencies.
2. **Immutability**: Fields can be declared **\`final\`**, guaranteeing thread safety.
3. **Effortless Unit Testing**: In a JUnit test, you can simply write \`new PolicyService(mockRepo)\` with zero Spring framework overhead!`,
        keyIdea: 'Always use constructor injection with final fields for rock-solid immutability, thread safety, and effortless unit testing.',
        codeExample: {
          title: 'ConstructorInjectionBestPractice.java',
          code: `import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
public class PolicyServiceImpl implements PolicyService {
    // Immutable final dependencies:
    private final PolicyRepository policyRepository;
    private final NotificationClient notificationClient;

    // Explicit constructor injection (Spring automatically supplies beans):
    public PolicyServiceImpl(PolicyRepository policyRepository,
                             NotificationClient notificationClient) {
        this.policyRepository = Objects.requireNonNull(policyRepository, "Repository cannot be null");
        this.notificationClient = Objects.requireNonNull(notificationClient, "NotificationClient cannot be null");
    }

    @Override
    public String getPolicyStatus(String id) {
        return policyRepository.findStatusById(id);
    }
}`,
        },
        interviewTip: 'Why is constructor injection preferred over field injection? Constructor injection allows dependencies to be final (immutable), guarantees that objects are never in a half-initialized null state, and allows easy unit testing using simple mocks without needing Spring reflection.',
        diagramState: 'constructor-injection',
        diagramAlt: 'Architecture diagram illustrating ConstructorInjectionBestPractice.java: A bicycle with pedals in the box vs waiting for a mechanic to visit your house.',
      },
      {
        id: 'step-3',
        title: 'Spring Bean Lifecycle',
        subtitle: 'From assembly line factory to retirement',
        type: 'insight',
        content: `Think of a new car rolling off an automotive assembly line:
1. **Chassis Assembled**: The engine and frame are built (**Bean Instantiation**).
2. **Components Installed**: Seats, tires, and navigation are installed (**Populate Properties / Dependency Injection**).
3. **Inspection & Custom Badging**: The vehicle receives its VIN number and quality check (**Aware interfaces & BeanPostProcessor**).
4. **Ignition Test**: The engine is started for the first time (**\`@PostConstruct\` initialization**).
5. **Protective Wrap**: Special protective clear coat is applied to the paint (**AOP Proxies for \`@Transactional\` and security**).
6. **On the Road**: The car is driven by happy customers (**Serving live requests**).
7. **Recycling**: At the end of its life, oil and fluids are drained safely (**\`@PreDestroy\` cleanup**).

Understanding this lifecycle helps you know exactly where to place setup logic (like preloading caches in \`@PostConstruct\`) and teardown logic (closing connections in \`@PreDestroy\`).`,
        keyIdea: 'Spring beans pass through a structured lifecycle: constructor creation, dependency injection, @PostConstruct initialization, and @PreDestroy cleanup.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating From assembly line factory to retirement: From assembly line factory to retirement.',
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
        subtitle: 'A single blown fuse turning off an entire neighborhood',
        type: 'problem',
        content: `Think of old holiday tree lights wired in series: if a single tiny bulb blows out at the bottom of the tree, the entire strand of 100 lights goes pitch black! Or imagine a highway toll plaza where one toll booth gate gets stuck closed: within five minutes, cars back up for 10 miles, gridlocking the entire city.

In a microservices architecture, Service A calls Service B, which calls Service C:
- If Service C slows down due to high database load, Service B's threads sit frozen waiting for network sockets.
- Within 10 seconds, Service B runs out of available threads and crashes.
- Now Service A's threads sit frozen waiting on Service B, and Service A crashes too!

This domino effect is called a **Cascading Failure**.

To protect your system, modern microservices use defensive patterns:
- **Timeouts**: Never let a request wait indefinitely.
- **Circuit Breakers**: Cut off calls to a failing service before your own server runs out of threads.
- **Bulkheads**: Isolate thread pools so one slow feature cannot consume all server resources.`,
        keyIdea: 'Unprotected inter-service network calls lead to cascading failures by consuming all server worker threads; defensive patterns halt the chain reaction.',
        diagramState: 'cascading-failure',
        diagramAlt: 'Architecture diagram illustrating A single blown fuse turning off an entire neighborhood: A single blown fuse turning off an entire neighborhood.',
      },
      {
        id: 'step-2',
        title: 'The Circuit Breaker Pattern (Resilience4j)',
        subtitle: 'The electrical safety switch in your basement',
        type: 'solution',
        content: `Think of the electrical circuit breaker in your basement. If a toaster in your kitchen develops a short circuit and draws too much electrical current, the circuit breaker instantly trips to **OPEN**, cutting off electricity to that room before your house wiring catches fire!

In software, a **Circuit Breaker** (like **Resilience4j**) acts as an automated safety switch with 3 states:

1. **CLOSED (Normal Working State)**:
   Electricity flows freely. Requests pass through to the downstream service normally while the breaker monitors failure rates.
2. **OPEN (Tripped - Danger Zone)**:
   If failure rates exceed a threshold (e.g. over 50% of recent requests fail or time out), the switch trips **OPEN**! All future requests are rejected immediately without making any network call, instantly returning a friendly cached fallback response. This saves your server threads from freezing and gives the struggling downstream service room to breathe!
3. **HALF-OPEN (Trial Probe)**:
   After a cooldown period (e.g. 30 seconds), the breaker lets a tiny trickle of trial requests through. If they succeed, the breaker resets to **CLOSED**; if they fail, it trips back to **OPEN**.`,
        keyIdea: 'Circuit breakers prevent cascading crashes by failing fast when downstream services struggle, giving them time to heal.',
        codeExample: {
          title: 'Resilience4jCircuitBreaker.java',
          code: `import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;

@Service
public class PaymentGatewayClient {

    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    @Retry(name = "paymentService")
    public String authorizePayment(String accountId, double amount) {
        // Simulated network call to payment provider:
        return "SUCCESS: Transaction authorized for $" + amount;
    }

    // Fallback method executed immediately when circuit is OPEN:
    public String paymentFallback(String accountId, double amount, Throwable ex) {
        System.out.println("Payment service down! Triggering fallback for account: " + accountId);
        return "QUEUED: Payment queued for background reconciliation";
    }
}`,
        },
        diagramState: 'circuit-breaker',
        diagramAlt: 'Architecture diagram illustrating Resilience4jCircuitBreaker.java: The electrical safety switch in your basement.',
      },
      {
        id: 'step-3',
        title: 'API Gateway: Centralized Ingress',
        subtitle: 'The grand security lobby of a skyscraper',
        type: 'insight',
        content: `Imagine a skyscraper with 50 different company offices inside. You wouldn't build 50 separate outdoor staircases and 50 separate security guards on the sidewalk. Instead, everyone enters through the grand front lobby. The security guard checks ID, the turnstiles manage crowd flow, and the elevators route each visitor to the correct floor.

In distributed microservices, an **API Gateway** serves as this central front lobby:
- **Smart Routing**: Routes incoming requests (like \`/policies/**\` to the Policy service and \`/billing/**\` to the Billing service).
- **Authentication**: Validates user JWT tokens once at the front door so individual internal microservices don't have to duplicate security checks.
- **Rate Limiting**: Stops malicious bots and traffic spikes from overwhelming backend servers.`,
        keyIdea: 'An API Gateway provides a single hardened entry point for authentication, intelligent routing, and traffic rate limiting.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating The grand security lobby of a skyscraper: The grand security lobby of a skyscraper.',
      },
    ],
  },
];
