const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // cấp độ mặc định
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.Console()
  ]
});

module.exports = logger;
