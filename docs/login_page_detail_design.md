Here is the full detailed design document as plain Markdown text, no embedded code blocks:

# Login & Authentication: Detailed Design Document

*Version: 1.0*
*Date: YYYY-MM-DD*
*Author: [Your Name]*

## 1. Purpose & Scope

This document defines the authentication and login / signup functionality for the application. It covers:

* User signup via email + password, with email confirmation required to activate the account.
* Login via email + password.
* Forgot/Reset password flow.
* Login / Signup via common social identity providers (Google, Facebook, LinkedIn).
* Security- and usability-related requirements.
* REST API endpoints, data-model, and integration points.

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

Since you intend to support multiple data sources (various DBs/BaaS), design your auth module with abstraction layers:

* Storage layer interface: e.g., `UserRepository`, `TokenRepository`, with implementations for each backend (Postgres, Firestore, DynamoDB).
* Token service interface: allow different session/token handling (JWT vs. session DB).
* OAuth provider config: configurable list of providers in config file, making it easy to add or remove providers.
* Feature flags/config: email confirmation required? password complexity policy? token expiry times?

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
* You will choose a data-store (or support multiple) for users/tokens as per earlier plan.
* You will operate over HTTPS and control the domain for email/redirects.
* You require moderate security suitable for typical web application use.


