# Detailed Design Document – JohnBoen.com Hub Site

## 1. Goals & Constraints

1. Act as a **config-driven hub** for all JohnBoen content.
2. Left panel: **groups + sites** based on a JSON config.
3. Right panel: displays each site using an **iframe** (or fallback).
4. All projects live as **subfolders in one GitHub Pages repo** → **no repeated DNS updates**.
5. Shared visual system (CSS + layout) used across all projects.
6. Zero build process — **static HTML/CSS/JS only**.
7. Clean, minimal, responsive UI that works on desktop and mobile.

## 2. Information Architecture

### 2.1 Top-level URLs

- Hub: `https://johnboen.com/`
- Project sub-sites:
  - `https://johnboen.com/ai-agentic/`
  - `https://johnboen.com/martial-arts/`

### 2.2 Navigation Model

- Groups → Sites structure.
- Sites come from `sites.json`.

## 3. Layout & Responsive Behavior

### Desktop Layout
- Header + left sidebar + right iframe pane.

### Mobile Layout
- Hamburger menu opens the sidebar as a drawer.

## 4. Visual Design System

- Dark theme.
- System UI font stack.
- Shared CSS for all sub-sites.
- Accent color: teal or electric blue.

## 5. Components & Behavior

### Sidebar
- Group headers (non-interactive labels) organize sites by category.
- Clicking a site item loads its page in the content area.
- Highlight selected site with teal background.

### Content Pane
- Toolbar with “Open in new tab”.
- Iframe with fallback if embedding blocked.

## 6. State & Routing

- Supports `?site=<id>` query parameter.
- Optional persistence via `localStorage`.

## 7. JSON Schema

```json
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
          "url": "/ai-agentic/",
          "embed": true,
          "default": true
        },
        {
          "id": "database-engineering",
          "label": "Database Engineering",
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
          "url": "/making-anything/",
          "embed": true
        }
      ]
    }
  ]
}
```

## 8. Shared Style System

- All sub-sites import shared CSS:
  - `/assets/styles/theme.css`
  - `/assets/styles/base.css`

## 9. Accessibility & Performance

- Semantic HTML.
- ARIA attributes.
- Lazy-loaded iframe.
