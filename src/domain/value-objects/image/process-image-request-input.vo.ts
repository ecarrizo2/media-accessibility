import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator'
import { plainToInstance } from 'class-transformer'
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
export class ProcessImageRequestInputDto implements ProcessImageRequestRequestInput {
  @IsUrl()
  url!: string

  @IsString()
  prompt!: string

  @IsOptional()
  @IsBoolean()
  createSpeech?: boolean

  /**
   * Static method to factory a new ProcessImageRequestInput instance from the given input parameters.
   *
   * @param {ProcessImageRequestRequestInput} input - The input parameters for processing an image request.
   * @returns {ProcessImageRequestInputDto} - The created ProcessImageRequestInput instance.
   */
  static async from(input: ProcessImageRequestRequestInput): Promise<ProcessImageRequestInputDto> {
    const dto = plainToInstance(ProcessImageRequestInputDto, input, { excludeExtraneousValues: true })
    await myValidateOrReject(dto)

    return dto
  }
}
