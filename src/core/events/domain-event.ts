import { UniqueEntityId } from "../vos/unique-entity-id.vo"

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
