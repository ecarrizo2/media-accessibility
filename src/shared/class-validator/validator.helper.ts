import { validateOrReject, ValidationError } from 'class-validator'
import { container } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { ClassValidatorError } from '@shared/errors/class-validator.error'

export const myValidateOrReject = async (instance: object) => {
  const logger = container.resolve(LoggerService)

  try {
    await validateOrReject(instance)
  } catch (error: unknown) {
    const isArray = Array.isArray(error)
    const isValidationError = isArray && error.length > 0 && error[0] instanceof ValidationError

    if (!isValidationError) {
      logger.error('Unknown Error during Class Validation', error)
      throw error
    }

    logger.error('Validation error', error)
    throw new ClassValidatorError('Validation failed', error)
  }
}
