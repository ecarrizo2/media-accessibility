import { ImageEntity } from '../entities/image.entity'
import { BaseRepository } from '@domain/repositories/base-repository.interface'

export interface ImageRepository extends BaseRepository<ImageEntity> {
  findByUrl(url: string): Promise<ImageEntity | null>
}
