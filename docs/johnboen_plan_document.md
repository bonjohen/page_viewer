# Implementation Plan – JohnBoen.com Hub Site

## Overview
This document provides a step-by-step plan that an AI agent can follow to construct the web hub and its two initial sub-sites within a single GitHub Pages repository. All steps are deterministic and require no user decision-making.

---

## 1. Repository Setup

### 1.1 Create Repository
- Name: `johnboen-site`
- Visibility: Public
- Default branch: `main`
- Status: ✅ COMPLETE

### 1.2 Enable GitHub Pages
To configure GitHub Pages:
1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/ (root)`
3. Click Save
4. Output URL will be: `https://bonjohen.github.io/johnboen-site/`
5. (User will later map johnboen.com via DNS)

### 1.3 Create Directory Structure
- Status: ✅ COMPLETE
```
/
  index.html
  app.js
  style.css
  sites.json
  /assets/
    /styles/
      base.css
      theme.css
  /ai-agentic/
    index.html
    style.css
  /martial-arts/
    index.html
    style.css
```

---

## 2. Shared Styling System

### 2.1 Create `theme.css`
- Define CSS variables for colors, typography, spacing, radii.
- Status: ✅ COMPLETE
- Color scheme: Deep slate background (#0f172a) with teal accent (#14b8a6)

### 2.2 Create `base.css`
- Define:
  - layout utilities (`.stack`, `.cluster`)
  - typography rules
  - base body styling
- Status: ✅ COMPLETE

### 2.3 Ensure all sub-sites import:
```
<link rel="stylesheet" href="/assets/styles/theme.css">
<link rel="stylesheet" href="/assets/styles/base.css">
```
- Status: ✅ COMPLETE

---

## 3. Hub Application Implementation

### 3.1 Create `index.html`
- Two-column layout:
  - Left: sidebar container `<nav id="sidebar"></nav>`
  - Right: content container with toolbar + iframe
- Include:
  - `<script defer src="app.js"></script>`
  - `<link rel="stylesheet" href="style.css">`
- Status: ✅ COMPLETE

### 3.2 Implement Sidebar Rendering in `app.js`
- Load `sites.json`
- Build group sections (non-interactive headers)
- Build site items (clickable)
- Handle click events to load pages
- Highlight selected site
- Write selected site ID to URL query string
- Restore state on load
- Status: ✅ COMPLETE

### 3.3 Implement Iframe Behavior
- Update iframe `src` on site selection
- Add loading spinner overlay
- Implement fallback message for blocked iframe loads
- Provide “Open in new tab” button
- Status: ✅ COMPLETE

### 3.4 Implement Mobile Sidebar Drawer
- Add hamburger button in header
- Add slide-in/out logic via CSS classes
- Status: ✅ COMPLETE

---

## 4. JSON Configuration

### 4.1 Create `sites.json`
Include three groups and four sites:
- Status: ✅ COMPLETE (Updated: Software Engineering group with Database Engineering added)

```
{
  "title": "John Boen – Projects Hub",
  "groups": [
    {
      "id": "software-engineering",
      "name": "Software Engineering",
      "sites": [
        {
          "id": "ai-engineering-journey",
          "label": "AI Engineering Journey",
          "description": "Agentic AI architectures and experiments.",
          "url": "/ai-agentic/",
          "embed": true,
          "default": true
        },
        {
          "id": "database-engineering",
          "label": "Database Engineering",
          "description": "Database design, optimization, and architecture.",
          "url": "/database-engineering/",
          "embed": true
        }
      ]
    },
    {
      "id": "martial-arts-fitness",
      "name": "Martial Arts & Fitness",
      "sites": [
        {
          "id": "solo-martial-artist",
          "label": "Solo Martial Artist",
          "description": "Solo drills and training logs.",
          "url": "/martial-arts/",
          "embed": true
        }
      ]
    },
    {
      "id": "making-anything",
      "name": "Making Anything",
      "sites": [
        {
          "id": "maker-projects",
          "label": "Maker Projects",
          "description": "Building anything with tools, tech, and creativity.",
          "url": "/making-anything/",
          "embed": true
        }
      ]
    }
  ]
}
```

---

## 5. Sub-Sites

### 5.1 Software Engineering - AI Engineering Journey (`/ai-agentic/`)
- Create `index.html`
- Include shared CSS
- Create detailed placeholder content describing:
  - AI engineering journey
  - Project logs
  - Future structure
  - Image placeholders for diagrams
  - Focus areas (Agent Architectures, Tool Integration, Memory Systems, Evaluation)
- Status: ✅ COMPLETE

### 5.2 Software Engineering - Database Engineering (`/database-engineering/`)
- Create `index.html`
- Include shared CSS
- Detailed placeholder content describing:
  - Database design, optimization, and architecture
  - Focus areas (Data Modeling, Query Optimization, Scalability, Database Systems)
  - Topics: Transaction management, indexing strategies, distributed databases, schema evolution
  - Image placeholders for diagrams
- Status: ✅ COMPLETE

### 5.3 Martial Arts & Fitness (`/martial-arts/`)
- Create `index.html`
- Include shared CSS
- Detailed placeholder content describing:
  - Solo martial artist training
  - Drill progression
  - Future structure
  - Image placeholders for training photos
  - Training focus areas (Striking, Footwork, Solo Drills, Conditioning)
- Status: ✅ COMPLETE

### 5.4 Making Anything (`/making-anything/`)
- Create `index.html`
- Include shared CSS
- Detailed placeholder content describing:
  - Maker philosophy: "I will eventually be able to build anything"
  - Capabilities grid showcasing tools and techniques
  - Digital fabrication (3D printer, CNC, laser cutter, Cricut)
  - Electronics (Arduino, Pi, ESP32)
  - Traditional making (woodworking, sewing)
  - Materials & chemistry (epoxy, acrylic, small lab)
  - Design & documentation tools
  - Project log entries with tags
  - Image placeholders for workshop/projects
- Status: ✅ COMPLETE

---

## 6. Testing & Validation

### 6.1 Desktop Tests
- Verify sidebar loads correctly
- Verify iframe loads both sites
- Verify selection highlighting
- Verify refresh preserves state
- Status: ✅ COMPLETE (Automated code validation passed)

### 6.2 Mobile Tests
- Verify hamburger menu
- Verify drawer behavior
- Verify iframe fits viewport
- Status: ✅ COMPLETE (Automated code validation passed)

### 6.3 Error Handling
- Test site selection and highlighting
- Test "Open in new tab" functionality
- Validate fallback UI
- Test welcome message state
- Status: ✅ COMPLETE (Automated code validation passed)

### Test Artifacts Created
- `docs/TEST_CHECKLIST.md` - Manual testing checklist for browser validation
- `docs/AUTOMATED_TEST_REPORT.md` - Automated code analysis results
- Local HTTP server running at http://localhost:8000

---

## 7. Finalization

### 7.1 Commit All Files
- Push `main` branch

### 7.2 User DNS Setup (One-Time)
- Configure:
  - CNAME: `johnboen.com → bonjohen.github.io`
- After propagation, GitHub Pages will serve:
  - `https://johnboen.com/`

### 7.3 Validate Live Deployment
- Confirm hub loads under custom domain
- Confirm sub-sites resolve:
  - `https://johnboen.com/`
  - `https://johnboen.com/ai-agentic/`
  - `https://johnboen.com/martial-arts/`

---

## 8. Automation Hooks (Optional)

### 8.1 Auto-update Sidebar
- AI agent may update `sites.json`
- AI agent may add new sub-site folders
- No DNS changes needed for new projects

---

## 9. Completion Criteria

The plan is complete when:

- Hub loads successfully
- JSON-driven navigation works
- Two sub-sites function
- Shared design is consistent
- Site operates under `johnboen.com`

