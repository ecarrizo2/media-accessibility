import { container } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { RequestParserService } from '@interfaces/http/services/shared/request-validator.service'
import { ZodTypeAny } from 'zod'

/**
 * Parses the body of an API Gateway event.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 * @returns {object} The parsed body of the event.
 */
export const getEventBody = (event: AWSLambda.APIGatewayEvent) => {
  return JSON.parse(event.body || '{}')
}

/**
 * Retrieves the headers from an API Gateway event.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 * @returns {object} The headers of the event.
 */
export const getEventHeaders = (event: AWSLambda.APIGatewayEvent) => {
  return event.headers || {}
}

/**
 * Retrieves a specific header by key from an API Gateway event.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 * @param {string} key - The key of the header to retrieve.
 * @returns {string | undefined} The value of the header, or undefined if not found.
 */
export const getEventHeaderByKey = (event: AWSLambda.APIGatewayEvent, key: string) => {
  const headers = getEventHeaders(event)
  return headers[key] ?? undefined
}

/**
 * Extracts and validates the request input from the API Gateway event.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 * @param {ZodTypeAny} schema - The schema to validate the request input against.
 * @param valueObjectClass - The class of the value object to initialize with the validated input.
 * @returns {ProcessImageRequestInput} The validated request input.
 */
export const getRequestInput = <ValueObjectType>(
  event: AWSLambda.APIGatewayEvent,
  schema: ZodTypeAny,
  valueObjectClass: { from: (input: any) => ValueObjectType }
): ValueObjectType => {
  const logger = container.resolve(LoggerService)
  const requestParser = container.resolve(RequestParserService<ValueObjectType>)
  const inputValueObject = requestParser.parse(getEventBody(event), schema, valueObjectClass)

  logger.debug('Input has been validated, value object initialized', inputValueObject)

  return inputValueObject
}
