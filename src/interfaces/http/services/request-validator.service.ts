import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { BadRequestError } from '@interfaces/http/errors/bad-request.error'

/**
 * RequestParserService class provides methods to parse and validate request data
 * using Zod schemas and convert the validated data into value objects.
 *
 * @template ValueObjectType - The type of the value object to be returned.
 */
@injectable()
export class RequestParserService<ValueObjectClass, ObjectType> {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  /**
   * Parses and validates the provided data using the given schema and converts it into a value object.
   *
   * @param {unknown} data - The Raw input provided by clients.
   * @param {ClassConstructor<unknown>} valueObjectClass - The value object class with a static from method for conversion.
   * @returns {any} The converted value object.
   */
  async parse(data: ObjectType, valueObjectClass: ClassConstructor<ValueObjectClass>): Promise<ValueObjectClass> {
    const valueObject = this.convertToValueObject(valueObjectClass, data)
    await this.validate(valueObject)

    return valueObject
  }

  /**
   * Validates the provided data using the given schema.
   *
   * @throws Will throw an error if validation fails.
   * @returns {Promise<void>} A promise that resolves if validation succeeds.
   * @param valueObjectInstance
   */
  private async validate(valueObjectInstance: ValueObjectClass): Promise<void> {
    try {
      this.logger.debug('Validating request input', valueObjectInstance)
      await validateOrReject(valueObjectInstance as object)
    } catch (error) {
      this.logger.error('Request Input DTO Validation failed', error)
      this.throwBadRequestResponse(error)
    }
  }

  /**
   * Converts the validated input into a value object using the provided value object class.
   *
   * @param {ClassConstructor<unknown>} valueObjectClass - The value object class with a static from method for conversion.
   * @param {object} data - The input to be used to be converted into a value object
   * @returns {ValueObjectType} The converted value object.
   */
  private convertToValueObject(
    valueObjectClass: ClassConstructor<ValueObjectClass>,
    data: ObjectType
  ): ValueObjectClass {
    this.logger.debug('Converting input into Value Object', data)
    return plainToInstance(valueObjectClass, data)
  }

  /**
   * Sends a bad request response with the appropriate error message.
   *
   * @param {unknown} error - The error to handle.
   */
  private throwBadRequestResponse(error: unknown) {
    const isArray = Array.isArray(error)
    const isValidationError = isArray && error.length > 0 && error[0] instanceof ValidationError

    if (!isValidationError) {
      throw error
    }

    throw new BadRequestError('Invalid request input', error as ValidationError[])
  }
}
