import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import 'winston-daily-rotate-file'; // Import daily rotate file transport

class LoggerService {
  private loggers: Record<string, winston.Logger>;

  constructor() {
    this.loggers = {}; // Object to cache logger instances
    const logsDirectory = path.join('logs'); // Ensure the path is absolute

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory);
    }
  }

  getLogger(identifier = 'common'): winston.Logger {
    // Return existing logger if it exists
    if (this.loggers[identifier]) {
      return this.loggers[identifier];
    }

    // Otherwise, create a new logger and cache it
    const logger = winston.createLogger({
      level: 'info', // Default log level
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        new (winston.transports).DailyRotateFile({
          filename: path.join('logs', `${identifier}-%DATE%.log`), // Daily file naming
          datePattern: 'YYYY-MM-DD', // Rotate daily
          maxFiles: '3d', // Keep logs for 3 days
          format: winston.format.json(),
        }),
      ],
    });

    this.loggers[identifier] = logger;
    return logger;
  }

  info(message: string, identifier = 'common'): void {
    this.getLogger(identifier).info(message);
  }

  error(message: string, identifier = 'common'): void {
    this.getLogger(identifier).error(message);
  }

  warn(message: string, identifier = 'common'): void {
    this.getLogger(identifier).warn(message);
  }
}

export default new LoggerService();
