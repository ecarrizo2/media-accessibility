import { IsOptional, IsString } from 'class-validator'
import { Speech } from '@domain/types/speech/speech.interface'

export interface OpenAIVoiceParameters {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  model?: 'ts-1'
}

export class OpenAIVoiceParametersDto implements OpenAIVoiceParameters {
  @IsOptional()
  @IsString()
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

  @IsOptional()
  @IsString()
  model?: 'ts-1'
}

export interface TextToSpeechConverter<AdditionalParametersType> {
  convertTextToSpeech(text: string, additionalParameters: AdditionalParametersType): Promise<Speech>
}
