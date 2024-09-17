import { BaseEntity } from '../src/domain/entities/base.entity'

export interface SpeechEntity extends BaseEntity {
  text: string
  textHash: string
  speechUrl: string
}
