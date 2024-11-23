// src/middleware/sanitizeInputs.ts

import { Request, Response, NextFunction } from 'express';
import xss from 'xss'; // Example: Use xss to sanitize input

// Middleware to sanitize input data
const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize all fields in the body of the request
  if (req.body) {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = xss(req.body[key]); // Sanitize input value using xss package
      }
    }
  }
  next(); // Pass control to the next middleware
};

export default sanitizeInputs;
