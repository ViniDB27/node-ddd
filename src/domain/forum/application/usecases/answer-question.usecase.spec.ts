import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { AnswerQuestionUseCase } from './answer-question.usecase'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

describe('Answer Questio Use Case', async () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('shold be able to create a answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'answer',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toEqual(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
