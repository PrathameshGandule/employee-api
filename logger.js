import winston from "winston";

const { combine, timestamp, errors, json, prettyPrint } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' })
    ]
});

export { logger };
