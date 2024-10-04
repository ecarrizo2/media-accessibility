import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator'
import { Exclude, Expose, plainToInstance } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

/**
 * Interface representing the parameters for processing an image request.
 */
export interface ProcessImageRequestRequestInput {
  url: string
  prompt: string
  createSpeech?: boolean
}

/**
 * Class representing the input for processing an image request.
 */
@Exclude()
export class ProcessImageRequestInputDto implements ProcessImageRequestRequestInput {
  @IsUrl()
  @Expose()
  readonly url!: string

  @IsString()
  @Expose()
  readonly prompt!: string

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly createSpeech?: boolean

  static async from(input: ProcessImageRequestRequestInput): Promise<ProcessImageRequestInputDto> {
    const instance = plainToInstance(ProcessImageRequestInputDto, input, { excludeExtraneousValues: true })
    await myValidateOrReject(instance)

    return instance
  }
}
