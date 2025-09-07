import { Logger as WinstonLogger, createLogger, format, transports } from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';

export const logger: WinstonLogger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'ecom-backend' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${context}] ${level}: ${message}`;
        }),
      ),
    }),
  ],
});

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: string, context?: string) {
    logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }

  debug?(message: string, context?: string) {
    logger.debug(message, { context });
  }

  verbose?(message: string, context?: string) {
    logger.verbose(message, { context });
  }
}
