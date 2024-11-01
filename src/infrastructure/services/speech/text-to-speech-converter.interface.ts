import { IsOptional, IsString } from 'class-validator'

export interface Speech {
  id: string
  text: string
  speechUrl: string
  createdAt: string
  updatedAt: string
}

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
