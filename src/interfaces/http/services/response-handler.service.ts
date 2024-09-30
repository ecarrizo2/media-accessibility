import { APIGatewayProxyResult } from 'aws-lambda'
import { RequestHandler } from '@interfaces/http/types/request-handler.interface'
import { Logger } from '@shared/logger/logger.interface'
import { LoggerService } from '@shared/logger/logger.service'
import { inject, injectable } from 'tsyringe'
import { BadRequestError } from '@interfaces/http/errors/bad-request.error'
import { BadRequestResponse, InternalServerErrorResponse, Response } from '@interfaces/http/types/response.interface'
import { HttpStatusCode } from '@interfaces/http/types/http-status-code.enum'

@injectable()
export class ResponseHandlerService implements RequestHandler {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  async handle(resolvingPromise: Promise<unknown>) {
    try {
      const promiseResult = await resolvingPromise
      return this.successResponse(promiseResult)
    } catch (error) {
      if (error instanceof BadRequestError) {
        this.logger.warn('Bad request error', error)
        return this.badRequestResponse(error)
      }

      this.logger.error('Internal Error', error)
      return this.internalServerError()
    }
  }

  private successResponse = (body: unknown) => {
    return this.toAPIGatewayProxyResult({
      status: HttpStatusCode.OK,
      body: body,
    })
  }

  private badRequestResponse = (error: BadRequestError) => {
    const errors = error.validationErrors?.map((err) => ({
      field: err.property,
      message: Object.values(err.constraints || {}).join(', '),
    }))

    const response: BadRequestResponse = {
      status: HttpStatusCode.BAD_REQUEST,
      body: {
        message: error.message,
        errors,
      },
    }

    return this.toAPIGatewayProxyResult(response)
  }

  private internalServerError = () => {
    const response: InternalServerErrorResponse = {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      body: {
        message: 'Internal Server Error.',
      },
    }

    return this.toAPIGatewayProxyResult(response)
  }

  private toAPIGatewayProxyResult(response: Response): APIGatewayProxyResult {
    return {
      statusCode: response.status,
      body: JSON.stringify(response.body),
    }
  }
}
