# JohnBoen.com Projects Hub

A config-driven, static web hub for organizing and showcasing personal projects across software engineering, martial arts, and maker projects. Built with vanilla HTML, CSS, and JavaScript—no build process required.

## 🌟 Features

- **JSON-Driven Navigation**: All content organized through a single `sites.json` configuration file
- **Three-Level Navigation**: Groups → Subgroups → Sites with visual differentiation
- **Responsive Design**: Desktop sidebar layout with mobile hamburger menu
- **Iframe Integration**: Seamless embedding of sub-sites with fallback support
- **Shared Design System**: Consistent dark theme across all sub-sites
- **Zero Build Process**: Pure static HTML/CSS/JS for easy deployment
- **GitHub Pages Ready**: Single repository hosting with no repeated DNS updates

## 🏗️ Project Structure

```
/
├── index.html              # Main hub application
├── app.js                  # Hub navigation logic
├── style.css               # Hub-specific styles
├── sites.json              # Configuration for all groups and sites
├── CNAME                   # Custom domain configuration
├── assets/
│   └── styles/
│       ├── theme.css       # Shared CSS variables and theme
│       └── base.css        # Shared base styles
├── sites/
│   ├── home/               # Welcome/home page
│   ├── software-engineering/
│   │   ├── ai-agentic/
│   │   ├── database-engineering/
│   │   ├── data-engineering/
│   │   ├── data-science-ml/
│   │   ├── data-management/
│   │   ├── data-presentation/
│   │   └── data-quality/
│   ├── martial-arts-fitness/
│   │   └── martial-arts/
│   └── making-anything/
│       └── making-anything/
└── docs/
    ├── johnboen_design_document.md
    ├── johnboen_plan_document.md
    ├── TEST_CHECKLIST.md
    └── AUTOMATED_TEST_REPORT.md
```

## 🚀 Quick Start

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/bonjohen/page_viewer.git
   cd page_viewer
   ```

2. Start a local HTTP server:
   ```bash
   # Python 3 (Recommended - binds to localhost only for security)
   python -m http.server 8000 --bind 127.0.0.1

   # Python 3 (Alternative - accessible from network)
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (with http-server)
   npx http-server -p 8000
   ```

3. Open your browser to `http://localhost:8000`

**Security Note**: Using `--bind 127.0.0.1` ensures the server only accepts connections from your local machine, preventing external access and potential security issues.

### GitHub Pages Deployment

This site is configured for GitHub Pages deployment:

1. Push to the `main` branch
2. GitHub Pages automatically serves from the repository root
3. Access at: `https://bonjohen.github.io/page_viewer/`
4. Custom domain: `https://johnboen.com/` (configured via CNAME)

## 📝 Adding New Content

### Adding a New Site

1. Create a new folder under the appropriate group in `/sites/`
2. Add `index.html` and `style.css` to the new folder
3. Import shared styles in your HTML:
   ```html
   <link rel="stylesheet" href="../../assets/styles/theme.css">
   <link rel="stylesheet" href="../../assets/styles/base.css">
   ```
4. Update `sites.json` to include the new site:
   ```json
   {
     "id": "new-site",
     "label": "New Site",
     "description": "Description of the new site.",
     "url": "./sites/new-site/",
     "embed": true
   }
   ```

### Adding a New Group

1. Create a new group folder in `/sites/`
2. Add a group landing page (optional)
3. Update `sites.json` with the new group:
   ```json
   {
     "id": "new-group",
     "name": "New Group",
     "url": "./sites/new-group/",
     "sites": []
   }
   ```

## 🎨 Design System

### Color Scheme
- **Background**: Deep slate (#0f172a)
- **Accent**: Teal (#14b8a6)
- **Group Colors**:
  - Software Engineering: Blue (#3b82f6)
  - Martial Arts & Fitness: Red (#ef4444)
  - Making Anything: Orange (#f59e0b)

### Typography
- System UI font stack for optimal performance
- Responsive font sizes using CSS variables

## 📚 Documentation

- **[Design Document](docs/johnboen_design_document.md)**: Detailed architecture and design decisions
- **[Implementation Plan](docs/johnboen_plan_document.md)**: Step-by-step implementation guide
- **[Test Checklist](docs/TEST_CHECKLIST.md)**: Manual testing procedures
- **[Automated Test Report](docs/AUTOMATED_TEST_REPORT.md)**: Code validation results

## 🧪 Testing

Run the automated code validation:
```bash
# Ensure all files are present and properly structured
# See docs/AUTOMATED_TEST_REPORT.md for results
```

Manual testing checklist available in `docs/TEST_CHECKLIST.md`

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **GitHub Pages**: Static site hosting

## 📄 License

This is a personal portfolio project. All rights reserved.

## 👤 Author

**John Boen**
- GitHub: [@bonjohen](https://github.com/bonjohen)
- Website: [johnboen.com](https://johnboen.com)

## 🗺️ Roadmap

- [ ] Add search functionality across all sites
- [ ] Implement dark/light theme toggle
- [ ] Add RSS feed for project updates
- [ ] Create project timeline visualization
- [ ] Add analytics integration

