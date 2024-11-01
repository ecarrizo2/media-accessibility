import 'reflect-metadata'
import { container } from 'tsyringe'
import { initializeRequestContainer } from '@interfaces/shared/container-initialization.helper'
import { RequestHandlerService } from '@interfaces/http/services/request-handler.service'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getValidatedRequestInputValueObject } from '@interfaces/http/aws-http-api-gateway-event.helper'
import { OpenaiTextToSpeechConverterService } from '@infrastructure/services/speech/openai-text-to-speech-converter.service'
import { ConvertTextToSpeechRequestRequestInputDto } from '@domain/value-objects/speech/convert-text-to-speech-input.dto'

/**
 * The main handler function for processing image requests.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @returns {Promise<APIGatewayProxyResult>} - The API Gateway proxy result.
 */
const handleProcessTextToSpeechSyncRequest = async (event: APIGatewayEvent) => {
  const service = container.resolve(OpenaiTextToSpeechConverterService)
  const input = await getValidatedRequestInputValueObject(event, ConvertTextToSpeechRequestRequestInputDto)

  return service.convertTextToSpeech(input.text, input.parameters ?? {})
}

export async function handle(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  initializeRequestContainer(event)
  const responseHandler = container.resolve(RequestHandlerService)
  return await responseHandler.handle(handleProcessTextToSpeechSyncRequest(event))
}
