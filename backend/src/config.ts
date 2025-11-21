import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DB_ADDRESS = process.env.DB_ADDRESS || undefined;

export const JWT_ACCES_KEY = process.env.JWT_ACCES_KEY || 'somekey';
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || 'somekey';

export const AUTH_REFRESH_TOKEN_EXPIRY = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';

export const UPLOAD_PATH = process.env.UPLOAD_PATH || 'img';

export const UPLOAD_PATH_TEMP = process.env.UPLOAD_PATH_TEMP || 'tmp';

export const ORIGIN_ALLOW = process.env.ORIGIN_ALLOW || 'localhost::5173';

export const AUTH_ACCESS_TOKEN_EXPIRY = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1s';

const path = require('path');
const fs = require('fs');

export const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
export const publicPath = path.join(__dirname, 'public');
export const uploadPath = path.join(__dirname, 'public', 'temp');
