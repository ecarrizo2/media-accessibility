import { Speech } from '@domain/types/speech/speech.interface'

export interface TextToSpeechConverter<AdditionalParametersType> {
  convertTextToSpeech(text: string, additionalParameters: AdditionalParametersType): Promise<Speech>
}
