import { container } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { RequestParserService } from '@interfaces/http/services/request-validator.service'
import { ClassConstructor } from 'class-transformer'
import { BadRequestError } from '@interfaces/http/errors/bad-request.error'
import { APIGatewayEvent } from 'aws-lambda'

/**
 * Parses the body of an API Gateway event.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @returns {object} The parsed body of the event.
 */
export const getEventBody = (event: APIGatewayEvent) => {
  try {
    return JSON.parse(event.body || '{}') as unknown
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new BadRequestError('Invalid JSON Syntax')
    }

    throw error
  }
}

/**
 * Retrieves the headers from an API Gateway event.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @returns {object} The headers of the event.
 */
export const getEventHeaders = (event: APIGatewayEvent) => {
  return event.headers || {}
}

/**
 * Retrieves a specific header by key from an API Gateway event.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @param {string} key - The key of the header to retrieve.
 * @returns {string | undefined} The value of the header, or undefined if not found.
 */
export const getEventHeaderByKey = (event: APIGatewayEvent, key: string) => {
  const headers = getEventHeaders(event)
  return headers[key] ?? undefined
}

/**
 * Extracts and validates the request input from the API Gateway event.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @param valueObjectClass - The class of the value object to initialize with the validated input.
 * @returns Promise<ValueObjectClass> - A Promise that resolve with a DTO/Value Object for the request input.
 */
export const getValidatedRequestInputValueObject = async <ValueObjectClass, ValueObjectType>(
  event: APIGatewayEvent,
  valueObjectClass: ClassConstructor<ValueObjectClass>
): Promise<ValueObjectClass> => {
  const logger = container.resolve(LoggerService)
  const requestParser = container.resolve(RequestParserService<ValueObjectClass, ValueObjectType>)

  const inputValueObject = await requestParser.parse(getEventBody(event) as ValueObjectType, valueObjectClass)

  logger.debug('Input has been validated, value object initialized', inputValueObject)

  return inputValueObject
}
