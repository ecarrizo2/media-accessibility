export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
  validateState(): void
}
