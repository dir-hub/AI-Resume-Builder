import express from 'express';
import { getUserById, getUserResumes, loginUser, registerUser } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';


const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
// allow client to GET current user data (protected)
userRoutes.get('/data', protect, getUserById);
userRoutes.get('/resumes', protect, getUserResumes);

export default userRoutes;