Here is the full detailed design document as plain Markdown text, no embedded code blocks:

# Login & Authentication: Detailed Design Document

*Version: 2.0*
*Date: 2025-11-25*
*Author: John Boen*

## 1. Purpose & Scope

This document defines the authentication and login / signup functionality for the application. It covers:

* User signup via email + password, with email confirmation required to activate the account.
* Login via email + password.
* Forgot/Reset password flow.
* Login / Signup via common social identity providers (Google, Facebook, LinkedIn).
* Security- and usability-related requirements.
* REST API endpoints, data-model, and integration points.

**Implementation Strategy:**

This design supports multiple authentication methods and backend data stores through a modular architecture:

* **Common Components**: Shared REST API interface, authentication logic, token management, and email services that work across all implementations.
* **Primary Implementation Path**: Standard email/password authentication with AWS backend (DynamoDB + Lambda + API Gateway + SES).
* **Future Implementations**: Additional authentication methods (social login) and backend options (Azure, Google Cloud, Supabase, Back4App) will be added incrementally.

**Out of scope:**

* Multi-factor authentication (MFA) beyond email/password + social login (may be added later).
* Passwordless “magic link” login (could be added later).
* Deep single sign-on across many enterprise domains.

## 2. Actors & User Journeys

### 2.1 Actors

* **User (Unregistered)**: visits site, chooses to sign up or login.
* **User (Registered)**: has an account; may be unverified (email not confirmed) or verified.
* **System / API Backend**: processes signup, login, password reset, social-auth integration.
* **Identity Provider**: external OAuth/OIDC providers (Google, Facebook, LinkedIn).

### 2.2 Key User Journeys

#### 2.2.1 Email Signup → Email Confirmation

1. User visits “Sign Up” screen.
2. User enters email + desired password (plus any optional profile fields).
3. System creates a new user record in “pending” state (emailUnconfirmed flag).
4. System sends a confirmation email containing a time-limited token/link.
5. User clicks the link → backend validates token, marks user as emailConfirmed = true, activates account.
6. User is redirected (or shown screen) “Your email is confirmed, please login”.

#### 2.2.2 Email Login

1. User visits “Login” screen, enters email + password.
2. System verifies credentials.

   * If email not confirmed yet → show message: “Please confirm your email first”.
   * If confirmed → generate session / token, return to client.
3. On login success: create login session.
4. On failure: return generic error “Invalid credentials” (to avoid user enumeration).

#### 2.2.3 Forgot Password → Reset

1. On login screen user clicks “Forgot Password”.
2. User enters email address.
3. System verifies email exists (but respond generically).
4. If exists: system generates a time-limited password-reset token, sends email with link.
5. User clicks link, opens reset screen, enters new password (confirm field).
6. System verifies token, updates user password (hash + salt), invalidates related sessions/tokens optionally.
7. System responds “Password reset successful – you may now login”.

#### 2.2.4 Social Login / Signup (Google, Facebook, LinkedIn)

1. On login/signup screen user selects e.g. “Continue with Google”.
2. System redirects to provider’s OAuth/OIDC flow.
3. On return, backend receives identity provider’s token/claim.
4. System finds or creates user record:

   * If social account already linked to a user → login that user.
   * If no record → create new user with socialId, mark emailConfirmed=true (if provider has verified email), prompt user (optional) to fill missing profile data.
5. Generate session/token as in email login.

## 3. Requirements

### 3.1 Functional Requirements

* FR1: Users must be able to signup with email + password.
* FR2: Upon signup user must confirm their email before full access is granted.
* FR3: Users must be able to login with confirmed email + password.
* FR4: Users must be able to login via Google, Facebook, LinkedIn.
* FR5: Users must be able to initiate “forgot password” and complete a password reset.
* FR6: System must create and manage login sessions or JWT tokens for authenticated users.
* FR7: System must allow linking of multiple social providers to one user (optional future).
* FR8: System must handle invalid credentials, expired tokens, and other error states gracefully.

### 3.2 Non-Functional / Security Requirements

