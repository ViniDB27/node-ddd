import dayjs from 'dayjs'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Optional } from '@/core/types/optional'
import { Slug } from '@/domain/vos/slug.vo'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttchment } from './question-attachment.entity'
import { a } from 'vitest/dist/chunks/suite.BJU7kdY9'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  attachments: QuestionAttchment[]
  content: string
  slug: Slug
  title: string
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get attachments() {
    return this.props.attachments
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew() {
    return dayjs().diff(this.props.createdAt, 'day') <= 3
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trim().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set attachments(attachments: QuestionAttchment[]) {
    this.props.attachments = attachments
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    this.props.bestAnswerId = bestAnswerId
  }

  static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId): Question {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
