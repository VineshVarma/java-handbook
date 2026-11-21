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
        subtitle: 'Model resources, not RPC procedures',
        type: 'concept',
        content: `A core mistake in API design is treating REST like Remote Procedure Calls (RPC), creating URLs like \`/api/getPolicies\` or \`/api/updateCustomer\`.

True REST APIs model **Resources** using nouns in plural form:
- \`GET /api/v1/policies\` (Retrieve collection)
- \`POST /api/v1/policies\` (Create a new policy)
- \`GET /api/v1/policies/{id}\` (Retrieve a single item)
- \`PUT /api/v1/policies/{id}\` (Complete replacement)
- \`PATCH /api/v1/policies/{id}\` (Partial update)
- \`DELETE /api/v1/policies/{id}\` (Remove policy)

Nested resources express hierarchical relationships naturally:
\`GET /api/v1/policies/{policyId}/claims\``,
        keyIdea: 'Use nouns for resource URIs and let HTTP verbs specify the intended action.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'HTTP Methods: Safety & Idempotency',
        subtitle: 'Understanding the guarantees of standard HTTP verbs',
        type: 'insight',
        content: `Two concepts govern HTTP method contracts:
1. **Safe Methods**: Calling the method does NOT alter server state (read-only).
   - \`GET\`, \`HEAD\`, \`OPTIONS\` are safe.
2. **Idempotent Methods**: Making multiple identical requests produces the exact same outcome on server state as making a single request.
   - \`GET\`, \`PUT\`, and \`DELETE\` are **Idempotent**. If you send \`DELETE /policies/101\` ten times, the resource is deleted after the first call and stays deleted.
   - \`POST\` is **NOT Idempotent**. Sending ten \`POST\` requests creates ten separate resources unless deduplicated!
   - \`PATCH\` can be non-idempotent (e.g. \`PATCH /account { "balance": "+50" }\`).`,
        keyIdea: 'Idempotency guarantees that retrying network calls upon transient failure is safe and will not produce duplicate records.',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'HTTP Status Code Precision',
        subtitle: 'Communicating exact outcomes to API consumers',
        type: 'solution',
        content: `Avoid returning \`200 OK\` with an internal \`{ "success": false }\` error body. Use proper HTTP response codes:

- **2xx Success**:
  - \`200 OK\`: Standard successful response
  - \`201 Created\`: Resource created (include \`Location\` header with new URI)
  - \`204 No Content\`: Action succeeded with no body to return (e.g. DELETE)
- **4xx Client Errors**:
  - \`400 Bad Request\`: Validation failed
  - \`401 Unauthorized\`: Authentication missing or token expired
  - \`403 Forbidden\`: Authenticated user lacks RBAC permission
  - \`404 Not Found\`: Resource does not exist
  - \`409 Conflict\`: Resource already exists or state violation
- **5xx Server Errors**:
  - \`500 Internal Server Error\`: Unexpected server failure
  - \`502 Bad Gateway\` / \`503 Service Unavailable\`: Downstream dependency failure`,
        keyIdea: 'Accurate HTTP status codes allow client libraries and API gateways to make automated retry and routing decisions.',
        diagramState: 'recap',
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
        subtitle: 'The foundational security perimeter',
        type: 'concept',
        content: `In modern enterprise architectures:
- **Authentication (AuthN)**: Who are you? (Identity verification via credentials, MFA, or SSO).
- **Authorization (AuthZ)**: What are you permitted to do? (Permissions, Roles, Scopes).

The **OAuth2 Framework (RFC 6749)** defines four distinct roles:
1. **Resource Owner**: The end-user.
2. **Client**: The frontend Single Page App (SPA) or mobile application.
3. **Authorization Server**: Issues tokens upon user login (e.g. **ForgeRock Access Management / AM** or Keycloak).
4. **Resource Server**: The Spring Boot / JAX-RS backend microservice serving protected customer data.`,
        keyIdea: 'OAuth2 decouples user authentication from resource authorization using scoped access tokens.',
        diagramState: 'auth-request',
      },
      {
        id: 'step-2',
        title: 'The Structure of a JSON Web Token (JWT)',
        subtitle: 'Header, Claims Payload, and Cryptographic Signature',
        type: 'insight',
        content: `A **JSON Web Token (JWT)** (RFC 7519) is a compact, URL-safe, self-contained string containing three Base64URL-encoded segments separated by dots:
\`Header.Payload.Signature\`

1. **Header**: Algorithmic metadata:
   \`{ "alg": "RS256", "typ": "JWT", "kid": "key-2026-v1" }\`
2. **Payload (Claims)**: Application data and assertions:
   - Registered claims: \`iss\` (issuer), \`sub\` (user ID), \`exp\` (expiration epoch), \`iat\` (issued at)
   - Custom claims: \`roles: ["POLICY_ADMIN"]\`, \`policyIds: ["POL-101"]\`
3. **Signature**: Cryptographic proof generated using the private key of ForgeRock AM:
   \`RSASHA256(base64Url(header) + "." + base64Url(payload), privateKey)\``,
        keyIdea: 'Because the JWT signature is mathematically verified using the public key (JWKS), backend microservices can validate tokens without calling the database on every request!',
        codeExample: {
          title: 'JwtValidationFilter.java',
          code: `@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    private final JwtTokenValidator tokenValidator;

    public JwtAuthorizationFilter(JwtTokenValidator tokenValidator) {
        this.tokenValidator = tokenValidator;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = tokenValidator.validateAndExtractClaims(token);
                // Populate Spring Security Context
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(claims.getSubject(), null, extractAuthorities(claims));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException ex) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}`,
        },
        diagramState: 'jwt-mint',
      },
      {
        id: 'step-3',
        title: 'ForgeRock AM Integration: Token Refresh & Re-Signing',
        subtitle: 'Managing access token expiration and API Gateway contracts',
        type: 'solution',
        content: `Access tokens must have short lifespans (typically 5 to 15 minutes) to minimize damage if intercepted.

When an access token expires:
1. The client sends a secure refresh request containing a **Refresh Token**.
2. The backend integration layer calls **ForgeRock Access Management (AM)** APIs to validate the refresh session.
3. Upon approval, the backend receives fresh credentials, generates and re-signs application JWTs with the API Gateway key, and returns the renewed access token to the client.

This token refresh workflow ensures zero interruption to user transactions while preserving short-lived token security!`,
        keyIdea: 'Short-lived access tokens combined with secure refresh token rotation minimize security risk.',
        diagramState: 'bearer-dispatch',
      },
      {
        id: 'step-4',
        title: 'Secure Logout & Cookie Cleanup',
        subtitle: 'Preventing replay attacks after session termination',
        type: 'trade-off',
        content: `Because JWTs are stateless, they cannot be natively "deleted" from the server before their expiration time.

A complete enterprise logout sequence requires:
1. **Revocation Call to ForgeRock AM**: Invalidate the session on the central Identity Provider.
2. **Token Blacklisting**: Add the JTI (JWT ID) to a high-speed Redis distributed cache with a TTL equal to the remaining token lifespan.
3. **Browser Cookie Cleanup**: Clear \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` cookies by emitting zero-max-age response headers:
   \`Set-Cookie: session_token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict\``,
        keyIdea: 'Secure logout requires notifying the IdP, blacklisting the token in Redis, and clearing HttpOnly cookies.',
        diagramState: 'recap',
      },
    ],
  },
];
