import 'reflect-metadata'
import { container } from 'tsyringe'
import { initializeRequestContainer } from '@interfaces/shared/container-initialization.helper'
import { RequestHandlerService } from '@interfaces/http/services/request-handler.service'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TextToSpeechService } from 'src/temporal/text-to-speech.service'
import { getEventBody } from '@interfaces/http/aws-http-api-gateway-event.helper'

/**
 * The main handler function for processing image requests.
 *
 * @param {APIGatewayEvent} event - The API Gateway event.
 * @returns {Promise<APIGatewayProxyResult>} - The API Gateway proxy result.
 */
const handleProcessTextToSpeechSyncRequest = async (event: APIGatewayEvent) => {
  const service = container.resolve(TextToSpeechService)  
  const body = getEventBody(event)
  const text = body.text as string
  const voice = body.voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

  return service.processText(text, voice)
}

export async function handle(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  initializeRequestContainer(event)
  const responseHandler = container.resolve(RequestHandlerService)
  return await responseHandler.handle(handleProcessTextToSpeechSyncRequest(event))
}
