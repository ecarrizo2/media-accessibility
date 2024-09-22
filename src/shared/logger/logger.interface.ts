export interface Logger {
  setTraceId(traceId: string): void;
  getTraceId(): string;
  setAwsRequestId(awsRequestId: string): void;
  log(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  debug(...args: any[]): void;
}
