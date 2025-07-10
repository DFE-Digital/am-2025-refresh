# DfE Accessibility Manual

A comprehensive accessibility manual for the Department for Education, providing guidance, tools, and resources for creating accessible digital services.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Development](#development)
- [Performance Optimizations](#performance-optimizations)
- [Code Quality](#code-quality)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [Support](#support)

## 🎯 Overview

The DfE Accessibility Manual is a comprehensive resource that helps teams create accessible digital services. It provides:

- **Guidelines**: WCAG 2.1 guidelines with practical examples
- **Tools**: Testing tools and checklists for different accessibility needs
- **Standards**: DfE-specific accessibility standards and requirements
- **Training**: Resources for different professional roles
- **Audits**: Guidance on accessibility auditing and compliance

## ✨ Features

- **Comprehensive Coverage**: WCAG 2.1, COGA, and universal design principles
- **Role-based Guidance**: Specific guidance for content designers, interaction designers, and product managers
- **Testing Tools**: Curated collection of accessibility testing tools
- **Performance Optimized**: Fast loading with consolidated assets and caching
- **Accessibility First**: Built with accessibility best practices
- **Quality Assurance**: Automated code quality checks and validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd accessibility-2025

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3519`

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm start           # Start production server

# Build
npm run build       # Build consolidated CSS and JS files
npm run build:css   # Build CSS only
npm run build:js    # Build JS only

# Quality Checks
npm run lint        # Run all linting checks
npm run validate    # Run validation checks
npm run pre-commit  # Run pre-commit checks
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3519
SESSION_SECRET=your-session-secret
SERVICE_NAME="DfE Accessibility Manual"
```

## ⚡ Performance Optimizations

This application includes several performance optimizations:

### File Consolidation
- **CSS**: All CSS files consolidated into `consolidated.min.css` (226KB)
- **JavaScript**: Non-module JS files consolidated into `consolidated.min.js` (43KB)
- **HTTP Requests**: Reduced from 12 files to 3 files

### Caching Strategy
- **Static Assets**: 1-year cache with ETags and immutable flags
- **HTML Pages**: 1-hour cache for dynamic content
- **Consolidated Files**: Immutable caching for better performance

### Compression
- **Gzip Compression**: All responses compressed with optimal settings
- **Compression Level**: 6 (good balance between compression and CPU usage)
- **Threshold**: 1KB minimum size for compression

### Performance Benefits
- **Reduced HTTP Requests**: From 12 files to 3 files
- **Better Caching**: Immutable flags and longer cache times
- **Compression**: All content compressed with optimal settings
- **Bandwidth Savings**: Approximately 30% reduction in file size
- **Faster Loading**: Reduced latency from fewer requests

## 🔍 Code Quality

This project includes automated code quality checks to ensure consistent standards:

### Pre-commit Hooks (Local)

Install and setup pre-commit hooks:

```bash
# Install dependencies
npm install

# Setup husky pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

The pre-commit hook checks:
- ✅ HTML validation
- ✅ External links have `rel="noopener noreferrer"` attributes
- ✅ Internal links have correct `govuk-link govuk-link--no-visited-state` classes
- ✅ Common typos and spelling errors
- ✅ Accessibility attributes (alt text, ARIA labels)

### GitHub Actions (Server-side)

Automated checks run on:
- Pull requests to main/develop branches
- Pushes to main/develop branches

Checks include:
- 🔗 Link validation
- 🏷️ HTML validation
- ♿ Accessibility checks
- ✍️ Typo detection
- 🎨 Code formatting

### Manual Validation

Run checks manually:

```bash
# Run all checks
npm run validate

# Check specific issues
npm run validate:classes    # Check link classes
npm run validate:attributes # Check rel attributes
npm run lint:html          # HTML validation
```

## 📁 File Structure

```
accessibility-2025/
├── app/
│   ├── controllers/           # Express controllers
│   ├── data/                  # Static data and JSON files
│   ├── middleware/            # Custom middleware and filters
│   ├── public/                # Static assets
│   │   ├── css/
│   │   │   ├── consolidated.min.css    # Consolidated CSS (226KB)
│   │   │   └── [individual files]      # Source files
│   │   ├── js/
│   │   │   ├── consolidated.min.js     # Consolidated JS (43KB)
│   │   │   └── [individual files]      # Source files
│   │   ├── images/            # Images and icons
│   │   └── video/             # Video content
│   ├── routes.js              # Express routes
│   └── views/                 # Nunjucks templates
│       ├── layouts/           # Layout templates
│       ├── guidelines/        # WCAG and accessibility guidelines
│       ├── tools-testing/     # Testing tools and resources
│       ├── standards/         # Accessibility standards
│       ├── professions/       # Role-based guidance
│       └── audits-issues-statements/ # Audit guidance
├── .github/                   # GitHub Actions workflows
├── .husky/                    # Git hooks
├── middleware/                # Additional middleware
├── app.js                     # Express application setup
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes following the code quality standards
4. **Test** your changes: `npm run validate`
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to the branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Code Standards

- Follow the existing code formatting and style
- Ensure all links have correct classes and attributes
- Add appropriate alt text to images
- Test for accessibility compliance
- Update documentation as needed

### Pre-commit Checks

All commits must pass:
- ✅ HTML validation
- ✅ Link attribute validation
- ✅ Code formatting checks
- ✅ Typo detection

## 🆘 Support

### Getting Help

- **Documentation**: Check the manual sections for guidance
- **Issues**: Report bugs or request features via GitHub Issues
- **Accessibility**: Contact the DfE accessibility team for specific guidance

### Common Issues

**Build fails with validation errors:**
```bash
# Check what's failing
npm run validate

# Fix specific issues
npm run validate:classes
npm run validate:attributes
```

**Pre-commit hook not working:**
```bash
# Reinstall husky
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

### Environment Setup

If you encounter issues with the development environment:

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild assets
npm run build
```

## 📄 License

This project is part of the Department for Education's digital services and follows government accessibility standards.

---

**Built with ❤️ for accessibility**

