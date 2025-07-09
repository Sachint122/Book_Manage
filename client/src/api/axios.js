import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // change to your deployed backend later
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;
