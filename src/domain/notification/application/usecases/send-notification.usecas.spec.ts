

import { SendNotificationUseCase } from './send-notification.usecase'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification.repository'

describe('Send Notification Use Case', async () => {
  let notificationsRepository: InMemoryNotificationRepository
  let sut: SendNotificationUseCase

  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('shold be able to send a notification', async () => {
    const result = await sut.execute({
      recipienteId: '1',
      title: 'new notification',
      content: 'new notification content',
    })

    expect(result.isRight()).toEqual(true)
  })
})
