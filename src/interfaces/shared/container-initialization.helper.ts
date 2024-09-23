import { container } from 'tsyringe'
import { LoggerService } from '@utils/logger.service'
import { getEventHeaderByKey } from '@application/shared/aws-event.helper'

export const initializeContainer = (event: AWSLambda.APIGatewayEvent) => {
  const awsEventRequestId = event.requestContext.requestId
  const traceId = getEventHeaderByKey(event, 'X-Internal-Trace-Id') ?? 'internal-trace-is-undefined'

  container.registerSingleton<LoggerService>('LoggerService', LoggerService)

  const logger = container.resolve(LoggerService)
  logger.setTraceId(traceId)
  logger.setAwsRequestId(awsEventRequestId)
}
