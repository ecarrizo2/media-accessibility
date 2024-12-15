import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'
import { VoiceParameters } from '@domain/types/speech/speech.interface'

export interface ConvertTextToSpeechRequestRequestInput {
  text: string
  parameters?: VoiceParameters
}

@Exclude()
export class VoiceParametersDto implements VoiceParameters {
  @IsOptional()
  @IsString()
  @Expose()
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

  @IsOptional()
  @IsString()
  @Expose()
  model?: 'ts-1'
}


@Exclude()
export class ConvertTextToSpeechRequestInputDto implements ConvertTextToSpeechRequestRequestInput {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly text!: string

  @IsOptional()
  @Type(() => VoiceParametersDto)
  @ValidateNested()
  @Expose()
  readonly parameters?: VoiceParameters

  static async from(input: ConvertTextToSpeechRequestRequestInput): Promise<ConvertTextToSpeechRequestInputDto> {
    const instance = plainToInstance(ConvertTextToSpeechRequestInputDto, input, {
      excludeExtraneousValues: true,
    })

    await myValidateOrReject(instance)

    return instance
  }
}
