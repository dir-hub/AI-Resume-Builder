import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

//Database connection
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running...');
})
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRouter);
// mount AI routes at /api/ai (ensure leading slash)
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});