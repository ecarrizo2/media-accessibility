import { z, ZodTypeAny } from 'zod'
import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger.service'

@injectable()
export class RequestParserService<ValueObjectType> {
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

  public parse<Schema extends ZodTypeAny>(
    data: z.infer<Schema> | null,
    schema: Schema,
    valueObjectClass: { from: (input: unknown) => ValueObjectType }
  ): ValueObjectType {
    const validatedInput = this.validate(data, schema)
    return this.convertToValueObject(valueObjectClass, validatedInput)
  }

  private validate<Schema extends ZodTypeAny>(data: z.infer<Schema> | null, schema: Schema): z.infer<Schema> {
    try {
      this.logger.info('Validating request input')
      this.logger.debug('Validating request input', { data, schema })
      return schema.parse(data)
    } catch (error) {
      this.logger.debug('Request Input validation failed', error)
      throw this.sendBadRequestResponse(error)
    }
  }

  private convertToValueObject(
    valueObjectClass: { from: (input: unknown) => ValueObjectType },
    validatedInput: unknown
  ): ValueObjectType {
    try {
      this.logger.info('Converting input into Value Object')
      return valueObjectClass.from(validatedInput)
    } catch (error) {
      this.logger.debug('Conversion of input to Value Object failed ', error)
      throw this.sendBadRequestResponse(error)
    }
  }
}
