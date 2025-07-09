import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ required for socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // ✅ frontend URL
    methods: ['GET', 'POST']
  }
});

// ✅ Store io globally in app instance
app.set('io', io);

// ✅ Socket connection event
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// ✅ Debug log
console.log('Connecting to:', process.env.MONGO_URI);

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'Book_Manage',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB Connected');

    // ✅ Correct server start
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
