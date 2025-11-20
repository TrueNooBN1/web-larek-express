import { logsDir } from "../config";

const winston = require('winston');
const expressWinston = require('express-winston');

const path = require('path');

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDir,'request.log')}),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDir,'error.log')}),
  ],
  format: winston.format.json(),
}); 