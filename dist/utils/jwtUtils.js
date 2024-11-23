"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to generate JWT token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined');
    }
    // userId is now explicitly a string
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
exports.generateToken = generateToken;
// Function to verify JWT token
const verifyToken = (token) => {
    try {
        // Verify the token and decode it
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Cast the decoded payload to the expected type
        return decoded;
    }
    catch (error) {
        // More descriptive error handling
        throw new Error('Invalid or expired token');
    }
};
exports.verifyToken = verifyToken;