* NFR1: Passwords must be stored hashed + salted (e.g., bcrypt, Argon2).
* NFR2: Email confirmation tokens and password-reset tokens must be time-limited (e.g., expire in 1 hour).
* NFR3: Use secure token storage; tokens should be single-use and invalidated upon use.
* NFR4: Use secure session/cookie handling or stateless JWTs with appropriate expiration and refresh logic.
* NFR5: Protect against brute-force & credential stuffing (rate-limit login attempts).
* NFR6: Follow authentication best practices (e.g., OWASP Authentication Cheat Sheet).
* NFR7: For social login use OAuth2/OIDC standards with secure flows.
* NFR8: Logging of authentication events (success/fail) for audit purposes.
* NFR9: Session logout/invalidation support.
* NFR10: Configurable for multiple backend data stores (per your earlier requirement).

### 3.3 Usability / UX Requirements

* UR1: Provide clear user messages (e.g., “Confirmation email sent, check your inbox”).
* UR2: Minimal friction login/signup flow; skip confirmation step if user logs in via social provider with verified email.
* UR3: Provide password strength feedback on signup.
* UR4: Allow “remember me” option (optional) for longer sessions.
* UR5: Clear UI for linking/unlinking social accounts (future).

## 4. Data Model

### 4.1 User Entity

| Field          | Type        | Description                                       |
| -------------- | ----------- | ------------------------------------------------- |
| id             | UUID/string | Primary key unique user identifier.               |
| email          | String      | User’s email (unique index).                      |
| emailConfirmed | Boolean     | Whether email has been confirmed.                 |
| passwordHash   | String      | Hashed password (if email signup).                |
| status         | Enum        | “active”, “pending”, “disabled”.                  |
| provider       | Enum        | “email”, “google”, “facebook”, “linkedin”.        |
| providerId     | String      | ID from social provider (if provider != “email”). |
| displayName    | String      | User’s display name.                              |
| avatarUrl      | String      | Link to user’s avatar image.                      |
| createdAt      | Timestamp   | Account creation time.                            |
| updatedAt      | Timestamp   | Last updated time.                                |

### 4.2 EmailConfirmationToken Entity

| Field  | Type      | Description                          |
| ------ | --------- | ------------------------------------ |
| token  | String    | Secure random token.                 |
| userId | UUID      | Reference to user entity.            |
| expiry | Timestamp | When the token expires.              |
| used   | Boolean   | Whether the token has been consumed. |

### 4.3 PasswordResetToken Entity

| Field  | Type      | Description                          |
| ------ | --------- | ------------------------------------ |
| token  | String    | Secure random token.                 |
| userId | UUID      | Reference to user entity.            |
| expiry | Timestamp | When the token expires.              |
| used   | Boolean   | Whether the token has been consumed. |

### 4.4 Session / JWT Claims (if using stateless)

If using JWTs instead of session table: include claims:

* sub = userId
* iat = issued at timestamp
* exp = expiration timestamp (e.g., 1 hour)
* optionally: provider, emailConfirmed flag

## 5. API Endpoints

Here are the REST endpoints (HTTP methods + paths) for authentication. All responses use standard JSON with status codes and error codes.

### 5.1 POST /api/auth/signup

Request:
{ "email": "[user@example.com](mailto:user@example.com)", "password": "P@ssw0rd", "displayName": "User Name" }
Response (202 Accepted):
{ "message": "Signup successful. Please check your email to confirm your account." }
Errors:

* 400 Bad Request – invalid input (weak password, missing field).
* 409 Conflict – email already exists.

### 5.2 GET /api/auth/confirm?token=<token>

Description: user clicks the link in email.
Response (200 OK):
{ "message": "Email confirmed. You may now login." }
Errors:

* 400 Bad Request – token missing or malformed.
* 410 Gone – token expired or used.
* 409 Conflict – email already confirmed.

### 5.3 POST /api/auth/login

Request:
{ "email": "[user@example.com](mailto:user@example.com)", "password": "P@ssw0rd" }
Response (200 OK):
{ "token": "<jwt-or-session-id>", "expiresIn": 3600, "user": { "id": "...", "email": "...", "displayName": "...", "emailConfirmed": true } }
Errors:

* 400 Bad Request – missing fields.
* 401 Unauthorized – invalid credentials or email not confirmed.
* 429 Too Many Requests – rate limit exceeded.

### 5.4 POST /api/auth/forgot-password

