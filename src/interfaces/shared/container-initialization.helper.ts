import { container } from 'tsyringe'
import { getEventHeaderByKey } from '@interfaces/shared/aws-http-api-gateway-event.helper'
import { LoggerService } from '@shared/logger/logger.service'
import { v4 } from 'uuid'

export const initializeRequestContainer = (event: AWSLambda.APIGatewayEvent) => {
  container.registerSingleton<LoggerService>(LoggerService)
  const logger = container.resolve(LoggerService)
  const awsEventRequestId = event.requestContext.requestId
  const traceId = getEventHeaderByKey(event, 'X-Internal-Trace-Id') ?? v4()

  logger.setTraceId(traceId)
  logger.setAwsRequestId(awsEventRequestId)
  logger.info('Container initialized')
}

export const initializeQueueContainer = (record: AWSLambda.SQSRecord) => {
  container.registerSingleton<LoggerService>(LoggerService)
  const logger = container.resolve(LoggerService)

  //@ts-ignore
  const body = JSON.parse(record.body)
  const traceId = body.traceId ?? v4()
  logger.setTraceId(traceId)
  logger.setAwsRequestId(record.messageId)
  logger.info('Container initialized')
}
