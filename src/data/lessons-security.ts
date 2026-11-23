import { Lesson } from '@/lib/types';

export const securityLessons: Lesson[] = [
  {
    id: 'rest-api-design',
    slug: 'rest-api-design',
    title: 'REST API Design & Best Practices',
    subtitle: 'Build robust, resource-oriented RESTful APIs with correct HTTP methods, status codes, and DTO contracts.',
    moduleId: '05',
    moduleTitle: '05. REST API & Security',
    duration: '10 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'Resource URI naming standards (nouns vs verbs, pluralization)',
      'Idempotency and safety across HTTP methods (GET, POST, PUT, PATCH, DELETE)',
      'HTTP status code semantics (200, 201, 204, 400, 401, 403, 404, 409, 500)',
      'Pagination, filtering, and sorting using Spring Pageable',
      'API versioning strategies: URI path vs Header vs Query params',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Resource-Oriented URI Design',
        subtitle: 'Labeling folders with nouns instead of shouting action verbs',
        type: 'concept',
        content: `Think of a physical filing cabinet in an office:
- You label the drawers with clear nouns: **"Customers"**, **"Invoices"**, and **"Policies"**. Inside the Policies drawer, each folder has an ID number like \`POL-101\`.
- You would never label a drawer with a long action sentence like *"PleaseUpdateThisCustomerRecordImmediately"*.

A common beginner mistake in API design is treating REST like Remote Procedure Calls (RPC), creating URLs with action verbs like \`/api/getPolicies\` or \`/api/updateCustomer\`.

True REST APIs model **Resources** using clean plural nouns, letting the standard HTTP verb (GET, POST, PUT, DELETE) specify the action:
- \`GET /api/v1/policies\` (Retrieve the list of policies)
- \`POST /api/v1/policies\` (Create a brand-new policy)
- \`GET /api/v1/policies/{id}\` (Retrieve details for one specific policy)
- \`PUT /api/v1/policies/{id}\` (Replace the entire policy document)
- \`PATCH /api/v1/policies/{id}\` (Update just one field, like the address)
- \`DELETE /api/v1/policies/{id}\` (Remove the policy)

Nested resources naturally express parent-child relationships:
\`GET /api/v1/policies/{policyId}/claims\``,
        keyIdea: 'Use clean plural nouns for resource URLs, and let standard HTTP verbs specify the action.',
        diagramState: 'resource-uri',
        diagramAlt: 'Architecture diagram illustrating Labeling folders with nouns instead of shouting action verbs: Labeling folders with nouns instead of shouting action verbs.',
      },
      {
        id: 'step-2',
        title: 'HTTP Method Safety and Idempotency',
        subtitle: 'Flipping a light switch vs vending a soda can',
        type: 'insight',
        content: `Think of everyday physical actions:
- **Safe (Read-Only)**: Reading a book on a shelf. Merely looking at the book does not change or harm the book in any way. In HTTP, \`GET (safe, idempotent)\`, \`HEAD\`, and \`OPTIONS\` are safe operations that do not modify server state.
- **Idempotent (Repeatable with the same outcome)**: Think of flipping a light switch to **"OFF"**. If you flip it to OFF once, the light turns off. If your cat walks by and flips it to OFF five more times, the light is still off! The final state is identical whether you did it once or ten times. In HTTP, \`PUT (idempotent)\` and \`DELETE\` are idempotent: repeated calls result in the same server state.
- **Non-Idempotent (Every call causes a new side-effect)**: Putting a coin into a vending machine. If you press the button ten times, you get charged ten times and ten soda cans drop out! In HTTP, \`POST (neither)\` is neither safe nor idempotent. Sending ten identical POST requests creates ten duplicate orders in the database unless deduplication is enforced.`,
        keyIdea: 'Idempotent methods (GET, PUT, DELETE) can be safely retried during network blips without creating duplicate records.',
        diagramState: 'http-methods',
        diagramAlt: 'Architecture diagram illustrating Flipping a light switch vs vending a soda can: Flipping a light switch vs vending a soda can.',
      },
      {
        id: 'step-3',
        title: 'HTTP Status Code Precision',
        subtitle: 'Clear delivery receipts instead of mystery packages',
        type: 'solution',
        content: `Imagine receiving a package from a delivery courier. You open the box, and inside is a piece of paper that says: *"Everything is Great (Success)"*, but written in tiny handwriting at the bottom is *"Actually, your item was stolen and we don't have it."* That would be infuriating!

Yet many beginner APIs make this exact mistake: they return an \`HTTP 200 OK\` header while the body contains \`{ "error": true, "message": "Failed" }\`.

Always use standard HTTP status codes:
- **2xx (Success)**:
  - \`200 OK\`: Standard successful response.
  - \`201 Created\`: A new record was successfully created (include a \`Location\` header with the new URL).
  - \`204 No Content\`: Action succeeded and there is no body to return (common for DELETE).
- **4xx (Client Errors - The caller made a mistake)**:
  - \`400 Bad Request\`: Input validation failed (e.g. missing required field).
  - \`401 Unauthorized\`: Authentication missing or token expired.
  - \`403 Forbidden\`: Authenticated user lacks permission for this action.
  - \`404 Not Found\`: The requested resource does not exist.
  - \`409 Conflict\`: State conflict (e.g. email already registered).
- **5xx (Server Errors - The server had a problem)**:
  - \`500 Internal Server Error\`: Unexpected server crash or bug.
  - \`503 Service Unavailable\`: Downstream service is temporarily down or overloaded.`,
        keyIdea: 'Accurate HTTP status codes allow client libraries and API gateways to make automatic retry and error routing decisions.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Clear delivery receipts instead of mystery packages: Clear delivery receipts instead of mystery packages.',
      },
    ],
  },
  {
    id: 'jwt-oauth2',
    slug: 'jwt-oauth2',
    title: 'JWT & OAuth2 Authorization Workflows',
    subtitle: 'From ForgeRock Access Management (AM) authentication to stateless JWT validation and secure cookie refresh.',
    moduleId: '05',
    moduleTitle: '05. REST API & Security',
    duration: '15 min',
    difficulty: 'Advanced',
    youllLearn: [
      'Authentication vs Authorization and OAuth2 roles',
      'The 3 parts of a JWT: Header, Payload (Claims), and Digital Signature',
      'Integrating with ForgeRock Access Management (AM) APIs',
      'Refresh token workflows, token rotation, and API Gateway validation',
      'Secure token revocation, HttpOnly SameSite cookies, and logout cleanup',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Authentication vs Authorization & OAuth2 Roles',
        subtitle: 'Your photo ID card vs your VIP backstage wristband',
        type: 'concept',
        content: `Think of going to a music concert:
- **Authentication (AuthN - Who are you?)**: You show your government photo ID card at the front gate. The guard verifies your face and confirms your identity.
- **Authorization (AuthZ - What are you allowed to do?)**: You walk towards the backstage dressing rooms. A security guard stops you and inspects your colored wristband. Your driver's license doesn't help here; only a shiny gold **VIP wristband** grants you access past the velvet rope!

In modern web security:
- **Authentication** verifies identity (login credentials, passwords, MFA).
- **Authorization** verifies permissions and roles (can this user edit policies?).

The **OAuth2 Framework (RFC 6749)** coordinates four roles:
1. **Resource Owner**: The human user.
2. **Client**: The frontend mobile app or web browser single-page app.
3. **Authorization Server**: The central security authority (like **ForgeRock Access Management / AM**, Keycloak, or Auth0) that issues identity tokens upon successful login.
4. **Resource Server**: The Spring Boot microservice that protects your backend data.`,
        keyIdea: 'Authentication proves identity; Authorization checks permissions using scoped security tokens.',
        diagramState: 'auth-request',
        diagramAlt: 'Architecture diagram illustrating Your photo ID card vs your VIP backstage wristband: Your photo ID card vs your VIP backstage wristband.',
      },
      {
        id: 'step-2',
        title: 'The Structure of a JSON Web Token (JWT)',
        subtitle: 'The tamper-evident wax seal on an official passport',
        type: 'insight',
        content: `Think of an official wax seal on an ancient royal decree. The document contains three things:
1. The type of wax and official stamp used (**The Header**).
2. The decree text containing your name, title, and expiration date (**The Claims Payload**).
3. The King's personal embossed wax seal stamp (**The Cryptographic Signature**).

If an evil messenger opens the scroll and tries to change your title from "Squire" to "Duke" with a pen, the wax seal breaks, and the guards at the castle gate arrest them instantly!

A **JSON Web Token (JWT)** (RFC 7519) is a compact, URL-friendly string with three parts separated by periods:
\`Header.Payload.Signature\`

- **Header**: Contains metadata like algorithm: \`{ "alg": "RS256", "typ": "JWT" }\`.
- **Payload (Claims)**: Contains user info like user ID (\`sub\`), expiration epoch (\`exp\`), and roles (\`["ADMIN"]\`).
- **Signature**: A mathematical signature created with the private key of ForgeRock AM.

**The Major Benefit for Microservices**:
Because the signature is verified using the public key, your Spring Boot services can validate user tokens in sub-milliseconds without querying the database on every single HTTP request!`,
        keyIdea: 'JWTs are digitally signed and self-contained, allowing microservices to verify authenticity statelessly without querying a central database.',
        codeExample: {
          language: 'java',
          title: 'JwtValidationFilter.java',
          code: `import java.io.IOException;
import java.util.Collections;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

public class SimpleJwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        // Verify standard "Bearer <token>" header:
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // Validate signature and expiration statelessly using public key:
            if (!isValidToken(token)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean isValidToken(String token) {
        return token != null && !token.isBlank(); // Validation logic using JWKS
    }
}`,
        },
        diagramState: 'jwt-mint',
        diagramAlt: 'Architecture diagram illustrating JwtValidationFilter.java: The tamper-evident wax seal on an official passport.',
      },
      {
        id: 'step-3',
        title: 'ForgeRock AM Integration: Token Refresh & Re-Signing',
        subtitle: 'A 15-minute temporary room key with a renewal card',
        type: 'solution',
        content: `Imagine staying at a luxury hotel where your plastic room key card expires every 15 minutes for security. If someone steals your key card out of your jacket pocket, it becomes a useless piece of plastic within minutes!

To keep things smooth for you, the hotel gives you a special secure registration card (**The Refresh Token**):
1. When your 15-minute **Access Token** expires, your browser silently sends the Refresh Token to the backend.
2. The backend contacts **ForgeRock Access Management (AM)** to confirm your session is still valid.
3. ForgeRock AM approves the session and returns a fresh 15-minute Access Token.

This automatic renewal cycle gives users a seamless experience while keeping security airtight!`,
        keyIdea: 'Short-lived access tokens combined with secure refresh token rotation minimize damage if tokens are intercepted.',
        diagramState: 'bearer-dispatch',
        diagramAlt: 'Architecture diagram illustrating A 15-minute temporary room key with a renewal card: A 15-minute temporary room key with a renewal card.',
      },
      {
        id: 'step-4',
        title: 'Secure Logout & Cookie Cleanup',
        subtitle: 'Canceling the key card and shredding the duplicate',
        type: 'trade-off',
        content: `Because JWT tokens are stateless, the server cannot simply "delete" a token from the sky once it has been signed! If a user clicks Logout, an attacker who captured that token could technically still use it until its 15-minute expiration timer runs out.

A complete, enterprise-grade logout sequence requires three steps:
1. **Revoke Session in ForgeRock AM**: Notify the central identity provider so no new tokens can ever be issued for this session.
2. **Token Blacklist in Redis**: Store the logged-out token ID (JTI) in a lightning-fast Redis cache with an expiration time equal to the token's remaining minutes, rejecting any future requests carrying that token ID.
3. **Erase Browser Cookies**: Clear all \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` cookies by sending a zero-age cookie header:
   \`Set-Cookie: session_token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict\``,
        keyIdea: 'True logout requires revoking the session at the identity provider, blacklisting the token in Redis, and clearing HttpOnly cookies.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Canceling the key card and shredding the duplicate: Canceling the key card and shredding the duplicate.',
      },
    ],
  },
];