Request:
{ "email": "[user@example.com](mailto:user@example.com)" }
Response (200 OK):
{ "message": "If the email exists in our system, a reset link has been sent." }
(Always respond 200)
Errors:

* 400 Bad Request – invalid email format.

### 5.5 POST /api/auth/reset-password

Request:
{ "token": "<reset-token>", "newPassword": "NewP@ss123" }
Response (200 OK):
{ "message": "Password has been reset. You may now login." }
Errors:

* 400 Bad Request – missing/weak password.
* 410 Gone – token expired or already used.
* 400 Bad Request – token invalid.

### 5.6 GET /api/auth/providers

Response (200 OK):
{ "providers": [ { "name": "google", "displayName": "Google" }, { "name": "facebook", "displayName": "Facebook" }, { "name": "linkedin", "displayName": "LinkedIn" } ] }

### 5.7 GET /api/auth/oauth/callback/{provider}

Description: OAuth callback for social login.
Flow: user initiates login via front-end → redirect to provider. Provider returns to this endpoint with code/state. Backend exchanges code, obtains user info, signs in or signs up user. Backend issues session/token and redirects user back to frontend with token or secure cookie.
Response (302 Redirect) to frontend URL with token set or via HTTP-only cookie.

### 5.8 POST /api/auth/logout

Request: Authorization header or session cookie present.
Response (200 OK):
{ "message": "Logged out successfully." }
Behavior: Invalidate session or JWT (if using token blacklist).

## 6. Session / Token Strategy

* Use JWT with short expiration (e.g., 1 hour) and refresh token in secure HTTP-only cookie or local storage (depending on architecture).
* Or use server-side session table with session ID in secure HTTP-only cookie (safer for many scenarios).
* On logout or password reset, invalidate any active sessions/tokens for that user—may require token blacklist or versioning in user record.
* Limit session count per user if needed (optional).
* For social login, treat provider login equivalently with issuance of token/session.

## 7. Social Provider Integration

* Support Google, Facebook, LinkedIn.
* For each provider: register app in provider’s developer portal, obtain client ID/secret, configure redirect URI.
* Use OAuth2 Authorization Code flow (with PKCE for public clients) or standard for web server.
* On callback: verify state parameter, exchange code for access token (and optionally ID token).
* Extract user info: email, name, provider id.
* If email is verified according to provider claims → mark `emailConfirmed = true`.
* Link or create user record accordingly.
* Optional: allow linking additional providers in user settings.

## 8. Email Confirmation & Reset Token Handling

* Generate cryptographically secure random token (e.g., 128 bits) and store only its hash in DB; send raw token to user via email.
* Store token record with userId, expiry timestamp (e.g., now + 1 hour or configurable).
* On use: lookup token hash, verify not expired, mark used=true, then proceed.
* Clean up expired tokens periodically (cron job, TTL).
* Email templates must avoid exposing internal IDs; include friendly message and link.

## 9. Security Considerations & Threat Mitigation

* Use HTTPS everywhere.
* Salt + hash passwords (bcrypt/Argon2) — avoid plain text.
* Rate-limit login attempts and forgot-password requests (to prevent enumeration, brute force).
* On login success/fail, log events (timestamp, IP, userId if known).
* On password reset, optionally notify user of change (email “Your password was changed”).
* On social login, ensure provider token is validated and origin/redirect URIs match.
* Use secure cookies (HttpOnly, Secure, SameSite) if cookies used.
* Avoid storing JWT in localStorage if XSS is a risk — prefer HTTP-only cookies.
* Encourage strong password creation (password strength meter).
* Consider adding MFA later for elevated security.
* Review authentication event logs and monitor for suspicious behavior.

## 10. Configuration & Switchable Backends

Since this system supports multiple data sources and authentication methods, the architecture uses abstraction layers:

### 10.1 Common Components (Backend-Agnostic)

These components are shared across all implementations:

* **REST API Interface**: Standard HTTP endpoints defined in Section 5 (all backends expose the same API contract).
* **Authentication Logic**: Password hashing, token generation, email validation, rate limiting.
* **Email Service Abstraction**: Interface for sending emails (implementations for AWS SES, SendGrid, etc.).
* **Token Management**: JWT generation/validation, token expiry logic.
* **Request/Response Models**: Standard JSON schemas for all API endpoints.
* **Validation Layer**: Input validation, password strength checking, email format validation.
* **Error Handling**: Standardized error codes and messages.

