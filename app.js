require('dotenv').config();

const express = require('express');
const compression = require('compression');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./app/routes');
const dateFilter = require('nunjucks-date-filter');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const govukMarkdown = require('govuk-markdown');
const session = require('express-session');
const csrf = require('csurf');
const {
    removeFilter,
    findServiceName,
    formatDateFilter,
    findById,
    formatNumber,
    getFileMetadata,
} = require('./middleware/filters');

const app = express();

// Configure Nunjucks
const nunjuckEnv = nunjucks.configure(
    [
        'app/views',
        'node_modules/govuk-frontend/dist/',
        'node_modules/dfe-frontend/packages/components',
    ], {
        autoescape: true,
        express: app,
        watch: process.env.NODE_ENV === 'development',
        noCache: process.env.NODE_ENV === 'development',
    }
);

// Configure compression with better settings
app.use(
    compression({
        level: 6, // Good balance between compression and CPU usage
        threshold: 1024, // Only compress responses larger than 1KB
        filter: (req, res) => {
            // Don't compress if the client doesn't support it
            if (req.headers['x-no-compression']) {
                return false;
            }
            // Use compression for all other requests
            return compression.filter(req, res);
        },
    })
);

// Serve static files with caching headers
const staticOptions = {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
    lastModified: true,
};

// Specific caching for consolidated files
const consolidatedOptions = {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    immutable: true, // Add immutable flag for better caching
};

app.use(
    '/govuk',
    express.static(
        path.join(__dirname, 'node_modules/govuk-frontend/govuk/assets'),
        staticOptions
    )
);
app.use(
    '/dfe',
    express.static(path.join(__dirname, 'node_modules/dfe-frontend/dist'), staticOptions)
);
app.use('/public', express.static('app/public', staticOptions));
app.use('/assets', express.static('app/public', staticOptions));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules'), staticOptions));

// Serve consolidated files with specific caching
app.use(
    '/public/css/consolidated.min.css',
    express.static('app/public/css/consolidated.min.css', consolidatedOptions)
);
app.use(
    '/public/js/consolidated.min.js',
    express.static('app/public/js/consolidated.min.js', consolidatedOptions)
);
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

app.use(
    '/favicon.ico',
    express.static(path.join(__dirname, 'public/assets/images/favicon.ico'))
);

// Add date filter
nunjuckEnv.addFilter('date', dateFilter);

// Add custom filters
nunjuckEnv.addFilter('removeFilter', removeFilter);
nunjuckEnv.addFilter('findServiceName', findServiceName);
nunjuckEnv.addFilter('findById', findById);
nunjuckEnv.addFilter('formatDateFilter', formatDateFilter);
nunjuckEnv.addFilter('formatNumber', formatNumber);
nunjuckEnv.addFilter('getFileMetadata', getFileMetadata);
nunjuckEnv.addGlobal('govukRebrand', true);


// Add updateQueryParams filter for pagination
nunjuckEnv.addFilter('updateQueryParams', function(url, params) {
    const urlObj = new URL(url, 'http://localhost');
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            urlObj.searchParams.set(key, value);
        } else {
            urlObj.searchParams.delete(key);
        }
    });
    return urlObj.pathname + urlObj.search;
});

// Add tojson filter
nunjuckEnv.addFilter('tojson', function(obj) {
    return JSON.stringify(obj);
});

nunjuckEnv.addFilter('find', function(arr, opts) {
    if (!Array.isArray(arr) ||
        !opts ||
        !opts.attribute ||
        typeof opts.value === 'undefined'
    )
        return null;
    return arr.find((item) => item[opts.attribute] == opts.value);
});

// Register marked and markdown libraries
marked.use(
    govukMarkdown({
        headingsStartWith: 'xl',
    })
);

markdown.register(nunjuckEnv, marked.parse);

// Set view engine
app.set('view engine', 'html');
app.set('views', [path.join(__dirname, 'app/views')]);

// Add security and performance headers
app.use((req, res, next) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Performance headers
    res.setHeader('Vary', 'Accept-Encoding');

    // Cache control for HTML pages
    if (req.path.endsWith('.html') || (!req.path.includes('.') && req.path !== '/')) {
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache HTML for 1 hour
    }

    next();
});

// Make request object available to all templates
app.use((req, res, next) => {
    res.locals.req = req;
    res.locals.env = process.env.NODE_ENV;
    next();
});

// Add a route that serves the app/robots.txt file
app.get('/robots.txt', function(req, res) {
    res.sendFile(path.join(__dirname, 'app/robots.txt'));
});

// Just do basic session handling
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Add navigation items and DfE-specific variables to all responses
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.currentPath = req.path;
    res.locals.navigationItems = req.session.user ? getNavigationItems(req.session.user) : [];
    res.locals.serviceName = process.env.SERVICE_NAME;
    res.locals.env = process.env.NODE_ENV;

    // Set default dateModified to today for LD+JSON
    res.locals.dateModified = new Date().toISOString().split('T')[0];



    next();
});

// Use application routes
app.use('/', routes);

// Test route
app.get('/api/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Test route working' });
});

// Clean URLs
app.get(/\.html?$/i, function(req, res) {
    let urlPath = req.path;
    const parts = urlPath.split('.');
    parts.pop();
    urlPath = parts.join('.');
    res.redirect(urlPath);
});

// Dynamic Route Matching for URLs without extensions
app.get(/^([^.]+)$/, function(req, res, next) {
    matchRoutes(req, res, next);
});

// Route matching function
function matchRoutes(req, res, next) {
    let path = req.path;
    path = path.startsWith('/') ? path.slice(1) : path;
    if (path === '') {
        path = 'index';
    }
    console.log(path);
    renderPath(path, res, next);
}

function renderPath(path, res, next) {
    res.render(path, function(error, html) {
        if (!error) {
            res.set({ 'Content-type': 'text/html; charset=utf-8' });
            res.end(html);
            return;
        }
        if (!error.message.startsWith('template not found')) {
            next(error);
            return;
        }
        if (!path.endsWith('/index')) {
            renderPath(path + '/index', res, next);
            return;
        }
        next();
    });
}

// Handle 404 errors
app.use(function(req, res, next) {
    res.status(404).render('404');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        originalMethod: req.originalMethod,
        path: req.path,
        body: req.body
    });

    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).render('error', {
            message: 'Invalid CSRF token',
            error: process.env.NODE_ENV === 'development' ? {
                stack: 'The form submission failed the CSRF validation. Please try again.'
            } : null
        });
    }

    res.status(500).render('error', {
        message: 'Something went wrong',
        error: process.env.NODE_ENV === 'development' ? {
            stack: err.stack || err.message
        } : null
    });
});

// Start the server
const PORT = process.env.PORT || 3519;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;