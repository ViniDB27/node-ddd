import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification.entity'
import { NotificationRepository } from '../repositories/notification.repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface ReadNotificationUseCaseRequest {
  recipienteId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute({ recipienteId, notificationId }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(notificationId)
    if (!notification) return left(new ResourceNotFoundError())
    if (recipienteId !== notification.recipienteId.toString()) return left(new NotAllowedError())
    notification.read()
    await this.notificationRepository.save(notification)
    return right({ notification })
  }
}
