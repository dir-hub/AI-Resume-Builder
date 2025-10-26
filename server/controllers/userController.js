import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
}
//controller for user registration
//POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        //create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        //return success response
        const token = generateToken(newUser._id);
        // remove password before sending
        const userResponse = newUser.toObject ? newUser.toObject() : { ...newUser };
        if (userResponse.password) delete userResponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
            token,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for user login
//POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        //find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //return success response
        const token = generateToken(user._id);
        const userResponse = user.toObject ? user.toObject() : { ...user };
        if (userResponse.password) delete userResponse.password;

        return res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for getting user by id
//GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //return user
        user.password = undefined;
        return res.status(200).json({ user });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for getting user resumes
//GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        //return user resumes
        const resumes = await Resume.find({ userId });
        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message });

    }
}