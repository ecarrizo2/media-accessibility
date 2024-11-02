import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { BadRequestError } from '@interfaces/http/errors/bad-request.error'

/**
 * RequestParserService class provides methods to parse and validate request data
 */
@injectable()
export class RequestParserService<ValueObjectClass, ObjectType> {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  async parse(data: ObjectType, valueObjectClass: ClassConstructor<ValueObjectClass>): Promise<ValueObjectClass> {
    const valueObject = this.convertToValueObject(valueObjectClass, data)
    await this.validate(valueObject)

    return valueObject
  }

  private async validate(valueObjectInstance: ValueObjectClass): Promise<void> {
    try {
      this.logger.debug('Validating request input', valueObjectInstance)
      await validateOrReject(valueObjectInstance as object)
    } catch (error) {
      this.logger.error('Request Input DTO Validation failed', error)
      this.throwBadRequestResponse(error)
    }
  }

  private convertToValueObject(
    valueObjectClass: ClassConstructor<ValueObjectClass>,
    data: ObjectType
  ): ValueObjectClass {
    this.logger.debug('Converting input into Value Object', data)
    return plainToInstance(valueObjectClass, data, { excludeExtraneousValues: true })
  }

  private throwBadRequestResponse(error: unknown) {
    const isArray = Array.isArray(error)
    const isValidationError = isArray && error.length > 0 && error[0] instanceof ValidationError

    if (!isValidationError) {
      throw error
    }

    throw new BadRequestError('Invalid request input', error as ValidationError[])
  }
}
