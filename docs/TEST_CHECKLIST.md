# Testing & Validation Checklist - JohnBoen.com Hub

**Test Date:** _____________  
**Tester:** _____________  
**Browser:** Chrome/Edge  
**Test URL:** http://localhost:8000

---

## 6.1 Desktop Tests

### Sidebar Loads Correctly
- [ ] All three groups appear ("Software Engineering", "Martial Arts & Fitness", "Making Anything")
- [ ] Group headers display correctly as non-interactive labels
- [ ] All four sites are listed under their respective groups
- [ ] Software Engineering group shows two sites ("AI Engineering Journey", "Database Engineering")
- [ ] Site labels are visible and readable
- [ ] Site descriptions are visible and readable
- [ ] Sidebar has proper dark theme styling
- [ ] "John Boen" title and "Projects Hub" subtitle appear in sidebar header

### Iframe Loads All Sites
- [ ] Click "AI Engineering Journey" - iframe loads `/ai-agentic/`
- [ ] Content displays correctly in iframe (header, sections, placeholders visible)
- [ ] Loading spinner appears briefly during load
- [ ] Loading spinner disappears after content loads
- [ ] Click "Database Engineering" - iframe loads `/database-engineering/`
- [ ] Content displays correctly (focus areas, topics visible)
- [ ] Click "Solo Martial Artist" - iframe loads `/martial-arts/`
- [ ] Content displays correctly in iframe
- [ ] Click "Maker Projects" - iframe loads `/making-anything/`
- [ ] Content displays correctly (capabilities grid, project entries visible)
- [ ] Iframe fills the content area properly
- [ ] No scrolling issues or layout breaks

### Selection Highlighting
- [ ] Click "AI Engineering Journey" - item highlights with teal background
- [ ] Active site label text turns dark (high contrast)
- [ ] Click "Solo Martial Artist" - highlighting switches to this item
- [ ] Only one site is highlighted at a time
- [ ] Hover states work on non-selected items (subtle background change)
- [ ] Active state is visually distinct from hover state

### Refresh Preserves State
- [ ] Select "AI Engineering Journey"
- [ ] Note the URL includes `?site=ai-engineering-journey`
- [ ] Refresh the page (F5 or Ctrl+R)
- [ ] "AI Engineering Journey" is still selected after refresh
- [ ] Iframe still shows the correct content
- [ ] Select "Solo Martial Artist"
- [ ] Note URL changes to `?site=solo-martial-artist`
- [ ] Refresh the page
- [ ] "Solo Martial Artist" is still selected after refresh

---

## 6.2 Mobile Tests

### Responsive Layout
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select mobile device (e.g., iPhone 12 Pro, 390x844)
- [ ] Mobile header appears at top
- [ ] Hamburger menu button (three lines) is visible
- [ ] "John Boen" title appears in mobile header
- [ ] Desktop sidebar is hidden off-screen

### Hamburger Menu & Drawer
- [ ] Click hamburger menu button
- [ ] Sidebar slides in from the left
- [ ] Dark overlay appears behind sidebar
- [ ] Sidebar shows full navigation (groups and sites)
- [ ] Click overlay - sidebar closes
- [ ] Click hamburger again - sidebar opens
- [ ] Select a site from mobile sidebar
- [ ] Sidebar automatically closes after selection
- [ ] Selected site loads in iframe

### Mobile Iframe Behavior
- [ ] Iframe fits mobile viewport width
- [ ] No horizontal scrolling on mobile
- [ ] Content is readable on mobile screen
- [ ] Toolbar with "Open in New Tab" button is visible
- [ ] Site title in toolbar is visible (may truncate on small screens)

---

## 6.3 Error Handling & Edge Cases

### Site Selection
- [ ] Click "AI Engineering Journey" - page loads in content area
- [ ] Site item is highlighted with teal background
- [ ] Click "Database Engineering" - page loads in content area
- [ ] Highlighting switches to the new selection
- [ ] Click "Solo Martial Artist" - page loads in content area
- [ ] Highlighting switches to the new selection
- [ ] Click "Maker Projects" - page loads in content area
- [ ] Highlighting switches to the new selection
- [ ] Only one site is highlighted at a time
- [ ] Group headers are not clickable (labels only)

### Open in New Tab Functionality
- [ ] Select any site
- [ ] "Open in New Tab" button appears in toolbar
- [ ] Click "Open in New Tab" button
- [ ] Site opens in a new browser tab
- [ ] New tab shows the sub-site directly (not in iframe)

### Welcome Message
- [ ] Clear URL query parameter (visit `http://localhost:8000` without `?site=...`)
- [ ] Welcome message appears in content area
- [ ] Message says "Welcome to John Boen's Projects Hub"
- [ ] Instruction to "Select a project from the sidebar" is visible
- [ ] No iframe is visible
- [ ] "Open in New Tab" button is hidden

### Visual & Styling
- [ ] All text is readable (good contrast)
- [ ] Teal accent color (#14b8a6) is used consistently
- [ ] Dark theme is applied throughout
- [ ] No broken images or missing icons
- [ ] SVG icons render correctly (chevrons, external link icon)
- [ ] Fonts load correctly (system font stack)
- [ ] Border radius and shadows appear as expected
- [ ] Smooth transitions on hover and interactions

### Console & Network
- [ ] Open browser DevTools Console tab
- [ ] No JavaScript errors appear
- [ ] Open Network tab and refresh
- [ ] All resources load successfully (200 status):
  - `index.html`
  - `app.js`
  - `style.css`
  - `sites.json`
  - `/assets/styles/theme.css`
  - `/assets/styles/base.css`
- [ ] Sub-site resources load when selected:
  - `/ai-agentic/index.html`
  - `/ai-agentic/style.css`
  - `/martial-arts/index.html`
  - `/martial-arts/style.css`

---

## Additional Notes

**Issues Found:**
_____________________________________________
_____________________________________________
_____________________________________________

**Suggestions:**
_____________________________________________
_____________________________________________
_____________________________________________

**Overall Status:** ☐ PASS  ☐ FAIL  ☐ NEEDS REVIEW

