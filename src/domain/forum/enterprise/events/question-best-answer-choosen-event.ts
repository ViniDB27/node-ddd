import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Question } from '../entities/question.entity'

export class QuestionBestAnserChoosenEvent implements DomainEvent {
  public ocurredAt: Date
  public readonly question: Question
  public readonly bestAnserId: UniqueEntityId

  constructor(question: Question, bestAnserId: UniqueEntityId) {
    this.ocurredAt = new Date()
    this.question = question
    this.bestAnserId = bestAnserId
  }
  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
