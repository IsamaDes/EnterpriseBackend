"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db")); // Assuming your DB connection setup
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Authentication routes
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize")); // Assuming you're using express-mongo-sanitize
const passport_1 = __importDefault(require("passport")); // If using Passport.js for authentication
const sanitizeInputs_1 = __importDefault(require("./middlewares/sanitizeInputs")); // Custom input sanitization middleware
const logRequest_1 = __importDefault(require("./middlewares/logRequest")); // Custom request logging middleware
dotenv_1.default.config();
const app = (0, express_1.default)();
// Log incoming request headers
app.use((req, res, next) => {
    console.log('Incoming request headers:', req.headers);
    next(); // Pass control to the next middleware or route handler
});
// CORS configuration
const corsOptions = {
    origin: ['https://enterpriseapp.onrender.com', 'http://localhost:5174'], // Adjust according to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // For legacy browsers
};
// Use middleware
app.use((0, cors_1.default)(corsOptions)); // Enable CORS globally with the specified options
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || 'defaultSecret')); // Use a secret for cookie parsing
app.use((0, helmet_1.default)()); // Security middleware that sets HTTP headers to secure your app
app.use(sanitizeInputs_1.default); // Custom input sanitization (ensure you're using this middleware)
app.use((0, express_mongo_sanitize_1.default)()); // Prevent NoSQL injection attacks by sanitizing user inputs
app.use(logRequest_1.default); // Custom logging middleware for requests
app.use(passport_1.default.initialize()); // Initialize Passport for authentication
// Setup compression with a custom filter for the "x-no-compression" header
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        // Don't compress responses if the header is present
        return false;
    }
    return compression_1.default.filter(req, res); // Default compression filter
};
app.use((0, compression_1.default)({ filter: shouldCompress })); // Enable response compression
// Middleware for parsing incoming JSON requests
app.use(express_1.default.json()); // Parse incoming JSON requests
// Preflight request handling (CORS OPTIONS requests)
app.options('*', (req, res) => {
    console.log('Preflight request received for:', req.url);
    res.status(200).send(); // Send a successful response to preflight request
});
// Example route to test CORS and basic response
app.get('/api/test', (req, res) => {
    res.send('CORS is working');
});
// Authentication routes (e.g., registration, login)
app.use('/api/auth', authRoutes_1.default);
// Connect to MongoDB
(0, db_1.default)(); // Ensure your connectDB function is properly set up
// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
