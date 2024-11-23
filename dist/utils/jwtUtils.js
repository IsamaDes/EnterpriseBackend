"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to generate JWT token
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
exports.generateToken = generateToken;
// Function to verify JWT token (optional, useful for authentication middleware)
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
