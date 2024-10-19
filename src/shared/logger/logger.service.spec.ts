import { LoggerService } from './logger.service'

describe('LoggerService', () => {
  const getInstance = () => {
    return new LoggerService()
  }

  afterEach(jest.resetAllMocks)
  type ConsoleString = 'debug' | 'info' | 'warn' | 'error'

  describe('Logs to the console when the level is valid', () => {
    const dataProvider = [
      {
        level: 'debug',
        environmentLevel: 'debug',
        data: { key: 'value' },
      },
      {
        level: 'info',
        environmentLevel: 'info',
        data: { key: 'value' },
      },
      {
        level: 'log',
        environmentLevel: 'log',
        data: { key: 'value' },
      },
      {
        level: 'warn',
        environmentLevel: 'warn',
        data: { key: 'value' },
      },
      {
        level: 'error',
        environmentLevel: 'error',
        data: { key: 'value' },
      },
    ]
    it.each(dataProvider)('Logs to the console when the level is valid', (data) => {
      process.env.LOG_LEVEL = data.environmentLevel
      const consoleSpy = jest.spyOn(console, data.level as ConsoleString).mockImplementation()
      getInstance()[data.level as ConsoleString]('Message')
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Message'))
    })
  })

  describe('Does not log to the console when the level is invalid', () => {
    const dataProvider = [
      {
        level: 'debug',
        environmentLevel: 'error',
        data: { key: 'value' },
      },
      {
        level: 'info',
        environmentLevel: 'error',
        data: { key: 'value' },
      },
      {
        level: 'warn',
        environmentLevel: 'error',
        data: { key: 'value' },
      },
    ]
    it.each(dataProvider)('Logs to the console when the level is valid', (data) => {
      process.env.LOG_LEVEL = data.environmentLevel
      const consoleSpy = jest.spyOn(console, data.level as ConsoleString).mockImplementation()
      getInstance()[data.level as ConsoleString]('Message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  it('logs info messages using log alias', () => {
    process.env.LOG_LEVEL = 'info'
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    getInstance().log({ key: 'value' })
    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify(
        {
          level: 'INFO',
          message: '',
          data: { key: 'value' },
        },
        null,
        2
      )
    )
    consoleSpy.mockRestore()
  })
  //
  // it('logs error messages', () => {
  //   const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
  //   getInstance().error('Error message')
  //   expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'))
  //   consoleSpy.mockRestore()
  // })
  //
  // it('logs debug messages when log level is debug', () => {
  //   process.env.LOG_LEVEL = 'debug'
  //   const consoleSpy = jest.spyOn(console, 'debug').mockImplementation()
  //   getInstance().debug('Debug message')
  //   expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Debug message'))
  //   consoleSpy.mockRestore()
  // })
  //
  // it('does not log debug messages when log level is info', () => {
  //   process.env.LOG_LEVEL = 'info'
  //   const consoleSpy = jest.spyOn(console, 'debug').mockImplementation()
  //   getInstance().debug('Debug message')
  //   expect(consoleSpy).not.toHaveBeenCalled()
  //   consoleSpy.mockRestore()
  // })

  it('sets and gets trace ID', () => {
    const loggerService = getInstance()
    loggerService.setTraceId('trace-id-123')
    expect(loggerService.getTraceId()).toBe('trace-id-123')
  })

  it('sets and gets AWS request ID', () => {
    const loggerService = getInstance()
    loggerService.setAwsRequestId('aws-request-id-123')
    expect(loggerService.getAwsRequestId()).toBe('aws-request-id-123')
  })

  it('formats error data correctly', () => {
    const error = new Error('Test error')
    const formattedData = getInstance()['formatErrorData'](error)
    expect(formattedData).toEqual({
      message: 'Test error',
      stack: error.stack,
    })
  })

  it('constructs log object with trace ID and AWS request ID', () => {
    const loggerService = getInstance()
    loggerService.setTraceId('trace-id-123')
    loggerService.setAwsRequestId('aws-request-id-123')
    const logObject = loggerService['constructLogObject']('info', 'Test message', { key: 'value' })
    expect(logObject).toEqual({
      level: 'INFO',
      message: 'Test message',
      traceId: 'trace-id-123',
      awsRequestId: 'aws-request-id-123',
      data: { key: 'value' },
    })
  })
})
