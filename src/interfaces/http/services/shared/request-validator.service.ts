import { z, ZodTypeAny } from 'zod'
import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger.service'

@injectable()
export class RequestValidatorService {
  constructor(@inject(LoggerService) private readonly logger: LoggerService) {}

  private sendBadRequestResponse(error: unknown) {
    const isZodError = error instanceof z.ZodError
    const isError = error instanceof Error
    const errorMessage = isZodError ? error.errors : isError ? error.message : 'Unknown Error'

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errorMessage,
      }),
    }
  }

  validate<Schema extends ZodTypeAny>(data: z.infer<Schema> | null, schema: Schema): z.infer<Schema> {
    try {
      this.logger.info('Validating request input')
      this.logger.debug('Validating request input', { data, schema })
      return schema.parse(data)
    } catch (error) {
      this.logger.debug('Request Input validation failed', error)
      throw this.sendBadRequestResponse(error)
    }
  }
}
