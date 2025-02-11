import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { SendNotificationUseCase } from '../usecases/send-notification.usecase'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification.repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { makeQuestion } from 'test/factories/make-questio'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionRepository
let notificationRepository: InMemoryNotificationRepository
let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sendNotification: SendNotificationUseCase
let SendNotificationExecuteSpy: MockInstance

describe('On Answer Crated', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    notificationRepository = new InMemoryNotificationRepository()
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentRepository)
    sendNotification = new SendNotificationUseCase(notificationRepository)
    SendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')
    const _ = new OnAnswerCreated(questionsRepository, sendNotification)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion({})
    const answer = makeAnswer({ questionId: question.id })
    questionsRepository.create(question)
    answersRepository.create(answer)
    await waitFor(() => expect(SendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
