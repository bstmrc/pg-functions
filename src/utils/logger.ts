import { ILogger } from '../interfaces/ILogger';
import pino from 'pino';

export class ConsoleLogger implements ILogger {
  private logger: ILogger
  constructor(customLogger?: ILogger) {
    this.logger = customLogger || pino({
      level: process.env.PG_FUNCTIONS_LOG_LEVEL || 'info'
    });
  }

  private formatMessage(message: string): string {
    return `pg-functions: ${message}`;
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(this.formatMessage(message), ...args);
  }
  warn(message: string, ...args: any[]): void {
    this.logger.warn(this.formatMessage(message), ...args);
  }
  error(message: string, ...args: any[]): void {
    this.logger.error(this.formatMessage(message), ...args);
  }
}
