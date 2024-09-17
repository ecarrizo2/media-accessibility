export interface BaseRepository<T> {
  findById(id: string): Promise<T | undefined>
  save(entity: T): Promise<void>
}
