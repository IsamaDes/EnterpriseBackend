import express, { Application, Request, Response, NextFunction } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();

// Log incoming request headers
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Incoming request headers:', req.headers);
    next(); // Pass control to the next middleware or route handler
  });

// CORS configuration
const corsOptions = {
  origin: ['https://enterpriseapp.onrender.com','http://localhost:5174'], // Adjust according to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // For legacy browsers
};

// Enable CORS globally with the specified options
app.use(cors(corsOptions));

// Log preflight requests (OPTIONS requests)
app.options('*', (req: Request, res: Response) => {
  console.log('Preflight request received for:', req.url);
  res.status(200).send(); // Send a successful response to preflight request
});

// Middleware for parsing incoming JSON requests
app.use(express.json()); // Parse incoming JSON requests

// Example route to test CORS
app.get('/api/test', (req: Request, res: Response) => {
  res.send('CORS is working');
});

// Auth routes (e.g., registration, login)
app.use("/api/auth", authRoutes);

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
