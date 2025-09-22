# Comprehensive Advanced Features Testing

## Frontmatter Support

---
title: "Advanced Features Documentation"
author: "Development Team"
date: "2023-03-15"
version: "2.1.0"
tags: ["adf", "markdown", "parser", "testing"]
status: "draft"
reviewers: ["alice.dev", "bob.senior"]
metadata:
  project: "extended-adf-markdown-parser"
  milestone: "2.1.0"
  priority: "high"
---

## Inline Card Elements

### Basic Inline Cards

Visit our [project repository](https://github.com/example/extended-adf-parser) for the latest updates.

Check out the [documentation site](https://docs.example.com/adf-parser) for detailed guides.

Review the [API specification](https://api.example.com/v2/docs) for integration details.

### Smart Link Cards

<!-- adf:inlineCard appearance="inline" -->
[Confluence Page: Project Overview](https://company.atlassian.net/wiki/spaces/PROJECT/pages/123456)

<!-- adf:inlineCard appearance="block" -->
[Jira Issue: Authentication Bug](https://company.atlassian.net/browse/PROJ-456)

<!-- adf:inlineCard appearance="embed" -->
[GitHub Pull Request: Feature Implementation](https://github.com/company/project/pull/789)

## Text Color Elements

### Basic Text Colors

This text has <span style="color: red">red color</span> for emphasis.

Important information in <span style="color: blue">blue</span> to highlight key points.

Success messages appear in <span style="color: green">green</span> text.

Warning text uses <span style="color: orange">orange</span> for caution.

### Custom Color Codes

<!-- adf:textColor color="#ff5733" -->
Custom hex color text for brand consistency.

<!-- adf:textColor color="#3498db" -->
Brand blue for corporate communications.

<!-- adf:textColor color="#e74c3c" -->
Alert red for critical notifications.

## Background Color Elements

### Highlighted Text

This sentence contains <span style="background-color: yellow">highlighted yellow text</span> for attention.

Key terms can be <span style="background-color: lightblue">highlighted in light blue</span>.

<!-- adf:backgroundColor color="#f8f9fa" -->
Text with subtle background highlighting for readability.

<!-- adf:backgroundColor color="#fff3cd" -->
Warning background color for important notices.

## Subscript and Superscript

### Mathematical Expressions

The formula for water is H₂O, where the 2 is subscript.

Einstein's famous equation is E = mc², where the 2 is superscript.

### Chemical Formulas

Common chemicals:
- Carbon dioxide: CO₂
- Sulfuric acid: H₂SO₄
- Methane: CH₄

### Mathematical Equations

Mathematical expressions:
- Area of circle: A = πr²
- Pythagorean theorem: a² + b² = c²
- Power notation: x^n = x × x × ... (n times)

### Footnotes and References

This statement needs verification¹.

The research was conducted in 2023².

See the appendix for more details³.

**References:**
1. Scientific Journal of Advanced Research
2. Annual Technology Report 2023  
3. Appendix A: Statistical Analysis

## Underline Text

### Basic Underline

This text is <u>underlined</u> for emphasis.

Important <u>legal terms</u> are often underlined.

### Combined Formatting

Text can be **bold and <u>underlined</u>** simultaneously.

Or *italic and <u>underlined</u>* for different emphasis.

Even ~~strikethrough and <u>underlined</u>~~ for complex formatting.

## Complex Formatting Combinations

### Mixed Text Formatting

This paragraph demonstrates **bold**, *italic*, <u>underlined</u>, ~~strikethrough~~, and `inline code` all in one sentence.

### Nested Formatting

**Bold text with *italic inside* and <u>underline</u>** shows nested formatting.

*Italic text with **bold emphasis** and `code snippets`* demonstrates complexity.

### Formatted Text with Colors

<span style="color: red">**Bold red text**</span> for critical alerts.

<span style="color: blue">*Italic blue text*</span> for informational notes.

<span style="background-color: yellow">**Highlighted bold text**</span> for maximum emphasis.

## Advanced List Combinations

### Lists with Status and Dates

#### Project Tasks with Status

- [x] **Requirements Analysis** [Complete] - Due: {date:2023-03-01}
  - [x] Stakeholder interviews [Complete]
  - [x] Feature specification [Complete]
  - [ ] Risk assessment [In Progress]

- [ ] **Design Phase** [In Progress] - Due: {date:2023-03-15}
  - [x] Wireframes [Complete]
  - [ ] UI mockups [In Progress]
  - [ ] User flow diagrams [Pending]

- [ ] **Development** [Not Started] - Due: {date:2023-04-30}
  - [ ] Backend API [Not Started]
  - [ ] Frontend components [Not Started]
  - [ ] Database schema [Not Started]

### Lists with Media and Links

#### Documentation Assets

1. **User Guides**
   
   ![User guide cover](media:user-guide-v2)
   - [Getting Started Guide](https://docs.example.com/getting-started)
   - [Advanced Features](https://docs.example.com/advanced)
   - [Troubleshooting](https://docs.example.com/troubleshooting)

2. **Video Tutorials**
   
   ![Tutorial thumbnail](media:tutorial-series-thumb)
   - [Basic Setup Video](https://videos.example.com/setup)
   - [Configuration Tutorial](https://videos.example.com/config)

## Tables with Advanced Elements

### Status Dashboard Table

| Component | Status | Assignee | Due Date | Progress |
|-----------|--------|----------|----------|----------|
| Authentication | [Complete] | {user:alice.dev} | {date:2023-03-01} | 100% |
| Dashboard UI | [In Progress] | {user:bob.frontend} | {date:2023-03-15} | 75% |
| API Gateway | [Blocked] | {user:charlie.backend} | {date:2023-03-20} | 30% |
| Testing | [Not Started] | {user:diana.qa} | {date:2023-03-25} | 0% |

### Feature Comparison Table

| Feature | Basic | Premium | Enterprise |
|---------|-------|---------|------------|
| Users | 5 | 50 | Unlimited |
| Storage | 1GB | 100GB | 1TB |
| API Calls | 1,000/month | 10,000/month | Unlimited |
| Support | Email | Priority | <span style="color: gold">24/7 Phone</span> |
| SSO | ❌ | ✅ | ✅ |
| Analytics | Basic | Advanced | ![Premium analytics](media:analytics-enterprise) |

## Code Blocks with Advanced Features

### Multi-language Code Examples

#### JavaScript with Syntax Highlighting

```javascript
// Advanced authentication service
class AuthService {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.clientId = config.clientId;
  }

  async authenticate(credentials) {
    try {
      const response = await fetch(`${this.apiUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': this.clientId
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }
}
```

#### Python with Documentation

```python
"""
Advanced data processing module for ADF parser
Handles complex document structures and validation
"""

import json
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class AdfNode:
    """Represents an ADF document node"""
    type: str
    attrs: Optional[Dict] = None
    content: Optional[List] = None
    marks: Optional[List] = None

class AdfProcessor:
    """Main processor for ADF document parsing and validation"""
    
    def __init__(self, schema_path: str):
        """Initialize processor with schema validation"""
        with open(schema_path, 'r') as f:
            self.schema = json.load(f)
    
    def validate_node(self, node: AdfNode) -> bool:
        """Validate node against ADF schema"""
        # Implementation details...
        return True
    
    def process_document(self, doc: Dict) -> List[AdfNode]:
        """Process complete ADF document"""
        nodes = []
        for item in doc.get('content', []):
            node = AdfNode(
                type=item.get('type'),
                attrs=item.get('attrs'),
                content=item.get('content'),
                marks=item.get('marks')
            )
            if self.validate_node(node):
                nodes.append(node)
        return nodes
```

#### SQL with Comments

```sql
-- Advanced query for user analytics
-- Includes performance optimization and proper indexing
WITH user_metrics AS (
  SELECT 
    u.id,
    u.email,
    u.created_at,
    COUNT(s.id) as session_count,
    AVG(s.duration) as avg_session_duration,
    MAX(s.last_activity) as last_seen
  FROM users u
  LEFT JOIN sessions s ON u.id = s.user_id
  WHERE u.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY u.id, u.email, u.created_at
),
engagement_scores AS (
  SELECT 
    *,
    CASE 
      WHEN session_count > 20 THEN 'high'
      WHEN session_count > 5 THEN 'medium'
      ELSE 'low'
    END as engagement_level
  FROM user_metrics
)
SELECT 
  engagement_level,
  COUNT(*) as user_count,
  AVG(avg_session_duration) as avg_duration
FROM engagement_scores
GROUP BY engagement_level
ORDER BY user_count DESC;
```

## Panel and Expand Combinations

### Nested Advanced Elements

~~~panel type=info title="Development Environment Setup"
Complete development environment configuration:

~~~expand title="System Requirements"
**Minimum Requirements:**
- OS: macOS 10.15+ / Ubuntu 18.04+ / Windows 10
- RAM: 8GB (16GB recommended)
- Storage: 10GB free space
- Node.js: 20.11.1 LTS

**Recommended Setup:**
- RAM: 32GB for optimal performance
- SSD storage for faster builds
- Multiple monitors for productivity
~~~

~~~expand title="Required Software"
Install the following tools:

1. **Node.js and npm**
   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20.11.1
   nvm use 20.11.1
   ```

2. **Git version control**
   ```bash
   # macOS
   brew install git
   # Ubuntu
   sudo apt-get install git
   ```

3. **Code editor** - VS Code recommended with extensions:
   - ESLint
   - Prettier
   - GitLens
   - JavaScript/TypeScript support
~~~

~~~expand title="Project Setup"
Clone and configure the project:

```bash
# Clone repository
git clone https://github.com/company/extended-adf-parser.git
cd extended-adf-parser

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Run development server
npm run dev
```

**Verify Installation:**
- [x] Node.js version 20.11.1 installed
- [x] Dependencies installed without errors
- [x] Development server starts on port 3000
- [x] Tests pass: `npm test`
~~~
~~~

## Metadata Comments

<!-- adf:metadata -->
<!-- author: development-team -->
<!-- created: 2023-03-15T10:30:00Z -->
<!-- modified: 2023-03-16T14:45:00Z -->
<!-- version: 2.1.0 -->
<!-- reviewers: alice.dev,bob.senior,charlie.architect -->
<!-- tags: advanced,features,testing,comprehensive -->
<!-- status: in-review -->

<!-- Document metadata for advanced features testing -->
<!-- This file demonstrates complex ADF element combinations -->

### Processing Instructions

<!-- adf:processing-instruction -->
<!-- convert-tables: true -->
<!-- preserve-formatting: true -->
<!-- validate-links: false -->
<!-- compress-media: true -->

## Complex Real-world Examples

### Bug Report with All Elements

#### Issue #789: Performance Degradation

**Reported by:** {user:qa.engineer}
**Assigned to:** {user:senior.backend}
**Status:** [High Priority] **Due:** {date:2023-03-20}

~~~panel type=error title="Critical Performance Issue"
Application response times have increased significantly:

![Performance graph](media:performance-degradation-graph)

**Metrics showing degradation:**
- API response time: 2.5s (normal: <200ms)
- Database queries: 15s average
- Memory usage: 85% (normal: <60%)
~~~

~~~expand title="Reproduction Steps"
1. Navigate to dashboard at {date:2023-03-15T14:00:00}
2. Load user analytics report
3. Observe **slow loading** and <span style="color: red">timeout errors</span>
4. Check browser console for JavaScript errors

```javascript
// Error observed in console
TypeError: Cannot read property 'data' of undefined
  at AnalyticsComponent.render (analytics.js:45)
```
~~~

~~~expand title="Investigation Results"
**Database Analysis:**

```sql
-- Slow query identified
SELECT u.*, p.*, a.* 
FROM users u 
JOIN profiles p ON u.id = p.user_id
JOIN analytics a ON u.id = a.user_id
WHERE u.active = true
  AND a.created_at >= '2023-03-01'
-- Missing index on analytics.created_at
```

**System Resources:**
- CPU usage: 95% during peak hours
- Memory leak in analytics service
- Database connection pool exhausted
~~~

**Action Items:**
- [ ] Add database index [Critical] - {user:db.admin}
- [ ] Fix memory leak [High] - {user:backend.dev}  
- [ ] Optimize queries [Medium] - {user:senior.backend}
- [ ] Add monitoring [Low] - {user:devops.engineer}

### Release Planning Document

#### Version 3.0 Release Plan

**Release Manager:** {user:release.manager}
**Target Date:** {date:2023-06-01}

~~~panel type=success title="Release Goals"
**Primary Objectives:**
- ✅ Complete UI redesign
- 🔄 Enhanced performance (50% improvement target)
- 📱 Mobile-first responsive design
- 🔐 Advanced security features
- 🌐 Multi-language support
~~~

##### Feature Development Status

| Feature | Owner | Status | Completion |
|---------|-------|--------|------------|
| **Core Features** | | | |
| New Dashboard | {user:ui.lead} | [In Progress] | 75% |
| User Management 2.0 | {user:auth.specialist} | [Complete] | 100% |
| Advanced Search | {user:search.engineer} | [Testing] | 90% |
| **Infrastructure** | | | |
| Database Migration | {user:db.architect} | [Planning] | 25% |
| API v3 | {user:api.lead} | [Development] | 60% |
| **Quality Assurance** | | | |
| Automated Testing | {user:qa.automation} | [In Progress] | 80% |
| Performance Testing | {user:performance.engineer} | [Scheduled] | 0% |

~~~expand title="Detailed Timeline"
**Phase 1: Core Development** ({date:2023-03-01} - {date:2023-04-15})
- [x] Requirements finalization [Complete]
- [x] Technical architecture [Complete] 
- [ ] Feature development [85% complete]

**Phase 2: Integration & Testing** ({date:2023-04-16} - {date:2023-05-15})
- [ ] Component integration [Not Started]
- [ ] End-to-end testing [Scheduled]
- [ ] Performance optimization [Planned]

**Phase 3: Release Preparation** ({date:2023-05-16} - {date:2023-06-01})
- [ ] Documentation updates [Not Started]
- [ ] Deployment preparation [Not Started]
- [ ] Go-live planning [Not Started]
~~~

**Risk Assessment:**
~~~panel type=warning title="Potential Risks"
1. **Technical Risks:**
   - Database migration complexity [Medium Risk]
   - Third-party API dependencies [Low Risk]
   - Performance targets may not be met [High Risk]

2. **Resource Risks:**  
   - {user:ui.lead} vacation scheduled during Phase 2
   - New team member onboarding overlap
   - External consultant availability uncertain

3. **Timeline Risks:**
   - Feature scope creep from stakeholders
   - Integration testing may reveal blocking issues
   - Go-live date conflicts with holiday season
~~~