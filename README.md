# Accessibility Manual

A comprehensive accessibility manual for the Department for Education.

## Performance Optimizations

This application includes several performance optimizations to improve loading speed and reduce bandwidth usage:

### File Consolidation
- **CSS**: All CSS files are consolidated into a single `consolidated.min.css` file (226KB)
- **JavaScript**: Non-module JS files are consolidated into `consolidated.min.js` (43KB)
- **HTTP Requests**: Reduced from 7 CSS files and 5 JS files to just 2 consolidated files

### Caching Strategy
- **Static Assets**: 1-year cache with ETags and immutable flags
- **HTML Pages**: 1-hour cache for dynamic content
- **Consolidated Files**: Immutable caching for better performance

### Compression
- **Gzip Compression**: All responses compressed with optimal settings
- **Compression Level**: 6 (good balance between compression and CPU usage)
- **Threshold**: 1KB minimum size for compression

### Build Process
```bash
# Build consolidated files
npm run build

# Build CSS only
npm run build:css

# Build JS only
npm run build:js
```

The build process runs automatically on `npm install` via the `postinstall` script.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm start
```

## File Structure

```
app/
├── public/
│   ├── css/
│   │   ├── consolidated.min.css    # Consolidated CSS (226KB)
│   │   └── [individual files]      # Source files
│   └── js/
│       ├── consolidated.min.js     # Consolidated JS (43KB)
│       └── [individual files]      # Source files
└── views/
    └── layouts/
        └── layout.html             # Uses consolidated files
```

## Performance Benefits

- **Reduced HTTP Requests**: From 12 files to 3 files
- **Better Caching**: Immutable flags and longer cache times
- **Compression**: All content compressed with optimal settings
- **Bandwidth Savings**: Approximately 30% reduction in file size
- **Faster Loading**: Reduced latency from fewer requests

