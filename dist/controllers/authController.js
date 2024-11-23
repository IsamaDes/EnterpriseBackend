"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../entities/User"));
const jwtUtils_1 = require("../utils/jwtUtils"); // Import the generateToken function
// Register user (example)
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    // Check if user already exists
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create new user
    const newUser = new User_1.default({
        name,
        email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        // Generate JWT token after user is created
        const token = (0, jwtUtils_1.generateToken)(newUser._id.toString());
        return res.status(201).json({
            message: 'User registered successfully',
            token, // Send the token back to the client
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error registering user', error });
    }
};
exports.registerUser = registerUser;
