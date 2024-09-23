import 'reflect-metadata'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RequestValidatorService } from '../src/interfaces/http/services/shared/request-validator.service'
import { RequestErrorHandlerWrapperService } from '../src/interfaces/http/services/shared/request-error-handler-wrapper-service'
import { initializeContainer } from '../src/interfaces/shared/container-initialization.helper'
import { getEventBody } from '../src/interfaces/shared/aws-event.helper'
import { TextToSpeechService } from './text-to-speech.service'

interface ConvertTextToSpeechInput {
  text: string
}

const ConvertTextToSpeechInputSchema = z.object({
  text: z.string().url(),
})

export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  initializeContainer(event)
  const validator = container.resolve(RequestValidatorService)
  const actionWrapper = container.resolve(RequestErrorHandlerWrapperService)
  const textToSpeechProcessor = container.resolve(TextToSpeechService)
  const body = getEventBody(event) as ConvertTextToSpeechInput

  validator.validate(body, ConvertTextToSpeechInputSchema)
  const speech = await actionWrapper.execute(textToSpeechProcessor.processText, body.text)

  return {
    statusCode: 200,
    body: JSON.stringify(speech),
  }
}
