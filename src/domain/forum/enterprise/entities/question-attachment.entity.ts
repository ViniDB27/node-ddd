import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

export interface QuestionAttchmentProps {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class QuestionAttchment extends Entity<QuestionAttchmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttchmentProps, id?: UniqueEntityId): QuestionAttchment {
    return new QuestionAttchment(props, id)
  }
}
