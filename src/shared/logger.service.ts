type Log = {
  level: string
  message: string
  traceId?: string
  awsRequestId?: string
  data?: any
}

export class LoggerService {
  private logLevel: string
  private traceId: string = ''
  private awsRequestId: string = ''

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info'
  }

  setTraceId(traceId: string) {
    this.traceId = traceId
  }

  getTraceId() {
    return this.traceId
  }

  setAwsRequestId(awsRequestId: string) {
    this.awsRequestId = awsRequestId
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.logLevel)
  }

  private formatMessage(level: string, ...args: any[]): string {
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

    // Handle errors more gracefully
    if (data && data instanceof Error) {
      data = {
        message: data.message,
        stack: data.stack,
      }
    }

    const toLog: Log = {
      level: level.toUpperCase(),
      message: message,
    }

    if (this.awsRequestId) {
      toLog.awsRequestId = this.awsRequestId
    }

    if (this.traceId) {
      toLog.traceId = this.traceId
    }

    if (data) {
      toLog.data = data
    }

    return JSON.stringify(toLog, null, 2)
  }

  private logMessage(level: string, consoleMethod: (...args: any[]) => void, ...args: any[]): void {
    if (this.shouldLog(level)) {
      consoleMethod(this.formatMessage(level, ...args))
    }
  }

  log(...args: any[]): void {
    this.logMessage('info', console.log, ...args)
  }

  info(...args: any[]): void {
    this.logMessage('info', console.info, ...args)
  }

  warn(...args: any[]): void {
    this.logMessage('warn', console.warn, ...args)
  }

  error(...args: any[]): void {
    this.logMessage('error', console.error, ...args)
  }

  debug(...args: any[]): void {
    this.logMessage('debug', console.debug, ...args)
  }
}
