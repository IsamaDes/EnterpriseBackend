import jwt from 'jsonwebtoken';

// Function to generate JWT token
export const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return token;
};

// Function to verify JWT token (optional, useful for authentication middleware)
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
