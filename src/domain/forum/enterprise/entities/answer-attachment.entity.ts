import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

interface AnswerAttchmentProps {
  answerId: string
  attachmentId: string
}

export class AnswerAttchment extends Entity<AnswerAttchmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttchmentProps, id?: UniqueEntityId): AnswerAttchment {
    return new AnswerAttchment(props, id)
  }
}
