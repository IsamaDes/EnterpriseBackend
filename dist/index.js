"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:5174', 'https://enterprisepro-frontend.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// Middleware
app.use((0, cors_1.default)()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express_1.default.json()); // Parse incoming JSON requests
// Connect to MongoDB
(0, db_1.default)();
// Routes
app.options('*', (0, cors_1.default)(corsOptions));
app.get('/api/test', (req, res) => {
    res.send('CORS is working');
});
app.use("/api/auth", authRoutes_1.default);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
