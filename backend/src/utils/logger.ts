import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'youtube-summarization-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...rest }) => {
          return `${timestamp} ${level}: ${message} ${Object.keys(rest).length ? JSON.stringify(rest, null, 2) : ''}`;
        })
      ),
    }),
  ],
});

// If not in production, add a file transport for errors
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  );
}

export { logger };
