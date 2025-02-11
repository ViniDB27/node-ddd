import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification.entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { NotificationRepository } from '../repositories/notification.repository'

export interface SendNotificationUseCaseRequest {
  recipienteId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute({ recipienteId, title, content }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipienteId: new UniqueEntityId(recipienteId),
      title,
      content,
    })
    await this.notificationRepository.create(notification)
    return right({ notification })
  }
}
