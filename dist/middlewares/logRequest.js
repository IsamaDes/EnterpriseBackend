"use strict";
// src/middleware/logRequest.ts
Object.defineProperty(exports, "__esModule", { value: true });
// Middleware to log incoming requests
const logRequest = (req, res, next) => {
    const { method, url } = req;
    const time = new Date().toISOString();
    console.log(`[${time}] ${method} request to ${url}`);
    next(); // Pass control to the next middleware or route handler
};
exports.default = logRequest;
