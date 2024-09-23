/**
 * Interface representing a Logger.
 */
export interface Logger {
  /**
   * Sets the trace ID for the logger.
   *
   * @param traceId - The trace ID to set.
   */
  setTraceId(traceId: string): void;

  /**
   * Gets the current trace ID from the logger.
   *
   * @returns The current trace ID.
   */
  getTraceId(): string;

  /**
   * Sets the AWS request ID for the logger.
   *
   * @param awsRequestId - The AWS request ID to set.
   */
  setAwsRequestId(awsRequestId: string): void;

  /**
   * Logs a message with the given arguments.
   *
   * @param args - The arguments to log.
   */
  log(...args: unknown[]): void;

  /**
   * Logs an informational message with the given arguments.
   *
   * @param args - The arguments to log.
   */
  info(...args: unknown[]): void;

  /**
   * Logs a warning message with the given arguments.
   *
   * @param args - The arguments to log.
   */
  warn(...args: unknown[]): void;

  /**
   * Logs an error message with the given arguments.
   *
   * @param args - The arguments to log.
   */
  error(...args: unknown[]): void;

  /**
   * Logs a debug message with the given arguments.
   *
   * @param args - The arguments to log.
   */
  debug(...args: unknown[]): void;
}
