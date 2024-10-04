import { ClassConstructor, instanceToPlain, plainToInstance } from 'class-transformer'

export abstract class EntityTransformableRepository<EntityType> {
  protected entityClass: ClassConstructor<EntityType> | undefined

  protected toEntity(item: Record<string, unknown>): EntityType {
    if (!this.entityClass) {
      throw new Error('Abstract implementation is wrong, Entity class not defined')
    }

    return plainToInstance(this.entityClass, item)
  }

  protected toItem(entity: EntityType): Record<string, unknown> {
    return instanceToPlain(entity)
  }
}
