// src/middleware/logRequest.ts

import { Request, Response, NextFunction } from 'express';

// Middleware to log incoming requests
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const time = new Date().toISOString();
  console.log(`[${time}] ${method} request to ${url}`);
  next(); // Pass control to the next middleware or route handler
};

export default logRequest;
