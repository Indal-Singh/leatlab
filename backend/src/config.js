import dotenv from 'dotenv';
dotenv.config();
const config =  {
    port: process.env.PORT || 3000,
    apiroute: '/api/v1',
    jwt_secret: process.env.JWT_SECRET,
    jwt_exipry: process.env.JWT_EXPIRATION
};

export default config;