import { container } from 'tsyringe'
import { getEventHeaderByKey } from '@interfaces/shared/aws-http-api-gateway-event.helper'
import { LoggerService } from '@shared/logger/logger.service'
import { v4 } from 'uuid'

/**
 * Initializes the Dependency Injection container for an AWS Lambda API Gateway event.
 * Registers the LoggerService as a singleton and sets the trace ID and AWS request ID.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event object.
 */
export const initializeRequestContainer = (event: AWSLambda.APIGatewayEvent) => {
  container.registerSingleton<LoggerService>(LoggerService)
  const logger = container.resolve(LoggerService)
  const awsEventRequestId = event.requestContext.requestId
  const traceId = getEventHeaderByKey(event, 'X-Internal-Trace-Id') ?? v4()

  logger.setTraceId(traceId)
  logger.setAwsRequestId(awsEventRequestId)
  logger.info('Container initialized')
}

/**
 * Initializes the Dependency Injection container for an AWS Lambda SQS record Handlers.
 * Registers the LoggerService as a singleton and sets the trace ID and AWS request ID.
 *
 * @param {AWSLambda.SQSRecord} record - The SQS record object.
 */
export const initializeQueueContainer = (record: AWSLambda.SQSRecord) => {
  container.registerSingleton<LoggerService>(LoggerService)
  const logger = container.resolve(LoggerService)

  const body = JSON.parse(record.body) as { traceId?: string }
  const traceId = body.traceId ?? v4()
  logger.setTraceId(traceId)
  logger.setAwsRequestId(record.messageId)
  logger.info('Container initialized')
}
