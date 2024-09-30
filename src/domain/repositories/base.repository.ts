import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer'

export abstract class EntityTransformableRepository<EntityType> {
  protected entityClass: ClassConstructor<EntityType> | undefined

  /**
   * Converts a DynamoDB item to an entity.
   * Must be implemented in the derived class.
   *
   * @param {any} item - The DynamoDB item.
   * @returns {EntityType} - The entity.
   */
  protected toEntity(item: Record<string, unknown>): EntityType {
    if (!this.entityClass) {
      throw new Error('Abstract implementation is wrong, Entity class not defined')
    }

    return plainToInstance(this.entityClass, item)
  }

  /**
   * Converts an entity to a DynamoDB item.
   * Must be implemented in the derived class.
   *
   * @param {EntityType} entity - The entity.
   * @returns {any} - The DynamoDB item.
   */
  protected toItem(entity: EntityType): Record<string, unknown> {
    return instanceToPlain(entity)
  }

  // findById(id: string): Promise<EntityType | null> {
  //   return Promise.resolve(undefined)
  // }
  //
  // save(entity: EntityType): Promise<void> {
  //   return Promise.resolve(undefined)
  // }
}
