// socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Only called ONCE

export default socket;
