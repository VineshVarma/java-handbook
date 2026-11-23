import { Lesson } from '@/lib/types';

export const securityLessons: Lesson[] = [
  {
    id: 'rest-api-design',
    slug: 'rest-api-design',
    title: 'REST API Design & Best Practices',
    subtitle: 'Resource-oriented URI design, HTTP method idempotency, status code precision, and pagination',
    moduleId: '05',
    moduleTitle: '05. REST API & Security',
    duration: '8 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'Resource URI naming standards (nouns vs verbs, pluralization)',
      'Idempotency and safety across HTTP methods (GET, POST, PUT, PATCH, DELETE)',
      'HTTP status code semantics (200, 201, 204, 400, 401, 403, 404, 409, 500)',
      'Pagination and sorting using Spring Pageable alongside Spring Data query filtering',
      'API versioning strategies: URI path vs Header vs Query params',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Resource-Oriented URI Design',
        subtitle: 'Labeling folders with nouns instead of shouting action verbs',
        duration: '2 min',
        type: 'concept',
        content: `Think of a physical filing cabinet in an office:
- You label the drawers with clear nouns: **"Customers"**, **"Invoices"**, and **"Policies"**. Inside the Policies drawer, each folder has an ID number like \`POL-101\`.
- Avoid labeling resource endpoints with action verbs or RPC phrases.

A common beginner mistake in API design is treating REST like Remote Procedure Calls (RPC), creating URLs with action verbs like \`/api/getPolicies\` or \`/api/updateCustomer\`.

True REST APIs model **Resources** using clean plural nouns, letting the standard HTTP verb (GET, POST, PUT, DELETE) specify the action:
- \`GET /api/v1/policies\` (Retrieve the list of policies)
- \`POST /api/v1/policies\` (Create a brand-new policy)
- \`GET /api/v1/policies/{id}\` (Retrieve details for one specific policy)
- \`PUT /api/v1/policies/{id}\` (Replace the entire policy document)
- \`PATCH /api/v1/policies/{id}\` (Update just one field, like the address)
- \`DELETE /api/v1/policies/{id}\` (Remove the policy)

Nested resources naturally express parent-child relationships:
\`GET /api/v1/policies/{policyId}/claims\`

**Resource URI naming standards**: RESTful conventions use plural nouns rather than verbs (\`/policies\`), standardizing pluralization across endpoint paths.

**Pagination and sorting using Spring Pageable with query filtering**: Controllers accept \`Pageable pageable\` to handle page boundaries and multi-field sorting, while filtering criteria are passed as query parameters and evaluated via Spring Data derived repository queries or dynamic \`Specification\` predicates over large resource collections.

**API versioning strategies**: Version API contracts via URI path (\`/api/v1\`), custom headers, or query params depending on caching and deprecation needs.`,
        keyIdea: 'Use clean plural nouns for resource URLs, and let standard HTTP verbs specify the action.',
        diagramState: 'resource-uri',
        diagramAlt: 'Architecture diagram illustrating Labeling folders with nouns instead of shouting action verbs: Labeling folders with nouns instead of shouting action verbs.',
      },
      {
        id: 'step-2',
        title: 'HTTP Safety and Idempotency',
        subtitle: 'Flipping a light switch vs vending a soda can',
        duration: '3 min',
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
        duration: '3 min',
        type: 'solution',
        content: `Imagine receiving a package from a delivery courier. You open the box, and inside is a piece of paper that says: *"Everything is Great (Success)"*, but written in tiny handwriting at the bottom is *"Actually, your item was stolen and we don't have it."* That would be infuriating!

Yet many beginner APIs make this exact mistake: they return an \`HTTP 200 OK\` header while the body contains \`{ "error": true, "message": "Failed" }\`.

Adhere to standard HTTP status codes:
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
    duration: '14 min',
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
        title: 'Authentication Authorization OAuth2 Roles',
        subtitle: 'Your photo ID card vs your VIP backstage wristband',
        duration: '4 min',
        type: 'concept',
        content: `Think of attending an enterprise music festival:
- **Authentication (AuthN - Who are you?)**: You present your government photo ID card at the perimeter gate. The guard verifies your identity and confirms your credentials.
- **Authorization (AuthZ - What are you allowed to do?)**: You walk towards the stage dressing rooms. A security guard inspects your wristband. Your driver license is insufficient here; only a gold **VIP wristband** grants entry past the velvet rope.

In modern distributed security:
- **Authentication** verifies caller identity (passwords, WebAuthn, MFA).
- **Authorization** evaluates permissions and scopes (whether this identity can read or update policy records).

The **OAuth2 Framework (RFC 6749)** coordinates four primary roles:
1. **Resource Owner**: The human end-user who grants access to their protected resources.
2. **Client**: The frontend Single-Page Application (SPA) or mobile client initiating requests on behalf of the user.
3. **Authorization Server**: The central security authority (such as **ForgeRock Access Management / AM**, Keycloak, or Okta) that authenticates users and mints cryptographically signed tokens.
4. **Resource Server**: The Spring Boot microservice hosting protected endpoints.

### Access Tokens vs ID Tokens: A Critical Distinction
A common security flaw is conflating OAuth2 Access Tokens with OpenID Connect (OIDC) ID Tokens:
- **OAuth2 Access Tokens**: Scoped authorization credentials issued specifically for **Resource Servers** (APIs). They can be opaque strings or structured JWTs containing scopes (such as \`policies:read\`, \`claims:write\`). Resource Servers inspect access tokens to authorize endpoint operations. Resource Servers must accept only access tokens.
- **OIDC ID Tokens**: Identity assertions issued specifically for the **Client application** (frontend UI). Formatted as JWTs per the OIDC Core specification, they contain user profile assertions (\`sub\`, \`email\`, \`name\`, \`auth_time\`). Frontend clients consume ID tokens to render user profiles. Resource Servers must reject ID tokens when presented for API authorization.

### OIDC Authorization Code Flow with PKCE
For browser Single-Page Apps and mobile apps where client secrets cannot be securely stored, the **Authorization Code Flow with PKCE (Proof Key for Code Exchange, RFC 7636)** prevents authorization code interception:
1. **Code Verifier**: The client generates a high-entropy cryptographic random string (43 to 128 characters).
2. **Code Challenge**: The client derives \`code_challenge = BASE64URL(SHA256(code_verifier))\` with \`code_challenge_method=S256\`.
3. **Authorization Request**: The client redirects the browser to the Authorization Server \`/authorize\` endpoint with the \`code_challenge\` and a cryptographic \`state\` parameter to mitigate Cross-Site Request Forgery (CSRF).
4. **Authorization Code**: Following user authentication, the Authorization Server returns a short-lived authorization code via redirect callback.
5. **Secure Token Exchange**: The client directly POSTs the authorization code and original plaintext \`code_verifier\` to the \`/token\` endpoint over TLS. The Authorization Server hashes the verifier using SHA-256; if it matches the stored challenge, it issues the access and refresh tokens. Intercepted authorization codes cannot be exchanged without the client code verifier.`,
        keyIdea: 'Authentication proves identity; Authorization checks permissions using scoped security tokens.',
        diagramState: 'auth-request',
        diagramAlt: 'Architecture diagram illustrating Your photo ID card vs your VIP backstage wristband: Your photo ID card vs your VIP backstage wristband.',
      },
      {
        id: 'step-2',
        title: 'JSON Web Token Structure',
        subtitle: 'The tamper-evident wax seal on an official passport',
        duration: '4 min',
        type: 'insight',
        content: `Think of an official wax seal on an ancient royal decree. The document contains three elements:
1. The type of wax and official stamp used (**The Header**).
2. The decree text containing subject identifier, issuer, and expiration date (**The Claims Payload**).
3. The sovereign embossed wax seal stamp (**The Cryptographic Signature**).

If an untrusted carrier attempts to modify the text from "Squire" to "Duke", the seal breaks and inspection at the gate detects tampering immediately.

A **JSON Web Token (JWT)** (RFC 7519) consists of three Base64URL-encoded parts concatenated by periods:
\`Header.Payload.Signature\`

- **Header**: Contains cryptographic metadata: \`{ "alg": "RS256", "typ": "JWT", "kid": "key-2026-prod" }\`.
- **Payload (Claims)**: Contains standard claims including subject (\`sub\`), issuer (\`iss\`), audience (\`aud\`), expiration (\`exp\`), and custom roles (\`["ROLE_USER"]\`).
- **Signature**: A mathematical signature computed over \`Base64URL(Header) + "." + Base64URL(Payload)\`.

### Symmetric HS256 vs Asymmetric RS256 in Microservices
Choosing the appropriate cryptographic signing algorithm is vital for distributed microservice security:
- **Symmetric HS256 (HMAC-SHA256) Architectural Flaw**: HS256 uses the identical secret key for both token signing and token verification. If 20 downstream microservices validate JWTs, all 20 services must store the master HMAC secret. If an attacker breaches even one low-privilege service, they extract the secret and can forge arbitrary tokens with elevated roles across every service in the enterprise.
- **Asymmetric RS256 (RSA-SHA256) Best Practice**: The Authorization Server maintains the private key in an HSM or secure key vault and signs tokens. Downstream resource servers only hold the public key to verify signatures. Even if a downstream microservice is compromised, the attacker cannot forge tokens or elevate privileges.

### JWKS Endpoint and Dynamic Key Rotation
To avoid hardcoding public keys in microservice configuration, production architectures use a **JSON Web Key Set (JWKS)**:
- **Distribution via \`/.well-known/jwks.json\`**: The Authorization Server exposes its active public keys at a standardized JWKS endpoint. Each key contains a unique Key ID (\`kid\`), algorithm (\`alg\`), and public exponent/modulus.
- **In-Memory Caching & TTL**: Microservices fetch and cache JWKS public keys in memory with a Time-To-Live (TTL, typically 12 to 24 hours), preventing network latency on every API call.
- **Zero-Downtime Key Rotation**: When keys rotate, the Authorization Server publishes a new key pair with a new \`kid\`. If a resource server encounters a valid token with an unrecognized \`kid\`, it performs an on-demand, rate-limited refresh against the JWKS endpoint before rejecting the request, enabling seamless key transitions.`,
        keyIdea: 'JWTs are digitally signed and self-contained, allowing microservices to verify authenticity statelessly without querying a central database.',
        codeExample: {
          language: 'java',
          title: 'JwtValidationFilter.java',
          code: `import java.io.IOException;
import java.security.PublicKey;
import java.time.Instant;
import java.util.List;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtValidationFilter extends OncePerRequestFilter {

    private final JwksKeyCache jwksKeyCache;
    private final String expectedIssuer;
    private final String expectedAudience;

    public JwtValidationFilter(JwksKeyCache jwksKeyCache, String expectedIssuer, String expectedAudience) {
        this.jwksKeyCache = jwksKeyCache;
        this.expectedIssuer = expectedIssuer;
        this.expectedAudience = expectedAudience;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        // 1. Strict Fail-Closed Security: Abort immediately if missing or non-Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setHeader("WWW-Authenticate",
                "Bearer error=\\"invalid_token\\", error_description=\\"Missing or malformed Authorization header\\"");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }

        String token = authHeader.substring(7).trim();

        try {
            // 2. Cryptographic Signature Verification via cached JWKS & kid lookup
            String kid = extractKeyId(token);
            PublicKey publicKey = jwksKeyCache.get(kid);
            if (publicKey == null) {
                // On-demand refresh against /.well-known/jwks.json on unknown kid
                publicKey = jwksKeyCache.refreshAndGet(kid);
                if (publicKey == null) {
                    sendUnauthorized(response, "Unknown or rotated key ID (kid)");
                    return;
                }
            }

            if (!verifySignature(token, publicKey)) {
                sendUnauthorized(response, "Invalid cryptographic signature");
                return;
            }

            // 3. Claims Verification: exp, iss, aud, nbf
            Claims claims = parseClaims(token);
            Instant now = Instant.now();

            if (claims.getExpiration() == null || claims.getExpiration().isBefore(now)) {
                sendUnauthorized(response, "Token has expired (exp claim)");
                return;
            }
            if (claims.getNotBefore() != null && claims.getNotBefore().isAfter(now)) {
                sendUnauthorized(response, "Token not active yet (nbf claim)");
                return;
            }
            if (!expectedIssuer.equals(claims.getIssuer())) {
                sendUnauthorized(response, "Untrusted token issuer (iss claim)");
                return;
            }
            if (claims.getAudience() == null || !claims.getAudience().contains(expectedAudience)) {
                sendUnauthorized(response, "Audience claim mismatch (aud claim)");
                return;
            }

            // 4. Populate Spring Security Context
            List<SimpleGrantedAuthority> authorities = claims.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .toList();

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(),
                    null,
                    authorities
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception ex) {
            sendUnauthorized(response, "Token parsing or validation failure");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String description) throws IOException {
        response.setHeader("WWW-Authenticate",
            "Bearer error=\\"invalid_token\\", error_description=\\"" + description + "\\"");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }

    private String extractKeyId(String token) {
        return "rsa-key-2026"; // Extracted from decoded JWT header {"alg":"RS256","kid":"..."}
    }

    private boolean verifySignature(String token, PublicKey key) {
        return key != null && !token.isBlank(); // Signature verification via java.security.Signature
    }

    private Claims parseClaims(String token) {
        return new Claims("user_123", expectedIssuer, List.of(expectedAudience),
                Instant.now().plusSeconds(900), Instant.now().minusSeconds(10), List.of("USER"));
    }

    public interface JwksKeyCache {
        PublicKey get(String kid);
        PublicKey refreshAndGet(String kid);
    }

    public record Claims(
        String subject,
        String issuer,
        List<String> audience,
        Instant expiration,
        Instant notBefore,
        List<String> roles
    ) {
        public String getSubject() { return subject; }
        public String getIssuer() { return issuer; }
        public List<String> getAudience() { return audience; }
        public Instant getExpiration() { return expiration; }
        public Instant getNotBefore() { return notBefore; }
        public List<String> getRoles() { return roles; }
    }
}`,
        },
        diagramState: 'jwt-mint',
        diagramAlt: 'Architecture diagram illustrating JwtValidationFilter.java: The tamper-evident wax seal on an official passport.',
      },
      {
        id: 'step-3',
        title: 'Token Refresh and Rotation',
        subtitle: 'A 15-minute temporary room key with a renewal card',
        duration: '2 min',
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
        title: 'Secure Logout Cookie Revocation',
        subtitle: 'Canceling the key card and shredding the duplicate',
        duration: '4 min',
        type: 'trade-off',
        content: `Because signed JWTs are self-contained and immutable, an application cannot simply delete a token from remote memory once minted. If an attacker captures an access token, they could use it until its expiration timestamp elapses.

### Resolving the Statelessness vs Token Revocation Contradiction
This creates an architectural tension in distributed systems:
- Pure stateless token validation avoids central database lookups, giving high throughput and linear scalability.
- Immediate token revocation requires tracking revoked token IDs (\`jti\`), which reintroduces state.
- If every microservice checks a central Redis cluster for every request, the architecture loses pure statelessness and reintroduces distributed cache dependency and network latency.

### The Modern Enterprise Hybrid Pattern
Production systems resolve this trade-off using a tiered defense:
1. **Short-Lived Access Tokens (5 to 15 Minutes)**: Access tokens expire quickly. Resource servers validate them purely statelessly using cached JWKS public keys without contacting any database or cache.
2. **Bounded Exposure Window**: If an access token leaks, the exposure window is strictly capped by its short remaining lifespan.
3. **Stateful Refresh Token Rotation**: Long-lived refresh tokens (7 to 30 days) are tracked statefully at the central Authorization Server (such as ForgeRock AM or Redis). During token refresh, the client presents the refresh token; the server revokes it and issues a fresh refresh token alongside a new access token. If an old refresh token is reused, the server detects token theft and invalidates the entire token lineage.
4. **Enterprise Logout & Cleanup**: On logout, the client-side authentication cookies are erased (\`Set-Cookie: access_token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict\`), and the Authorization Server immediately revokes the refresh token family. For high-security environments, revoked \`jti\` values are published via Redis Pub/Sub to API gateways to reject compromised access tokens during their remaining minutes.

### Security Limitations: What This Architecture Does NOT Protect Against
Even with fail-closed filters and asymmetric RS256 JWKS verification, backend engineers must defend against five critical threat vectors:
1. **XSS Token Exfiltration (localStorage)**: Storing JWT tokens in \`localStorage\` or \`sessionStorage\` exposes them to Cross-Site Scripting (XSS). Any injected script can read storage and exfiltrate tokens. Tokens must be stored in secure \`HttpOnly\`, \`SameSite=Strict\` cookies inaccessible to JavaScript.
2. **CSRF on Ambient Cookie Requests**: When authentication tokens reside in browser cookies, cross-site requests automatically attach cookies unless mitigated by \`SameSite=Strict\`, custom headers (such as \`X-Requested-With\`), or anti-CSRF challenge tokens.
3. **Replay Attacks Within Validity Window**: Stateless signature validation cannot determine whether an authentic token was intercepted and replayed prior to expiration. Replay windows must be minimized using short token lifetimes and mutual TLS (mTLS).
4. **Man-in-the-Middle (MITM) on Internal Networks**: If TLS terminates prematurely at an external edge load balancer, internal traffic travels unencrypted. Attackers with internal packet visibility can inspect Bearer tokens. End-to-end TLS or internal service-mesh mTLS must protect all microservice hops.
5. **Algorithm Confusion Attacks**: Attackers may tamper with the JWT header by changing \`alg\` to \`HS256\` while signing with the server public RSA key as the HMAC secret. Verification libraries must enforce an explicit server-side algorithm whitelist (\`RS256\` only) and reject client-dictated algorithm switching.`,
        keyIdea: 'True logout requires revoking the session at the identity provider, blacklisting the token in Redis, and clearing HttpOnly cookies.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Canceling the key card and shredding the duplicate: Canceling the key card and shredding the duplicate.',
      },
    ],
  },
];