### 10.2 Backend-Specific Components

These components vary by backend implementation:

* **Storage Layer Interface**: `UserRepository`, `TokenRepository`, `SessionRepository` with implementations for each backend:
  - **AWS**: DynamoDB tables, Lambda functions, API Gateway
  - **Azure**: Cosmos DB, Azure Functions, API Management
  - **Google Cloud**: Firestore, Cloud Functions, Cloud Endpoints
  - **Supabase**: PostgreSQL with Supabase client SDK
  - **Back4App**: Parse Server SDK
* **Infrastructure Configuration**: Deployment scripts, resource definitions (CloudFormation, Terraform, etc.).
* **Connection Management**: Database clients, connection pooling, credential management.

### 10.3 Configuration Strategy

* **Environment Variables**: Backend selector, database credentials, API keys, OAuth client IDs/secrets.
* **Feature Flags**: Email confirmation required, password complexity policy, token expiry times, enabled auth providers.
* **Backend Selector**: Single config variable to switch between implementations (e.g., `AUTH_BACKEND=aws|azure|gcp|supabase|back4app`).
* **Provider Configuration**: JSON/YAML config file listing enabled OAuth providers with their credentials.

### 10.4 AWS Implementation Details (Primary Path)

The first implementation uses AWS services:

**Infrastructure Components:**
* **API Gateway**: REST API endpoints with CORS, request validation, rate limiting.
* **Lambda Functions**: Serverless compute for each auth endpoint (signup, login, confirm, etc.).
* **DynamoDB Tables**:
  - `Users`: User records with GSI on email for fast lookup
  - `EmailConfirmationTokens`: Confirmation tokens with TTL for auto-cleanup
  - `PasswordResetTokens`: Reset tokens with TTL for auto-cleanup
  - `Sessions`: Active sessions (if using server-side sessions instead of JWT)
  - `AuthenticationEvents`: Audit log of auth events
* **SES (Simple Email Service)**: Email delivery for confirmations and password resets.
* **Secrets Manager**: Store sensitive configuration (JWT secret, OAuth credentials).
* **CloudWatch**: Logging and monitoring for Lambda functions.
* **IAM Roles**: Least-privilege access for Lambda functions to DynamoDB, SES, Secrets Manager.

**DynamoDB Schema Design:**

Users Table:
- Partition Key: `userId` (UUID)
- GSI: `email-index` (email as partition key for unique constraint and fast lookup)
- Attributes: email, emailConfirmed, passwordHash, status, provider, providerId, displayName, avatarUrl, createdAt, updatedAt

EmailConfirmationTokens Table:
- Partition Key: `token` (hashed token value)
- TTL Attribute: `expiry` (DynamoDB auto-deletes expired records)
- Attributes: userId, expiry, used

PasswordResetTokens Table:
- Partition Key: `token` (hashed token value)
- TTL Attribute: `expiry`
- Attributes: userId, expiry, used

Sessions Table (if using server-side sessions):
- Partition Key: `sessionId`
- TTL Attribute: `expiry`
- Attributes: userId, createdAt, expiry, ipAddress, userAgent

AuthenticationEvents Table:
- Partition Key: `eventId` (UUID)
- GSI: `userId-timestamp-index` for querying user's auth history
- Attributes: userId, email, eventType, outcome, timestamp, ipAddress, userAgent

**Lambda Function Organization:**
- `auth-signup`: Handles POST /api/auth/signup
- `auth-confirm`: Handles GET /api/auth/confirm
- `auth-login`: Handles POST /api/auth/login
- `auth-logout`: Handles POST /api/auth/logout
- `auth-forgot-password`: Handles POST /api/auth/forgot-password
- `auth-reset-password`: Handles POST /api/auth/reset-password
- `auth-providers`: Handles GET /api/auth/providers
- `auth-oauth-callback`: Handles GET /api/auth/oauth/callback/{provider}

**Shared Lambda Layer:**
- Common utilities (password hashing, token generation, DynamoDB helpers)
- Validation functions
- Error handling utilities
- JWT utilities

