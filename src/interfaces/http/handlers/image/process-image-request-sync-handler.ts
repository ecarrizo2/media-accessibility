import 'reflect-metadata'
import { container } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { getValidatedRequestInputValueObject } from '@interfaces/http/aws-http-api-gateway-event.helper'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'
import { ImageProcessorService } from '@application/services/image/image-processor.service'
import { initializeRequestContainer } from '@interfaces/shared/container-initialization.helper'
import { ResponseHandlerService } from '@interfaces/http/services/response-handler.service'
import { instanceToPlain } from 'class-transformer'

/**
 * The main handler function for processing image requests.
 *
 * @param {AWSLambda.APIGatewayEvent} event - The API Gateway event.
 * @returns {Promise<AWSLambda.APIGatewayProxyResult>} - The API Gateway proxy result.
 */
const handleProcessImageRequest = async (event: AWSLambda.APIGatewayEvent) => {
  const logger = container.resolve(LoggerService)
  const processImageRequestService = container.resolve(ImageProcessorService)

  logger.info('Process Image Request SYNC Handler started')
  const input = await getValidatedRequestInputValueObject(event, ProcessImageRequestInputDto)
  const image = await processImageRequestService.processImage(input)

  return instanceToPlain(image)
}

export async function handle(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  initializeRequestContainer(event)
  const responseHandler = container.resolve(ResponseHandlerService)
  return await responseHandler.handle(handleProcessImageRequest(event))
}
