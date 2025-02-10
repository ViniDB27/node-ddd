import { ReadNotificationUseCase } from './read-notification.usecase'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification.repository'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Read Notification Use Case', async () => {
  let notificationsRepository: InMemoryNotificationRepository
  let sut: ReadNotificationUseCase

  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('shold be able to read a notification', async () => {
    const notification = makeNotification({})
    await notificationsRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipienteId: notification.recipienteId.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('shold not be able to read a notification from another user', async () => {
    const notification = makeNotification({})
    await notificationsRepository.create(notification)
    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipienteId: 'recipient-1',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to read a notification with wrong id', async () => {
    const result = await sut.execute({
      notificationId: 'wrong-id',
      recipienteId: 'wrong-id',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
