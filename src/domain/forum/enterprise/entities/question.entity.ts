import dayjs from 'dayjs'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from '../vos/slug.vo'
import { QuestionBestAnserChoosenEvent } from '../events/question-best-answer-choosen-event'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  attachments: QuestionAttachmentList
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

  set attachments(attachments: QuestionAttachmentList) {
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
    if (bestAnswerId === undefined) return
    if (this.props.bestAnswerId === undefined || !athis.props.bestAnswerId.equals(bestAnswerId)) {
      this.addDomainEvents(new QuestionBestAnserChoosenEvent(this, bestAnswerId))
    }
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId): Question {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
