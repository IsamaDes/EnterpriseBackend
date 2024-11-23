import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db'; // Assuming your DB connection setup
import authRoutes from './routes/authRoutes'; // Authentication routes
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize'; // Assuming you're using express-mongo-sanitize
import passport from 'passport'; // If using Passport.js for authentication
import sanitizeInputs from './middlewares/sanitizeInputs'; // Custom input sanitization middleware
import logRequest from './middlewares/logRequest'; // Custom request logging middleware

dotenv.config();

const app: Application = express();

// Log incoming request headers
app.use((req: Request, res: Response, next: NextFunction) => {
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
app.use(cors(corsOptions)); // Enable CORS globally with the specified options
app.use(cookieParser(process.env.COOKIE_SECRET || 'defaultSecret')); // Use a secret for cookie parsing
app.use(helmet()); // Security middleware that sets HTTP headers to secure your app
app.use(sanitizeInputs); // Custom input sanitization (ensure you're using this middleware)
app.use(mongoSanitize()); // Prevent NoSQL injection attacks by sanitizing user inputs
app.use(logRequest); // Custom logging middleware for requests
app.use(passport.initialize()); // Initialize Passport for authentication

// Setup compression with a custom filter for the "x-no-compression" header
const shouldCompress = (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
        // Don't compress responses if the header is present
        return false;
    }
    return compression.filter(req, res); // Default compression filter
};

app.use(compression({ filter: shouldCompress })); // Enable response compression

// Middleware for parsing incoming JSON requests
app.use(express.json()); // Parse incoming JSON requests

// Preflight request handling (CORS OPTIONS requests)
app.options('*', (req: Request, res: Response) => {
  console.log('Preflight request received for:', req.url);
  res.status(200).send(); // Send a successful response to preflight request
});

// Example route to test CORS and basic response
app.get('/api/test', (req: Request, res: Response) => {
  res.send('CORS is working');
});

// Authentication routes (e.g., registration, login)
app.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB(); // Ensure your connectDB function is properly set up

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
