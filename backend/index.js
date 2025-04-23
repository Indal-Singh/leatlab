import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
import config from './src/config.js';
const PORT = config.port;
const app = express();

app.use(express.json());
app.use(cookieParser())

// auth Route 
import authRoute from './src/routes/auth.route.js';

app.use(`${config.apiroute}/auth`, authRoute);

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});