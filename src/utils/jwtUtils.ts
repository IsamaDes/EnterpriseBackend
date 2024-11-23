import jwt from 'jsonwebtoken';

// Function to generate JWT token
export const generateToken = (userId: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined');
      }

  // userId is now explicitly a string
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return token;
};

// Function to verify JWT token
export const verifyToken = (token: string) => {
  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }; // Cast the decoded payload to the expected type
    return decoded;
  } catch (error) {
    // More descriptive error handling
    throw new Error('Invalid or expired token');
  }
};
