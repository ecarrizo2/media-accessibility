import { BaseEntity } from '@domain/entities/base.entity'
import { z } from 'zod'

/**
 * Interface representing the properties of an image.
 */
export interface ImageProps {
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
  updatedAt?: string
}

/**
 * Zod schema for validating ImageProps.
 */
const ImagePropsSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  prompt: z.string(),
  analysisText: z.string(),
  analysisVendor: z.string(),
  analysisResultRaw: z.unknown(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

/**
 * Class representing an image entity.
 * Implements the ImageProps and BaseEntity interfaces.
 */
export class ImageEntity implements ImageProps, BaseEntity {
  readonly id: string
  readonly url: string
  readonly prompt: string
  readonly analysisText: string
  readonly analysisVendor: string
  readonly analysisResultRaw: unknown
  readonly createdAt: string
  readonly updatedAt?: string

  /**
   * Creates an instance of ImageEntity.
   *
   * @param {ImageProps} props - The properties of the image.
   */
  constructor(props: ImageProps) {
    this.validateInitialization(props)
    this.id = props.id
    this.url = props.url
    this.analysisText = props.analysisText
    this.analysisResultRaw = props.analysisResultRaw
    this.analysisVendor = props.analysisVendor
    this.prompt = props.prompt
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  /**
   * Validates the initialization properties of the image.
   *
   * @param {ImageProps} props - The properties to validate.
   * @private
   */
  private validateInitialization(props: ImageProps) {
    ImagePropsSchema.parse(props)
  }

  /**
   * Validates the current state of the image.
   *
   * @throws {Error} If the state is invalid.
   */
  validateState() {
    ImagePropsSchema.parse(this)
  }
}
