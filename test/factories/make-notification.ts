import { faker } from '@faker-js/faker'
import { UniqueEntityId } from "@/core/vos/unique-entity-id.vo";
import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/notification.entity';

export function makeNotification(
  override: Partial<NotificationProps>,
  id?: UniqueEntityId
) {
  return Notification.create({
    recipienteId: new UniqueEntityId(),
    title: faker.lorem.sentence(),
    content: faker.lorem.text(),
    ...override
  }, id)
}
