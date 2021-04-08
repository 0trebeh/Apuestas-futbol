import winston from 'winston';

export default class Logger {
  public logger: winston.Logger;
  private levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };
  private colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  };
  private format = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({all: true}),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  );
  private transports = [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({filename: 'logs/all.log'}),
  ];

  constructor() {
    winston.addColors(this.colors);
    this.logger = winston.createLogger({
      level: this.level(),
      transports: this.transports,
      format: this.format,
      levels: this.levels,
    });
  }

  private level() {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
  }
}
