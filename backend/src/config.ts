import dotenv from 'dotenv';
dotenv.config();

export const {PORT, DB_ADDRESS} = process.env;

const path = require('path');
const fs = require('fs');

export const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}


