import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { AnswerAttachmentList } from './answer-attachment-list'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trim().concat('...')
  }

  get attachments() {
    return this.props.attachments
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId): Answer {
    return new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList([]),
        createdAt: new Date(),
      },
      id,
    )
  }
}
