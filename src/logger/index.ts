import { createLogger, transports, format } from 'winston';
import config from '../config/index';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

const { combine, timestamp, prettyPrint, printf, label, colorize } = format;

const customFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const consoleTransportOptionsFormat = combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    label({ label: 'Express.Api' }),
    prettyPrint(),
    colorize(),
    customFormat
);

const dailyRotateFileTransportOptionsFormat = combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    label({ label: 'Express.Api' }),
    prettyPrint(),
    customFormat
);

const consoleTransportOptions: ConsoleTransportOptions = {
    level: config.level,
    handleExceptions: true,
    silent: false,
    format: consoleTransportOptionsFormat
};

const dailyRotateFileTransportOptions: DailyRotateFileTransportOptions = {
    json: false,
    filename: '%DATE%.log',
    level: config.level,
    datePattern: 'YYYY-MM-DD',
    dirname: 'logs',
    format: dailyRotateFileTransportOptionsFormat
};

const logger = createLogger({
    transports: [
        new transports.Console(consoleTransportOptions),
        new DailyRotateFile(dailyRotateFileTransportOptions)
    ]
});

export default logger;
