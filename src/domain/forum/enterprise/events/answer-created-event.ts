import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Answer } from '../entities/answer.entity'

export class AnswerCreateEvent implements DomainEvent {
  public ocurredAt: Date
  public readonly answer: Answer

  constructor(answer: Answer) {
    this.ocurredAt = new Date()
    this.answer = answer
  }
  getAggregateId(): UniqueEntityId {
    return this.answer.id
  }
}