**Cost Optimization:**
- Use DynamoDB on-demand pricing for low traffic
- Lambda functions with minimal memory allocation (128-256 MB)
- SES sandbox mode for development (production requires verification)
- CloudWatch log retention set to 7-30 days

## 11. Logging & Analytics

* Record events: signup (email entered), email confirmed, login success/fail, password reset requested, password reset completed, social login success/fail.
* Store: userId (or email), timestamp, IP, user agent, event type, outcome.
* Analytics: number of new signups/day, number of unconfirmed accounts, failed login attempts/day, etc.
* Use logs for security audits and to monitor for suspicious patterns (e.g., many failed logins).

## 12. UI/UX Flows (Summary)

* Signup page → email + password → “Thank you, check your email” message.
* Email confirmation page → “Your email is confirmed – please login”.
* Login page → email + password + social login buttons.
* Forgot password link on login page.
* Reset password page → new password entry → “Password reset successful” message.
* Once logged in: user may see “Logout” button, optional “Link social account” screen (future).

## 13. Performance & Scalability

* For “a few hundred transactions per day”, simple data stores suffice. Token tables should handle few hundred writes/reads/day easily.
* Use in-memory caching for session lookups (if session DB used) to limit DB hits.
* Keep token expiry short, and schedule cleanup of old/expired tokens.
* Scale storage based on usage; ensure indexes on email and providerId for quick lookup.

## 14. Future Enhancements

* Add Multi-Factor Authentication (MFA) via TOTP or push.
* Add “remember me” long-lived login token.
* Add Passkey / WebAuthn support (password-less).
* Add account linking/unlinking of multiple social providers for single user.
* Add login “activity log” in user profile (recent logins with device/IP).
* Add role-based or attribute-based access (if system grows).

## 15. Assumptions

* You will deploy a REST API backend with user-facing frontend (e.g., static site + JS).
* Primary implementation uses AWS services (DynamoDB, Lambda, API Gateway, SES).
* You will operate over HTTPS and control the domain for email/redirects.
* You require moderate security suitable for typical web application use.
* Traffic volume: a few hundred transactions per day (suitable for AWS free tier/low-cost tier).
* Development will proceed incrementally: email/password auth first, then social login, then additional backends.

## 16. Implementation Phases

### Phase 1: Common Components & AWS Email/Password Auth (Primary Path)
**Goal**: Implement core authentication with standard email/password login on AWS.

**Deliverables**:
- REST API specification and common request/response models
- AWS infrastructure (DynamoDB tables, Lambda functions, API Gateway)
- Email/password signup with email confirmation
- Login with session/JWT management
- Forgot password and reset password flows
- Email service integration (AWS SES)
- Rate limiting and security controls
- Logging and monitoring
- Unit and integration tests

**Duration**: 4-6 weeks

### Phase 2: Social Login Integration (OAuth Providers)
**Goal**: Add Google, Facebook, LinkedIn authentication.

**Deliverables**:
- OAuth provider configuration and credentials
- Social login Lambda functions
- Provider callback handling
- Account linking logic
- Updated frontend with social login buttons
- Tests for social login flows

**Duration**: 2-3 weeks

### Phase 3: Additional Backend Implementations
**Goal**: Implement repository interfaces for other backends.

**Deliverables**:
- Azure implementation (Cosmos DB + Azure Functions)
- Google Cloud implementation (Firestore + Cloud Functions)
- Supabase implementation (PostgreSQL + Supabase SDK)
- Back4App implementation (Parse Server SDK)
- Backend switching configuration
- Cross-backend compatibility tests

**Duration**: 4-6 weeks (can be parallelized)

### Phase 4: Advanced Features
**Goal**: Add optional enhancements.

**Deliverables**:
- Multi-factor authentication (TOTP)
- Remember me functionality
- Account activity log
- Admin dashboard for user management
- Enhanced monitoring and analytics

**Duration**: 3-4 weeks

## 17. Technology Stack (AWS Implementation)

### Backend
- **Runtime**: Node.js 18.x or Python 3.11 (for Lambda functions)
- **API Framework**: AWS API Gateway (REST API)
- **Compute**: AWS Lambda (serverless functions)
- **Database**: AWS DynamoDB (NoSQL)
- **Email**: AWS SES (Simple Email Service)
- **Secrets**: AWS Secrets Manager
- **Logging**: AWS CloudWatch Logs
- **Monitoring**: AWS CloudWatch Metrics + Alarms

