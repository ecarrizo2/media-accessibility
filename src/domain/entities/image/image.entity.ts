import { BaseEntity } from '@domain/entities/base.entity'
import { IsDateString, IsObject, IsString, IsUrl } from 'class-validator'
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer'
import { myValidateOrReject } from '@shared/class-validator/validator.helper'

/**
 * Interface representing an Image and its Analysis Metadata.
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
 */
@Exclude()
export class ImageEntity implements Image, BaseEntity {
  @IsString()
  @Expose()
  id!: string

  @IsUrl()
  @Expose()
  url!: string

  @IsString()
  @Expose()
  prompt!: string

  @IsString()
  @Expose()
  analysisText!: string

  @IsString()
  @Expose()
  analysisVendor!: string

  @IsObject()
  @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
  @Transform(({ value }) => JSON.parse(value as string) as unknown, { toClassOnly: true })
  @Expose()
  analysisResultRaw!: unknown

  @IsDateString()
  @Expose()
  createdAt!: string

  @IsDateString()
  @Expose()
  updatedAt!: string

  static async from(init: Image) {
    const instance = plainToInstance(ImageEntity, init, { excludeExtraneousValues: true })
    await myValidateOrReject(instance)

    return instance
  }

  async validateState() {
    return myValidateOrReject(this)
  }
}
