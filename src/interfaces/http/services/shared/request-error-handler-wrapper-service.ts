import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'

/**
 * RequestErrorHandlerWrapperService class provides methods to execute actions with error handling.
 * It logs the execution process and catches any errors, returning a standardized error response.
 */
@injectable()
export class RequestErrorHandlerWrapperService {
  constructor(@inject(LoggerService) private readonly logger: LoggerService) {}


  /**
   * Wraps the provided action in a try-catch block to handle any errors that occur.
   *
   * @template ReturnType - The return type of the action.
   * @param {Promise<ReturnType> | ReturnType} action - The action to wrap.
   * @returns {Promise<ReturnType>} The result of the action.
   * @throws Will throw an error with status code 500 and a standardized error message if the action fails.
   */
  async wrap<ReturnType>(action: Promise<ReturnType> | ReturnType): Promise<ReturnType> {
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