### Libraries & Dependencies
- **Password Hashing**: bcrypt or argon2
- **JWT**: jsonwebtoken (Node.js) or PyJWT (Python)
- **Validation**: joi or zod (Node.js) or pydantic (Python)
- **AWS SDK**: aws-sdk v3 (Node.js) or boto3 (Python)
- **Email Templates**: handlebars or similar templating engine
- **Testing**: jest (Node.js) or pytest (Python)

### Infrastructure as Code
- **AWS CloudFormation** or **Terraform** for infrastructure deployment
- **AWS SAM (Serverless Application Model)** for Lambda deployment

### Frontend (Static Site)
- **Framework**: Vanilla JS or React
- **Hosting**: GitHub Pages or AWS S3 + CloudFront
- **HTTP Client**: fetch API or axios
- **State Management**: localStorage for JWT storage (or HTTP-only cookies)

### Development Tools
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **API Testing**: Postman or Thunder Client
- **Local Development**: AWS SAM CLI or LocalStack for local testing

## 18. Security Checklist (AWS-Specific)

- [ ] All Lambda functions use IAM roles with least-privilege permissions
- [ ] API Gateway has request validation enabled
- [ ] API Gateway has rate limiting configured (throttling and burst limits)
- [ ] DynamoDB tables have point-in-time recovery enabled
- [ ] DynamoDB tables use encryption at rest (AWS managed keys)
- [ ] Secrets Manager used for all sensitive configuration
- [ ] CloudWatch Logs retention configured (7-30 days)
- [ ] SES configured with DKIM and SPF records
- [ ] SES sandbox mode exited for production (domain verified)
- [ ] CORS configured properly on API Gateway
- [ ] HTTPS enforced for all API endpoints
- [ ] JWT secret stored in Secrets Manager (not environment variables)
- [ ] Password hashing uses bcrypt with cost factor ≥ 10
- [ ] Email confirmation tokens expire in 1 hour
- [ ] Password reset tokens expire in 1 hour
- [ ] Session/JWT tokens expire in 1 hour (with refresh token option)
- [ ] Failed login attempts logged to CloudWatch
- [ ] Rate limiting applied to login, signup, forgot-password endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection not applicable (DynamoDB), but NoSQL injection prevented
- [ ] XSS prevention in email templates
- [ ] CSRF protection if using cookies (SameSite attribute)

## 19. Deployment Architecture (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Amazon Route 53    │
              │   (DNS)              │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   API Gateway        │
              │   (REST API)         │
              │   - CORS             │
              │   - Rate Limiting    │
              │   - Request Validation│
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐     ┌────────┐     ┌────────┐
    │Lambda  │     │Lambda  │     │Lambda  │
    │Signup  │     │Login   │     │Confirm │
    └───┬────┘     └───┬────┘     └───┬────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │DynamoDB │  │ Secrets  │  │   SES    │
    │Tables   │  │ Manager  │  │ (Email)  │
    └─────────┘  └──────────┘  └──────────┘
         │
         ▼
    ┌─────────────────┐
    │  CloudWatch     │
    │  Logs & Metrics │
    └─────────────────┘
```

## 20. API Gateway Configuration

### Endpoints
- `POST /api/auth/signup`
- `GET /api/auth/confirm`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/providers`
- `GET /api/auth/oauth/callback/{provider}`

### Throttling Settings
- **Rate**: 100 requests per second
- **Burst**: 200 requests
- **Per-endpoint overrides**: Login and signup limited to 10 requests/second

### CORS Configuration
```json
{
  "allowOrigins": ["https://johnboen.com", "http://localhost:8000"],
  "allowMethods": ["GET", "POST", "OPTIONS"],
  "allowHeaders": ["Content-Type", "Authorization"],
  "exposeHeaders": ["Content-Length"],
  "maxAge": 3600,
  "allowCredentials": true
}
```

### Request Validation
- Enable request body validation using JSON Schema models
- Validate query parameters and path parameters
- Return 400 Bad Request for invalid inputs before invoking Lambda


