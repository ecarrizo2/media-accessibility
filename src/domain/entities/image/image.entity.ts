import { BaseEntity } from '@domain/entities/base.entity'
import { IsDateString, IsObject, IsString, IsUrl, validateOrReject } from 'class-validator'
import { Transform } from 'class-transformer'

/**
 * Interface representing an Image and its Analysis Metadata.
 * TBD: naming?
 */
export interface Image {
  /** The unique identifier of the image. */
  id: string

  /** The URL of the image. */
  url: string

  /** The prompt used to analyse the image. */
  prompt: string

  /** The analysis text of the image. */
  analysisText: string

  /** The vendor that provided the analysis. */
  analysisVendor: string

  /** The raw result of the analysis. */
  analysisResultRaw: unknown

  /** The date and time when the image was created. */
  createdAt: string

  /** The date and time when the image was last updated (optional). */
  updatedAt: string
}

/**
 * Class representing an image entity.
 * Implements the ImageProps and BaseEntity interfaces.
 */
export class ImageEntity implements Image, BaseEntity {
  @IsString()
  id!: string

  @IsUrl()
  url!: string

  @IsString()
  prompt!: string

  @IsString()
  analysisText!: string

  @IsString()
  analysisVendor!: string

  @IsObject()
  @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
  @Transform(({ value }) => JSON.parse(value as string) as unknown, { toClassOnly: true })
  analysisResultRaw!: unknown

  @IsDateString()
  createdAt!: string

  @IsDateString()
  updatedAt!: string

  /**
   * Validates the current state of the image.
   *
   * @throws {Error} If the state is invalid.
   */
  async validateState() {
    return validateOrReject(this)
  }
}
