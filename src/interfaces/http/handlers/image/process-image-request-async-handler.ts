import 'reflect-metadata'
import { container } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { initializeRequestContainer } from '@interfaces/shared/container-initialization.helper'
import { getValidatedRequestInputValueObject } from '@interfaces/http/aws-http-api-gateway-event.helper'
import { ProcessImageJobSchedulerService } from '@application/services/image/process-image-job-scheduler.service'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'
import { RequestHandlerService } from '@interfaces/http/services/request-handler.service'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

/**
 * The main handler function for processing image requests.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 */
const handleProcessImageAsyncRequest = async (event: APIGatewayEvent) => {
  const logger = container.resolve(LoggerService)
  const processImageJobSchedulerService = container.resolve(ProcessImageJobSchedulerService)

  logger.info('Process Image Request ASYNC Handler started')
  const input = await getValidatedRequestInputValueObject(event, ProcessImageRequestInputDto)
  const job = await processImageJobSchedulerService.scheduleImageProcessingJob(input)

  return {
    message: 'Image processing job scheduled',
    jobId: job.id,
  }
}

export async function handle(event: AWSLambda.APIGatewayEvent): Promise<APIGatewayProxyResult> {
  initializeRequestContainer(event)
  const responseHandler = container.resolve(RequestHandlerService)
  return await responseHandler.handle(handleProcessImageAsyncRequest(event))
}
