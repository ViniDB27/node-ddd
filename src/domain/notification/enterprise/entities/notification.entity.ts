import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

export interface NotificationProps {
  recipienteId: UniqueEntityId
  title: string
  content: string
  readAt?: Date
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipienteId() {
    return this.props.recipienteId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt ?? null
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityId) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
