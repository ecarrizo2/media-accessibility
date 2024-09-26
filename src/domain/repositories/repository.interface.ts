/**
 * Interface representing a base repository with common CRUD operations.
 *
 * @template EntityType - The type of the entity.
 */
export interface Repository<EntityType> {
  /**
   * Finds an entity by its ID.
   *
   * @param {string} id - The ID of the entity.
   * @returns {Promise<EntityType | undefined>} - A promise that resolves to the entity or undefined if not found.
   */
  findById(id: string): Promise<EntityType | null>

  /**
   * Saves an entity.
   *
   * @param {EntityType} entity - The entity to save.
   * @returns {Promise<void>} - A promise that resolves when the entity is saved.
   */
  save(entity: EntityType): Promise<void>


}
