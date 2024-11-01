import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import {
  OpenAIVoiceParameters,
  OpenAIVoiceParametersDto,
} from '@infrastructure/services/speech/text-to-speech-converter.interface'

export interface ConvertTextToSpeechRequestRequestInput {
  text: string
  voice?: string
  model?: string
}

@Exclude()
export class ConvertTextToSpeechRequestRequestInputDto implements ConvertTextToSpeechRequestRequestInput {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly text!: string

  @IsOptional()
  @Type(() => OpenAIVoiceParametersDto)
  @ValidateNested()
  @Expose()
  readonly parameters?: OpenAIVoiceParameters

  static async from(input: ConvertTextToSpeechRequestRequestInput): Promise<ConvertTextToSpeechRequestRequestInputDto> {
    const instance = plainToInstance(ConvertTextToSpeechRequestRequestInputDto, input, {
      excludeExtraneousValues: true,
    })
    await myValidateOrReject(instance)

    return instance
  }
}
