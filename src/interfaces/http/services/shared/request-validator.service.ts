import { z, ZodTypeAny } from 'zod'
import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'

/**
 * RequestParserService class provides methods to parse and validate request data
 * using Zod schemas and convert the validated data into value objects.
 *
 * @template ValueObjectType - The type of the value object to be returned.
 */
@injectable()
export class RequestParserService<ValueObjectType> {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  /**
   * Parses and validates the provided data using the given schema and converts it into a value object.
   *
   * @template Schema - The Zod schema type.
   * @param {z.infer<Schema> | null} data - The data to parse and validate.
   * @param {Schema} schema - The Zod schema to use for validation.
   * @param {object} valueObjectClass - The value object class with a static from method for conversion.
   * @returns {any} The converted value object.
   */
  parse<Schema extends ZodTypeAny>(
    data: z.infer<Schema> | null,
    schema: Schema,
    valueObjectClass: { from: (input: unknown) => ValueObjectType }
  ): ValueObjectType {
    const validatedInput = this.validate(data, schema)
    return this.convertToValueObject(valueObjectClass, validatedInput)
  }

  /**
   * Validates the provided data using the given schema.
   *
   * @template Schema - The Zod schema type.
   * @param {z.infer<Schema> | null} data - The data to validate.
   * @param {Schema} schema - The Zod schema to use for validation.
   * @returns {z.infer<Schema>} The validated data.
   * @throws Will throw an error if validation fails.
   */
  private validate<Schema extends ZodTypeAny>(data: z.infer<Schema> | null, schema: Schema): z.infer<Schema> {
    try {
      this.logger.info('Validating request input')
      this.logger.debug('Validating request input', { data, schema })
      return schema.parse(data) as Schema
    } catch (error) {
      this.logger.debug('Request Input validation failed', error)
      throw this.sendBadRequestResponse(error)
    }
  }

  /**
   * Converts the validated input into a value object using the provided value object class.
   *
   * @param {object} valueObjectClass - The value object class with a static from method for conversion.
   * @param {unknown} validatedInput - The validated input to convert.
   * @returns {ValueObjectType} The converted value object.
   * @throws Will throw an error if conversion fails.
   */
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

  /**
   * Sends a bad request response with the appropriate error message.
   *
   * @param {unknown} error - The error to handle.
   * @returns {object} The response object with status code 400 and error message.
   */
  private sendBadRequestResponse(error: unknown): object {
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
}
