import { BaseEntity } from '@domain/entities/base.entity'
import { z } from 'zod'

export interface ImageProps {
  id: string
  url: string
  prompt: string
  analysisText: string
  analysisVendor: string
  analysisResultRaw: unknown
  createdAt: string
  updatedAt?: string
}

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

export class ImageEntity implements ImageProps, BaseEntity {
  readonly id: string
  readonly url: string
  readonly prompt: string
  readonly analysisText: string
  readonly analysisVendor: string
  readonly analysisResultRaw: unknown
  readonly createdAt: string
  readonly updatedAt?: string

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

  private validateInitialization(props: ImageProps) {
    ImagePropsSchema.parse(props)
  }

  validateState() {
    ImagePropsSchema.parse(this)
  }
}
