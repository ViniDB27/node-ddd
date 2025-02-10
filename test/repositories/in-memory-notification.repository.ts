import { NotificationRepository } from '@/domain/notification/application/repositories/notification.repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification.entity'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = []

  async save(notification: Notification) {
    const index = this.items.findIndex((item) => item.id == notification.id)
    this.items[index] = notification
  }
  async findById(notificationId: string) {
    return this.items.find((item) => item.id.toString() === notificationId) ?? null
  }
  async create(notification: Notification) {
    this.items.push(notification)
  }
}
