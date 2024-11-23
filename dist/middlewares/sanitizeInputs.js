"use strict";
// src/middleware/sanitizeInputs.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xss_1 = __importDefault(require("xss")); // Example: Use xss to sanitize input
// Middleware to sanitize input data
const sanitizeInputs = (req, res, next) => {
    // Sanitize all fields in the body of the request
    if (req.body) {
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                req.body[key] = (0, xss_1.default)(req.body[key]); // Sanitize input value using xss package
            }
        }
    }
    next(); // Pass control to the next middleware
};
exports.default = sanitizeInputs;
