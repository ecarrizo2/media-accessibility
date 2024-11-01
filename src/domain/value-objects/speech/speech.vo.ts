import { Speech } from '@infrastructure/services/speech/text-to-speech-converter.interface'
import { IsString } from 'class-validator'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

@Exclude()
export class SpeechVO implements Speech {
  @IsString()
  @Expose()
  id!: string

  @IsString()
  @Expose()
  text!: string

  @IsString()
  @Expose()
  speechUrl!: string

  @IsString()
  @Expose()
  createdAt!: string

  @IsString()
  @Expose()
  updatedAt!: string

  static async from(input: Speech): Promise<SpeechVO> {
    const instance = plainToInstance(SpeechVO, input, { excludeExtraneousValues: true })
    await myValidateOrReject(instance)

    return instance
  }
}
