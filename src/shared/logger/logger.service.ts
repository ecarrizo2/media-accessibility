import { Logger } from '@shared/logger/logger.interface'

type Log = {
  level: string
  message: string
  traceId?: string
  awsRequestId?: string
  data?: unknown
}

/**
 * LoggerService class implements the Logger interface and provides methods for logging messages
 * at different levels (debug, info, warn, error). It also supports setting and getting trace IDs
 * and AWS request IDs for better traceability.
 */
export class LoggerService implements Logger {
  private readonly logLevel: string
  private traceId: string = ''
  private awsRequestId: string = ''

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info'
  }

  /**
   * Sets the trace ID for the logger.
   *
   * @param {string} traceId - The trace ID to set.
   */
  setTraceId(traceId: string) {
    this.traceId = traceId
  }

  /**
   * Gets the current trace ID.
   *
   * @returns {string} The current trace ID.
   */
  getTraceId(): string {
    return this.traceId
  }

  /**
   * Sets the AWS request ID for the logger.
   *
   * @param {string} awsRequestId - The AWS request ID to set.
   */
  setAwsRequestId(awsRequestId: string) {
    this.awsRequestId = awsRequestId
  }

  /**
   * Logs a message at the 'info' level.
   *
   * @param {...unknown[]} args - The arguments to include in the log message.
   */
  log(...args: unknown[]): void {
    this.logMessage('info', console.log, ...args)
  }

  /**
   * Logs a message at the 'info' level.
   *
   * @param {...unknown[]} args - The arguments to include in the log message.
   */
  info(...args: unknown[]): void {
    this.logMessage('info', console.info, ...args)
  }

  /**
   * Logs a message at the 'error' level.
   *
   * @param {...unknown[]} args - The arguments to include in the log message.
   */
  warn(...args: unknown[]): void {
    this.logMessage('warn', console.warn, ...args)
  }

  /**
   * Logs a message at the 'error' level.
   *
   * @param {...unknown[]} args - The arguments to include in the log message.
   */
  error(...args: unknown[]): void {
    this.logMessage('error', console.error, ...args)
  }

  /**
   * Logs a message at the 'debug' level.
   *
   * @param {...unknown[]} args - The arguments to include in the log message.
   */
  debug(...args: unknown[]): void {
    this.logMessage('debug', console.debug, ...args)
  }

  private logMessage(level: string, consoleMethod: (...args: unknown[]) => void, ...args: unknown[]): void {
    if (this.shouldLog(level)) {
      consoleMethod(this.formatMessage(level, ...args))
    }
  }

  /**
   * Determines if a message should be logged based on the current log level.
   *
   * @param {string} level - The log level of the message.
   * @returns {boolean} True if the message should be logged, false otherwise.
   */
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.logLevel)
  }

  /**
   * Formats a log message with the given level and arguments.
   *
   * @param {string} level - The log level of the message.
   * @param {...unknown[]} args - The arguments to include in the log message.
   * @returns {string} The formatted log message as a JSON string.
   */
  private formatMessage(level: string, ...args: unknown[]): string {
    const { message, data } = this.extractMessageAndData(args)
    const formattedData = this.formatErrorData(data)
    const logObject = this.constructLogObject(level, message, formattedData)

    return JSON.stringify(logObject, null, 2)
  }

  /**
   * Extracts the message and data from the provided arguments.
   *
   * @param {unknown[]} args - The arguments to extract the message and data from.
   * @returns {{ message: string, data: unknown }} An object containing the extracted message and data.
   */
  private extractMessageAndData(args: unknown[]): { message: string, data: unknown } {
    let message = ''
    let data = null

    if (args.length > 0) {
      if (typeof args[0] === 'string') {
        message = args[0]
        data = args.length > 1 ? args[1] : null
      } else {
        data = args[0]
      }
    }

    return { message, data }
  }

  /**
   * Formats error data if the provided data is an instance of Error.
   *
   * @param {unknown} data - The data to format.
   * @returns {any} The formatted error data or the original data.
   */
  private formatErrorData(data: unknown): unknown {
    const dataIsError = data && data instanceof Error
    if (dataIsError) {
      return {
        message: data.message,
        stack: data.stack,
      }
    }

    return data
  }

  /**
   * Constructs a log object with the given level, message, and data.
   *
   * @param {string} level - The log level of the message.
   * @param {string} message - The log message.
   * @param {unknown} data - The log data.
   * @returns {Log} The constructed log object.
   */
  private constructLogObject(level: string, message: string, data: unknown): Log {
    const logObject: Log = {
      level: level.toUpperCase(),
      message: message,
    }

    if (this.awsRequestId) {
      logObject.awsRequestId = this.awsRequestId
    }

    if (this.traceId) {
      logObject.traceId = this.traceId
    }

    if (data) {
      logObject.data = data
    }

    return logObject
  }
}
