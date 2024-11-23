import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../entities/User';
import { generateToken } from '../utils/jwtUtils';  // Import the generateToken function

// Register user (example)
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    // Generate JWT token after user is created
    const token = generateToken(newUser._id.toString());

    return res.status(201).json({
      message: 'User registered successfully',
      token, // Send the token back to the client
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user', error });
  }
};
