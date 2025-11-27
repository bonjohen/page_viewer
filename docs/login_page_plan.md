# Implementation Plan for Authentication & Login System
**Version**: 2.1
**Date**: 2025-11-25
**Prepared by**: John Boen

---

## 🚀 QUICK START: What to Do First

This section identifies the **immediate next steps** for the USER to begin Phase 1 implementation.

### Step 1: AWS Account Setup (USER ACTION REQUIRED)

**If you don't have an AWS account:**
1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Follow the signup process (requires credit card, but we'll stay within free tier)
4. Enable billing alerts to avoid unexpected charges

**If you already have an AWS account:**
1. Log in to AWS Console: https://console.aws.amazon.com/
2. Verify you have access to these services:
   - DynamoDB
   - Lambda
   - API Gateway
   - SES (Simple Email Service)
   - Secrets Manager
   - CloudWatch
3. Set up billing alerts (recommended):
   - Go to AWS Billing Dashboard
   - Create a billing alarm for $10/month threshold

### Step 2: AWS CLI Setup (USER ACTION REQUIRED)

1. **Install AWS CLI** (if not already installed):
   - Windows: Download from https://aws.amazon.com/cli/
   - Mac: `brew install awscli`
   - Linux: `sudo apt-get install awscli` or `sudo yum install awscli`

2. **Create IAM User for Deployment**:
   - Go to AWS Console → IAM → Users → Add User
   - User name: `auth-system-deployer`
   - Access type: ✅ Programmatic access
   - Permissions: Attach policies:
     - `AWSLambda_FullAccess`
     - `AmazonDynamoDBFullAccess`
     - `AmazonAPIGatewayAdministrator`
     - `AmazonSESFullAccess`
     - `SecretsManagerReadWrite`
     - `CloudWatchFullAccess`
     - `IAMFullAccess` (for creating Lambda execution roles)
   - Download the **Access Key ID** and **Secret Access Key** (save securely!)

3. **Configure AWS CLI**:
   ```bash
   aws configure
   ```
   - Enter Access Key ID
   - Enter Secret Access Key
   - Default region: `us-east-1` (or your preferred region)
   - Default output format: `json`

4. **Verify AWS CLI is working**:
   ```bash
   aws sts get-caller-identity
   ```
   - Should show your account ID and user ARN

### Step 3: Verify Email Address in SES (USER ACTION REQUIRED)

1. Go to AWS Console → SES (Simple Email Service)
2. Click "Email Addresses" → "Verify a New Email Address"
3. Enter your email address (e.g., `noreply@yourdomain.com` or your personal email)
4. Check your inbox and click the verification link
5. Wait for status to show "verified"

**Note**: In sandbox mode, you can only send emails to verified addresses. For production, you'll need to request production access.

### Step 4: Tell AI You're Ready (USER ACTION)

Once you've completed Steps 1-3, tell the AI:

> "I've completed AWS setup. My AWS CLI is configured, and I've verified my email address in SES. Please proceed with generating the project structure and infrastructure code."

The AI will then:
- ✅ Generate folder structure
- ✅ Create CloudFormation/Terraform templates
- ✅ Generate Lambda function code
- ✅ Create API Gateway configuration
- ✅ Generate deployment scripts
- ✅ Provide step-by-step deployment instructions

---

## 1. Project Overview
### 1.1 Objective
Implement a modular authentication and login system with:
- **Phase 1 (Primary)**: Standard email/password authentication with AWS backend (DynamoDB, Lambda, API Gateway, SES)
- **Phase 2**: Social login integration (Google, Facebook, LinkedIn)
- **Phase 3**: Additional backend implementations (Azure, Google Cloud, Supabase, Back4App)

This phased approach allows for incremental delivery, with common components built first and reused across all implementations.

### 1.2 Scope
**Common Components (All Phases):**
- REST API specification and interface contracts
- Authentication business logic (password hashing, token generation, validation)
- Email service abstraction layer
- Request/response models and validation
- Error handling and logging framework
- Security controls (rate limiting, input validation)

**Phase 1 - AWS Email/Password Implementation:**
- AWS infrastructure setup (DynamoDB, Lambda, API Gateway, SES)
- Email/password signup with email confirmation
- Login with JWT/session management
- Forgot password and reset password flows
- Logging and monitoring with CloudWatch
- Unit and integration tests

**Phase 2 - Social Login (Future):**
- OAuth2/OIDC integration for Google, Facebook, LinkedIn
- Social provider callback handling
- Account linking logic

**Phase 3 - Additional Backends (Future):**
- Repository abstraction layer
- Backend implementations for Azure, Google Cloud, Supabase, Back4App
- Backend switching configuration

### 1.3 Constraints & Assumptions
- Traffic expected: a few hundred transactions per day (suitable for AWS free tier).
- AWS services used: DynamoDB (on-demand), Lambda (128-256 MB), API Gateway, SES.
- Static frontend hosted on GitHub Pages will call the REST API.
- Development environment: Node.js 18.x or Python 3.11 for Lambda functions.
- Infrastructure as Code: AWS CloudFormation or Terraform.
- CI/CD: GitHub Actions for automated testing and deployment.

### 1.4 Success Criteria
**Phase 1 (Primary Implementation):**
- ✅ Users can signup via email/password
- ✅ Email confirmation flow works end-to-end
- ✅ Users can login with confirmed credentials
- ✅ Forgot password and reset password flows work
- ✅ JWT/session management works; logout invalidates sessions
- ✅ Rate limiting prevents brute force attacks
- ✅ All endpoints have proper error handling
- ✅ Security best practices implemented (password hashing, HTTPS, etc.)
- ✅ Logging and monitoring operational
- ✅ Unit tests achieve >80% coverage
- ✅ Integration tests validate all user journeys
- ✅ System operates within AWS free tier limits

**Phase 2 Success Criteria:**
- Users can login via Google, Facebook, LinkedIn
- Social accounts can be linked to existing email accounts

**Phase 3 Success Criteria:**
- Backend can be switched via configuration
- All backends pass the same test suite

## 2. Task Ownership: USER vs AI

This section clarifies which tasks require **USER action** (manual setup, account creation, approvals) versus **AI action** (code generation, documentation, testing).

### 2.1 USER Tasks (Require Manual Action)

**M1: Environment & AWS Infrastructure Setup**
- [ ] **USER**: Create AWS account (if not already exists)
- [ ] **USER**: Set up billing and enable AWS services (DynamoDB, Lambda, API Gateway, SES, Secrets Manager, CloudWatch)
- [ ] **USER**: Create IAM user for deployment with programmatic access
- [ ] **USER**: Configure AWS CLI with credentials (`aws configure`)
- [ ] **USER**: Verify sender email address in AWS SES (for development)
- [ ] **USER**: Review and approve folder structure proposed by AI
- [ ] **USER**: Review and approve infrastructure templates before deployment
- [ ] **USER**: Execute deployment commands to AWS (after AI generates them)
- [ ] **USER**: Set up GitHub repository secrets for CI/CD (AWS credentials)

**M4: Email/Password Signup & Confirmation Flow**
- [ ] **USER**: Verify sender email in AWS SES console
- [ ] **USER**: Test email delivery by checking inbox
- [ ] **USER**: Request SES sandbox exit (if needed for production)

**M7: Security Hardening, Logging & Monitoring**
- [ ] **USER**: Review security audit findings
- [ ] **USER**: Approve security configurations
- [ ] **USER**: Set up CloudWatch alarm notifications (email/SMS)

**M9: Frontend Integration & E2E Testing**
- [ ] **USER**: Review frontend UI/UX designs
- [ ] **USER**: Test frontend flows manually in browser
- [ ] **USER**: Provide feedback on user experience

**M10: Documentation & Production Deployment**
- [ ] **USER**: Review all documentation for accuracy
- [ ] **USER**: Approve production deployment
- [ ] **USER**: Execute production deployment commands
- [ ] **USER**: Verify domain configuration (if using custom domain)
- [ ] **USER**: Request SES production access (exit sandbox mode)
- [ ] **USER**: Conduct final production readiness review

**Phase 2 (Future)**
- [ ] **USER**: Create OAuth apps at Google, Facebook, LinkedIn developer consoles
- [ ] **USER**: Configure OAuth redirect URIs
- [ ] **USER**: Store OAuth credentials in AWS Secrets Manager

**Phase 3 (Future)**
- [ ] **USER**: Create accounts for Azure, Google Cloud, Supabase, Back4App
- [ ] **USER**: Set up billing for additional cloud providers

### 2.2 AI Tasks (Automated Code Generation)

**M1: Environment & AWS Infrastructure Setup**
- [ ] **AI**: Generate folder structure for project
- [ ] **AI**: Create CloudFormation/Terraform templates for infrastructure
- [ ] **AI**: Generate GitHub Actions workflow files
- [ ] **AI**: Create environment configuration templates (.env.example)
- [ ] **AI**: Generate AWS setup documentation

**M2: Common Components Development**
- [ ] **AI**: Define REST API specification (OpenAPI/Swagger)
- [ ] **AI**: Generate request/response models and JSON schemas
- [ ] **AI**: Implement validation utilities (email, password strength, sanitization)
- [ ] **AI**: Implement password hashing utilities (bcrypt)
- [ ] **AI**: Implement JWT utilities (generation, validation, refresh)
- [ ] **AI**: Implement secure token generation
- [ ] **AI**: Create error handling framework
- [ ] **AI**: Create logging utilities
- [ ] **AI**: Write unit tests for all utilities

**M3: AWS DynamoDB Schema & Lambda Scaffolding**
- [ ] **AI**: Design DynamoDB table schemas
- [ ] **AI**: Generate CloudFormation/Terraform templates for tables
- [ ] **AI**: Create Lambda function scaffolding for all endpoints
- [ ] **AI**: Create shared Lambda layer with utilities
- [ ] **AI**: Generate API Gateway configuration
- [ ] **AI**: Configure CORS and request validation

**M4-M6: Authentication Flows**
- [ ] **AI**: Implement all Lambda functions (signup, confirm, login, logout, forgot-password, reset-password)
- [ ] **AI**: Create email templates (HTML)
- [ ] **AI**: Implement email sending utilities
- [ ] **AI**: Implement rate limiting logic
- [ ] **AI**: Write unit and integration tests

**M7: Security Hardening, Logging & Monitoring**
- [ ] **AI**: Implement comprehensive logging
- [ ] **AI**: Configure CloudWatch Metrics and Alarms
- [ ] **AI**: Implement rate limiting for all endpoints
- [ ] **AI**: Generate security audit checklist
- [ ] **AI**: Document security controls

**M8: Testing**
- [ ] **AI**: Write comprehensive unit tests (>80% coverage)
- [ ] **AI**: Write integration tests
- [ ] **AI**: Write security tests
- [ ] **AI**: Generate test documentation

**M9: Frontend Integration & E2E Testing**
- [ ] **AI**: Create frontend pages (signup, login, confirm, forgot-password, reset-password)
- [ ] **AI**: Implement API integration
- [ ] **AI**: Implement authenticated state management
- [ ] **AI**: Write E2E tests (Playwright/Cypress)

**M10: Documentation & Production Deployment**
- [ ] **AI**: Write API documentation
- [ ] **AI**: Write deployment documentation
- [ ] **AI**: Write operational documentation
- [ ] **AI**: Write user documentation
- [ ] **AI**: Create README.md with architecture diagrams
- [ ] **AI**: Generate deployment scripts
- [ ] **AI**: Create runbook for common operations

### 2.3 Collaborative Tasks (USER + AI)

- [ ] **BOTH**: Review and refine API design
- [ ] **BOTH**: Review security configurations
- [ ] **BOTH**: Test authentication flows end-to-end
- [ ] **BOTH**: Troubleshoot deployment issues
- [ ] **BOTH**: Review and approve production deployment

## 3. Roles & Responsibilities
| Role         | Name         | Responsibilities                                         |
|--------------|--------------|----------------------------------------------------------|
| Product Owner| John Boen    | Prioritize features, approve design, review acceptance. |
| Tech Lead    | John Boen    | Define architecture, ensure quality, supervise development. |
| Backend Dev  | AI Agent     | Implement API endpoints, business logic, data layer.    |
| Frontend Dev | AI Agent     | Integrate login/signup flows in UI, call APIs.         |
| QA/Test Eng. | AI Agent     | Write and execute test cases, validate flows.           |
| DevOps/Infra | John Boen + AI | Setup backend infra, CI/CD, email service, social provider setup. |

## 4. Milestones & Timeline

### Phase 1: AWS Email/Password Implementation (Primary Path)
| Milestone # | Description                                                  | Duration | Target    |
|-------------|--------------------------------------------------------------|----------|-----------|
| M1          | Environment & AWS infrastructure setup                        | 1 week   | Week 1    |
| M2          | Common components: API models, validation, utilities          | 1 week   | Week 2    |
| M3          | AWS DynamoDB schema and Lambda scaffolding                    | 1 week   | Week 3    |
| M4          | Email/password signup & confirmation flow                     | 1 week   | Week 4    |
| M5          | Login, JWT/session management, logout                         | 1 week   | Week 5    |
| M6          | Forgot password/reset flow                                    | 1 week   | Week 6    |
| M7          | Security hardening: rate limiting, logging, monitoring        | 1 week   | Week 7    |
| M8          | Testing: unit tests, integration tests, security tests        | 1 week   | Week 8    |
| M9          | Frontend integration and end-to-end testing                   | 1 week   | Week 9    |
| M10         | Documentation, deployment to production, monitoring setup     | 1 week   | Week 10   |

**Phase 1 Total Duration**: 10 weeks

### Phase 2: Social Login Integration (Future)
| Milestone # | Description                                                  | Duration | Target    |
|-------------|--------------------------------------------------------------|----------|-----------|
| M11         | OAuth provider setup (Google, Facebook, LinkedIn)             | 1 week   | Week 11   |
| M12         | Social login Lambda functions and callback handling           | 1 week   | Week 12   |
| M13         | Account linking and testing                                   | 1 week   | Week 13   |

**Phase 2 Total Duration**: 3 weeks

### Phase 3: Additional Backend Implementations (Future)
| Milestone # | Description                                                  | Duration | Target    |
|-------------|--------------------------------------------------------------|----------|-----------|
| M14         | Repository abstraction layer design                           | 1 week   | Week 14   |
| M15         | Azure implementation (Cosmos DB + Azure Functions)            | 2 weeks  | Week 15-16|
| M16         | Google Cloud implementation (Firestore + Cloud Functions)     | 2 weeks  | Week 17-18|
| M17         | Supabase implementation (PostgreSQL + Supabase SDK)           | 1 week   | Week 19   |
| M18         | Back4App implementation (Parse Server SDK)                    | 1 week   | Week 20   |
| M19         | Cross-backend testing and validation                          | 1 week   | Week 21   |

**Phase 3 Total Duration**: 8 weeks

## 5. Detailed Task Breakdown

### PHASE 1: AWS Email/Password Implementation

#### 5.1 Environment & AWS Infrastructure Setup (M1 - Week 1)
**Tasks:**
- [ ] Create GitHub repository with folder structure:
  - `/infrastructure` - CloudFormation/Terraform templates
  - `/lambda` - Lambda function code
  - `/shared` - Shared utilities and layers
  - `/frontend` - Static frontend code
  - `/tests` - Test suites
  - `/docs` - Documentation
- [ ] Setup AWS account and configure AWS CLI
- [ ] Create IAM user/role for deployment with appropriate permissions
- [ ] Setup AWS Secrets Manager for storing sensitive configuration
- [ ] Configure GitHub Actions workflow for CI/CD
- [ ] Setup local development environment:
  - Install AWS SAM CLI or LocalStack
  - Install Node.js 18.x or Python 3.11
  - Install testing frameworks
- [ ] Create environment configuration files (.env templates)
- [ ] Document AWS account setup and prerequisites

**Deliverables:**
- Repository with folder structure
- AWS account configured
- CI/CD pipeline skeleton
- Local development environment ready

#### 5.2 Common Components Development (M2 - Week 2)
**Tasks:**
- [ ] Define REST API specification (OpenAPI/Swagger)
- [ ] Create request/response models and JSON schemas
- [ ] Implement validation utilities:
  - Email format validation
  - Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
  - Input sanitization
- [ ] Implement password hashing utilities (bcrypt with cost factor 10)
- [ ] Implement JWT utilities:
  - Token generation
  - Token validation
  - Token refresh logic
- [ ] Implement secure token generation for email confirmation and password reset
- [ ] Create error handling framework with standard error codes
- [ ] Create logging utilities
- [ ] Write unit tests for all utilities

**Deliverables:**
- API specification document
- Reusable utility modules
- Unit tests for common components

#### 5.3 AWS DynamoDB Schema & Lambda Scaffolding (M3 - Week 3)
**Tasks:**
- [ ] Design DynamoDB table schemas:
  - Users table with email GSI
  - EmailConfirmationTokens table with TTL
  - PasswordResetTokens table with TTL
  - Sessions table with TTL (if using server-side sessions)
  - AuthenticationEvents table with userId-timestamp GSI
- [ ] Create CloudFormation/Terraform templates for DynamoDB tables
- [ ] Create Lambda function scaffolding for all endpoints:
  - auth-signup
  - auth-confirm
  - auth-login
  - auth-logout
  - auth-forgot-password
  - auth-reset-password
  - auth-providers (placeholder for Phase 2)
- [ ] Create shared Lambda layer with common utilities
- [ ] Setup API Gateway with endpoint definitions
- [ ] Configure API Gateway CORS settings
- [ ] Configure API Gateway request validation
- [ ] Deploy infrastructure to AWS development environment
- [ ] Test DynamoDB table creation and basic CRUD operations

**Deliverables:**
- Infrastructure as Code templates
- Lambda function scaffolding
- API Gateway configuration
- Development environment deployed

#### 5.4 Email/Password Signup & Confirmation Flow (M4 - Week 4)
**Tasks:**
- [ ] Implement `POST /api/auth/signup` Lambda function:
  - Validate input (email, password, displayName)
  - Check if email already exists (query email GSI)
  - Hash password using bcrypt
  - Create user record with status='pending', emailConfirmed=false
  - Generate secure confirmation token
  - Store token in EmailConfirmationTokens table with 1-hour expiry
  - Send confirmation email via SES
  - Return 202 Accepted response
  - Handle errors (409 Conflict if email exists, 400 Bad Request for invalid input)
- [ ] Setup AWS SES:
  - Verify sender email address
  - Create email templates for confirmation
  - Configure SES in sandbox mode for development
- [ ] Implement email sending utility:
  - Template rendering
  - SES integration
  - Error handling for email failures
- [ ] Implement `GET /api/auth/confirm` Lambda function:
  - Validate token parameter
  - Look up token in EmailConfirmationTokens table
  - Check token not expired and not used
  - Mark token as used
  - Update user record: emailConfirmed=true, status='active'
  - Return 200 OK response
  - Handle errors (400 Bad Request, 410 Gone for expired/used tokens)
- [ ] Write unit tests for signup and confirm functions
- [ ] Write integration tests for signup→confirm flow
- [ ] Test email delivery end-to-end

**Deliverables:**
- Signup endpoint functional
- Email confirmation endpoint functional
- Email templates created
- Tests passing

#### 5.5 Login, JWT/Session Management, Logout (M5 - Week 5)
**Tasks:**
- [ ] Implement `POST /api/auth/login` Lambda function:
  - Validate input (email, password)
  - Look up user by email (query email GSI)
  - Verify password hash matches
  - Check emailConfirmed=true
  - Generate JWT token with claims (userId, email, exp)
  - Store JWT secret in Secrets Manager
  - Log authentication event (success)
  - Return 200 OK with token and user info
  - Handle errors (401 Unauthorized for invalid credentials or unconfirmed email)
  - Log failed login attempts
- [ ] Implement rate limiting for login endpoint:
  - Track failed attempts per email/IP in DynamoDB or in-memory cache
  - Return 429 Too Many Requests after 5 failed attempts in 15 minutes
- [ ] Implement authentication middleware:
  - Extract JWT from Authorization header
  - Validate JWT signature and expiration
  - Attach user info to request context
  - Return 401 Unauthorized for invalid/expired tokens
- [ ] Implement `POST /api/auth/logout` Lambda function:
  - Validate JWT from Authorization header
  - Add token to blacklist (optional, or rely on short expiration)
  - Log logout event
  - Return 200 OK
- [ ] Decide on session strategy: JWT with short expiration (1 hour) + refresh token
- [ ] Implement refresh token logic (optional for Phase 1)
- [ ] Write unit tests for login, logout, and auth middleware
- [ ] Write integration tests for login→logout flow
- [ ] Test rate limiting behavior

**Deliverables:**
- Login endpoint functional
- Logout endpoint functional
- Authentication middleware working
- Rate limiting implemented
- Tests passing

#### 5.6 Forgot Password / Reset Flow (M6 - Week 6)
**Tasks:**
- [ ] Implement `POST /api/auth/forgot-password` Lambda function:
  - Validate email input
  - Look up user by email (silently fail if not found for security)
  - Generate secure password reset token
  - Store token in PasswordResetTokens table with 1-hour expiry
  - Send password reset email via SES
  - Always return 200 OK (don't reveal if email exists)
  - Log forgot password request
- [ ] Create password reset email template
- [ ] Implement `POST /api/auth/reset-password` Lambda function:
  - Validate input (token, newPassword)
  - Look up token in PasswordResetTokens table
  - Check token not expired and not used
  - Validate new password strength
  - Hash new password
  - Update user passwordHash
  - Mark token as used
  - Invalidate all existing sessions for user (optional)
  - Send "password changed" notification email
  - Return 200 OK
  - Handle errors (400 Bad Request, 410 Gone for expired/used tokens)
- [ ] Implement rate limiting for forgot-password endpoint
- [ ] Write unit tests for forgot-password and reset-password functions
- [ ] Write integration tests for forgot→reset flow
- [ ] Test email delivery for reset emails

**Deliverables:**
- Forgot password endpoint functional
- Reset password endpoint functional
- Password reset email templates created
- Tests passing

#### 5.7 Security Hardening, Logging & Monitoring (M7 - Week 7)
**Tasks:**
- [ ] Implement comprehensive logging:
  - All authentication events logged to AuthenticationEvents table
  - CloudWatch Logs for all Lambda functions
  - Structured logging with correlation IDs
- [ ] Configure CloudWatch Metrics:
  - Login success/failure rates
  - Signup rates
  - Password reset requests
  - API latency
  - Error rates
- [ ] Setup CloudWatch Alarms:
  - High error rate alert
  - High failed login rate alert
  - Lambda function errors
- [ ] Implement rate limiting for all endpoints:
  - Signup: 5 requests per hour per IP
  - Login: 5 failed attempts per 15 minutes per email
  - Forgot password: 3 requests per hour per email
- [ ] Security audit:
  - Review IAM permissions (least privilege)
  - Review DynamoDB encryption settings
  - Review API Gateway security settings
  - Review CORS configuration
  - Review input validation on all endpoints
- [ ] Implement HTTPS enforcement
- [ ] Configure API Gateway throttling and burst limits
- [ ] Setup DynamoDB point-in-time recovery
- [ ] Document security controls and configurations

**Deliverables:**
- Comprehensive logging operational
- CloudWatch dashboards created
- Alarms configured
- Rate limiting on all endpoints
- Security audit completed

#### 5.8 Testing (M8 - Week 8)
**Tasks:**
- [ ] Write comprehensive unit tests:
  - All Lambda functions
  - All utility modules
  - Password hashing and validation
  - JWT generation and validation
  - Token generation
  - Email sending
  - Target: >80% code coverage
- [ ] Write integration tests:
  - Signup → Confirm → Login flow
  - Signup → Login (unconfirmed) → Error
  - Login → Logout flow
  - Forgot → Reset → Login flow
  - Rate limiting tests
  - Error handling tests
- [ ] Write security tests:
  - SQL/NoSQL injection attempts
  - XSS attempts in email templates
  - Brute force login attempts
  - Token expiration validation
  - Invalid JWT handling
- [ ] Performance testing:
  - Load test with 100 concurrent users
  - Measure API latency
  - Verify DynamoDB performance
- [ ] Setup test data and teardown scripts
- [ ] Document test procedures and results

**Deliverables:**
- Comprehensive test suite
- Test coverage report (>80%)
- Performance test results
- Security test results

#### 5.9 Frontend Integration & E2E Testing (M9 - Week 9)
**Tasks:**
- [ ] Create frontend signup page:
  - Email/password form
  - Password strength indicator
  - Form validation
  - API integration
  - Success/error messaging
- [ ] Create frontend login page:
  - Email/password form
  - "Forgot password" link
  - API integration
  - JWT storage (localStorage or HTTP-only cookie)
  - Success/error messaging
- [ ] Create email confirmation page:
  - Parse token from URL
  - Call confirm API
  - Display success/error message
- [ ] Create forgot password page:
  - Email input form
  - API integration
- [ ] Create reset password page:
  - Parse token from URL
  - New password form
  - Password strength indicator
  - API integration
- [ ] Implement authenticated state management:
  - Store JWT
  - Include JWT in API requests
  - Handle token expiration
  - Logout functionality
- [ ] Write end-to-end tests using Playwright or Cypress:
  - Complete signup flow
  - Complete login flow
  - Complete password reset flow
  - Logout flow
- [ ] Test on multiple browsers
- [ ] Test responsive design

**Deliverables:**
- Frontend pages implemented
- Frontend integrated with backend API
- E2E tests passing
- Cross-browser testing completed

#### 5.10 Documentation & Production Deployment (M10 - Week 10)
**Tasks:**
- [ ] Write API documentation:
  - Endpoint descriptions
  - Request/response examples
  - Error codes and meanings
  - Authentication requirements
- [ ] Write deployment documentation:
  - AWS account setup
  - Infrastructure deployment steps
  - Environment variable configuration
  - SES setup and verification
  - Domain configuration
- [ ] Write operational documentation:
  - Monitoring and alerting
  - Log analysis
  - Troubleshooting guide
  - Backup and recovery procedures
  - Token cleanup procedures
- [ ] Write user documentation:
  - How to signup
  - How to login
  - How to reset password
- [ ] Create README.md with:
  - Project overview
  - Architecture diagram
  - Setup instructions
  - Testing instructions
  - Deployment instructions
- [ ] Deploy to production:
  - Create production AWS environment
  - Deploy infrastructure
  - Configure production domain
  - Exit SES sandbox mode (verify domain)
  - Configure production secrets
  - Deploy Lambda functions
  - Run smoke tests
- [ ] Setup production monitoring:
  - CloudWatch dashboards
  - Alarms
  - Log retention policies
- [ ] Conduct production readiness review
- [ ] Create runbook for common operations

**Deliverables:**
- Complete documentation
- Production environment deployed
- Monitoring operational
- System ready for production traffic

---

### PHASE 2: Social Login Integration (Future)

#### 5.11 OAuth Provider Setup (M11)
**Tasks:**
- [ ] Register OAuth apps with Google, Facebook, LinkedIn
- [ ] Obtain client IDs and secrets
- [ ] Configure redirect URIs
- [ ] Store credentials in Secrets Manager
- [ ] Document OAuth setup process

#### 5.12 Social Login Implementation (M12)
**Tasks:**
- [ ] Implement OAuth callback Lambda functions
- [ ] Implement account linking logic
- [ ] Update frontend with social login buttons
- [ ] Test social login flows

#### 5.13 Social Login Testing (M13)
**Tasks:**
- [ ] Write tests for social login flows
- [ ] Test account linking scenarios
- [ ] Deploy to production

---

### PHASE 3: Additional Backend Implementations (Future)

#### 5.14 Repository Abstraction Layer (M14)
**Tasks:**
- [ ] Define repository interfaces
- [ ] Extract AWS-specific code into repository implementation
- [ ] Create backend selector configuration

#### 5.15-5.18 Backend Implementations (M15-M18)
**Tasks for each backend:**
- [ ] Setup backend infrastructure
- [ ] Implement repository interfaces
- [ ] Write backend-specific tests
- [ ] Document backend configuration

#### 5.19 Cross-Backend Testing (M19)
**Tasks:**
- [ ] Run same test suite against all backends
- [ ] Verify identical behavior
- [ ] Document backend switching procedure

## 6. Dependencies

### Phase 1 Dependencies
- **AWS Account**: Active AWS account with billing enabled
- **AWS Services Access**: DynamoDB, Lambda, API Gateway, SES, Secrets Manager, CloudWatch
- **AWS SES**: Sender email verified (sandbox mode for dev, domain verified for production)
- **Domain**: Custom domain for production (optional for Phase 1)
- **SSL Certificate**: AWS Certificate Manager or Let's Encrypt
- **Development Tools**:
  - Node.js 18.x or Python 3.11
  - AWS CLI configured
  - AWS SAM CLI or LocalStack for local testing
  - Git and GitHub account
- **CI/CD**: GitHub Actions enabled
- **Email Templates**: HTML email templates for confirmation and password reset

### Phase 2 Dependencies (Future)
- OAuth2 apps configured at Google, Facebook, LinkedIn
- OAuth client IDs and secrets

### Phase 3 Dependencies (Future)
- Azure account and Cosmos DB access
- Google Cloud account and Firestore access
- Supabase account
- Back4App account

## 7. Risks & Mitigation

### Phase 1 Risks
| Risk                                              | Likelihood | Impact | Mitigation                              |
|---------------------------------------------------|------------|--------|-----------------------------------------|
| AWS free tier limits exceeded                     | Low        | Medium | Monitor usage, set billing alarms, optimize Lambda memory. |
| SES email deliverability issues                   | Medium     | High   | Verify domain, configure SPF/DKIM, monitor bounce rates. |
| Security vulnerabilities in auth flows            | Medium     | High   | Follow OWASP guidelines, peer review, security testing, penetration testing. |
| DynamoDB performance issues                       | Low        | Medium | Use on-demand pricing, optimize queries, add indexes as needed. |
| Lambda cold start latency                         | Medium     | Low    | Use provisioned concurrency for critical functions (if needed). |
| JWT secret compromise                             | Low        | High   | Store in Secrets Manager, rotate regularly, use strong random generation. |
| Rate limiting bypass                              | Medium     | Medium | Implement multiple layers (API Gateway + application level). |
| Token cleanup not running                         | Low        | Low    | Use DynamoDB TTL for automatic cleanup, monitor table size. |

### Phase 2 Risks (Future)
| Risk                                              | Likelihood | Impact | Mitigation                              |
|---------------------------------------------------|------------|--------|-----------------------------------------|
| Delay in obtaining OAuth provider credentials     | Medium     | Medium | Apply early, track progress, have backup timeline. |
| OAuth provider API changes                        | Low        | Medium | Monitor provider changelogs, version API integrations. |

### Phase 3 Risks (Future)
| Risk                                              | Likelihood | Impact | Mitigation                              |
|---------------------------------------------------|------------|--------|-----------------------------------------|
| Complexity of supporting 5 backends increases dev time | High       | Medium | Implement one backend fully first, then replicate pattern. |
| Backend-specific limitations                      | Medium     | Medium | Research each backend's capabilities early, design for lowest common denominator. |

## 8. Metrics & Success Monitoring
- Number of successful signups/confirmations.
- Login success vs failures.
- Number of password resets.
- Authentication event logs (failed attempts).
- Backend switch test success rate.
- System error rate (API errors).
- Response times for auth endpoints (<200 ms target).

## 9. Communication Plan
- Weekly stand-up meeting (Mon 09:00).
- Milestone review at end of every sprint/phase.
- Slack channel for real-time issues.
- Stakeholder update email after each major milestone.

## 10. Budget & Resource Estimate
- Primary resources: 2 backend devs, 1 frontend dev, 1 QA, 0.5 DevOps.
- Estimated effort: ~10 weeks (see milestones) ≈ 400-450 person-hours.
- Infrastructure cost: for “few hundred transactions/day” expect free tiers; budget for email service and domain/SSL only ~$50/month.

### Phase 1 Resources (AWS Implementation)
- **Development Team**: 1 full-stack developer
- **Estimated Effort**: 10 weeks ≈ 200-250 person-hours
- **AWS Infrastructure Cost**:
  - DynamoDB: Free tier (25 GB storage, 25 WCU, 25 RCU)
  - Lambda: Free tier (1M requests/month, 400,000 GB-seconds)
  - API Gateway: Free tier (1M requests/month for first 12 months)
  - SES: $0.10 per 1,000 emails
  - Secrets Manager: $0.40/secret/month
  - CloudWatch: Free tier (5 GB logs, 10 custom metrics)
  - **Total Monthly Cost**: $5-15/month
- **Domain & SSL**: $10-15/year, SSL free with AWS Certificate Manager

### Phase 2 Resources (Future)
- **Estimated Effort**: 3 weeks ≈ 60-80 person-hours
- **Additional Cost**: None

### Phase 3 Resources (Future)
- **Estimated Effort**: 8 weeks ≈ 160-200 person-hours
- **Additional Cost**: Free tiers for other backends


## 10. Version Control & Change Management
- Branching strategy: `main` (production), `develop` (integration), feature branches.
- Pull request review (2 reviewers) mandatory.
- Changes to backend configuration (which store) must be documented and approved.
- Version API endpoints with major version (e.g., `/api/v1/auth`).
- Maintain changelog.

## 11. Deployment Plan
- Stage environment mirror production (config pointing to test DB, test email service).
- Deploy to staging first; run smoke tests.
- If OK, deploy to production.
- Use CI/CD to automate build, test, deploy; rollback strategy defined.
- Monitor logs and metrics post-deployment for at least 48 hours.

## 12. Maintenance & Support
- Token cleanup: schedule daily job to remove expired tokens.
- Session cleanup: remove/invalidate old sessions.
- Monitor authentication logs for abuse or anomalies.
- Update OAuth provider credentials before they expire.
- Add monitoring alerts for service errors and latency.

## 13. Deliverables

### Phase 1 Deliverables (AWS Email/Password)
- ✅ AWS infrastructure deployed (DynamoDB, Lambda, API Gateway, SES)
- ✅ REST API endpoints functional (signup, login, confirm, forgot, reset, logout)
- ✅ Email/password authentication working end-to-end
- ✅ JWT/session management implemented
- ✅ Email confirmation and password reset flows operational
- ✅ Security controls in place (rate limiting, input validation, password hashing)
- ✅ Logging and monitoring configured (CloudWatch)
- ✅ Test suite with >80% coverage
- ✅ Frontend pages integrated with backend API
- ✅ API documentation
- ✅ Deployment documentation
- ✅ Operational runbook
- ✅ Production environment deployed and tested

### Phase 2 Deliverables (Social Login - Future)
- OAuth provider integrations (Google, Facebook, LinkedIn)
- Social login Lambda functions
- Account linking functionality
- Updated frontend with social login buttons
- Tests for social login flows

### Phase 3 Deliverables (Additional Backends - Future)
- Repository abstraction layer
- Azure implementation (Cosmos DB + Azure Functions)
- Google Cloud implementation (Firestore + Cloud Functions)
- Supabase implementation (PostgreSQL + Supabase SDK)
- Back4App implementation (Parse Server SDK)
- Backend switching configuration
- Cross-backend test suite
- Backend switching guide

## 14. Implementation Summary

### Modular Architecture Approach

This implementation plan follows a modular, phased approach:

**Common Components** (reusable across all implementations):
- REST API specification and contracts
- Authentication business logic
- Validation and error handling
- JWT utilities
- Email service abstraction
- Security controls

**Backend-Specific Components** (varies by implementation):
- Data storage layer (DynamoDB, Cosmos DB, Firestore, etc.)
- Infrastructure deployment (CloudFormation, ARM templates, etc.)
- Connection management

**Authentication Methods** (incremental addition):
- Phase 1: Email/password (standard login)
- Phase 2: Social login (OAuth providers)
- Future: MFA, passwordless, etc.

### Why AWS First?

AWS was chosen as the primary implementation path because:
1. **Generous Free Tier**: Suitable for "few hundred transactions/day"
2. **Serverless Architecture**: No server management, auto-scaling
3. **Integrated Services**: DynamoDB, Lambda, API Gateway, SES work seamlessly together
4. **Low Cost**: $5-15/month for expected traffic
5. **Mature Ecosystem**: Well-documented, extensive community support
6. **Infrastructure as Code**: CloudFormation/Terraform for reproducible deployments

### Migration Path to Other Backends

Once Phase 1 is complete, the common components can be reused for other backends:
1. Extract AWS-specific code into repository implementation
2. Define repository interfaces
3. Implement interfaces for new backend
4. Test with same test suite
5. Deploy alongside AWS implementation
6. Switch via configuration

This approach minimizes risk and allows for incremental delivery of value.
