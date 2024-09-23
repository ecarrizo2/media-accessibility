import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger.service'

@injectable()
export class RequestErrorHandlerWrapperService {
  constructor(@inject(LoggerService) private readonly logger: LoggerService) {}

  async execute<ReturnType, Args extends any[]>(
    action: (...args: Args) => Promise<ReturnType> | ReturnType,
    ...args: Args
  ): Promise<ReturnType> {
    try {
      this.logger.debug(`About to execute callback, ${action.name}`)
      return await action(...args)
    } catch (error) {
      this.logger.error('Error while execution callback')
      this.logger.debug(error)
      throw {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      }
    }
  }

  async wrap<ReturnType>(
    action: Promise<ReturnType> | ReturnType,
  ): Promise<ReturnType> {
    try {
      return await action
    } catch (error) {
      this.logger.error('Error while execution callback')
      this.logger.debug(error)
      throw {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      }
    }
  }
}
