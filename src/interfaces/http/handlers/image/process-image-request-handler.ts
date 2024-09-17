import 'reflect-metadata'
import { container } from 'tsyringe'
import { z } from 'zod'
import { LoggerService } from '@shared//logger.service'
import { initializeRequestContainer } from '@interfaces/shared/container-initialization.helper'
import { getRequestInput } from '@interfaces/shared/aws-http-api-gateway-event.helper'
import { ProcessImageRequestInput } from '@domain/value-objects/image/process-image-request-input.vo'
import { RequestErrorHandlerWrapperService } from '@interfaces/services/request-error-handler-wrapper-service'
import { ProcessImageRequestHandlerService } from '@interfaces/http/services/process-image-request-handler.service'

const ProcessImageInputSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
  createSpeech: z.boolean().optional(),
})

/**
 * Retrieves the validated request input value object from the API Gateway event.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 */
const getValidatedRequestInputValueObject = (event: AWSLambda.APIGatewayEvent ) => {
  return getRequestInput<ProcessImageRequestInput>(
    event,
    ProcessImageInputSchema,
    ProcessImageRequestInput
  )
}

/**
 * The main handler function for processing image requests.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 * @returns {Promise<AWSLambda.APIGatewayProxyResult>} - The API Gateway proxy result.
 */
export async function handle(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  initializeRequestContainer(event)
  const logger = container.resolve(LoggerService)
  const requestErrorHandlerWrapperService = container.resolve(RequestErrorHandlerWrapperService)
  const processImageRequestService = container.resolve(ProcessImageRequestHandlerService)

  logger.info('Process Image Request Handler started')
  const input = getValidatedRequestInputValueObject(event)
  const job = await requestErrorHandlerWrapperService.wrap(
    processImageRequestService.scheduleImageProcessingJob(input),
  )

  logger.info('Process Image Request Handler ended successfully.')

  return {
    statusCode: 200,
    body: JSON.stringify(job),
  }
}
