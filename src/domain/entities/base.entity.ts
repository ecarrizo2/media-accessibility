/**
 * Interface representing a base entity with common properties and methods.
 */
export interface BaseEntity {
  /** The unique identifier of the entity. */
  id: string

  /** The date and time when the entity was created. */
  createdAt: string

  /** The date and time when the entity was last updated (optional). */
  updatedAt?: string

  /**
   * Validates the state of the entity.
   * @throws {Error} If the state is invalid.
   */
  validateState(): void
}
