import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import config from './src/config.js';
const PORT = config.port;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth Route 
import authRoute from './src/routes/auth.route.js';

app.use(`${config.apiroute}/auth`, authRoute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});