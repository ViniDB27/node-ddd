import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { DeleteAnswerUseCase } from './delete-answer.usecase'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { makeAnswerAttachments } from 'test/factories/make-answer-attachment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Delete Answer Use Case', async () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answerRepository: InMemoryAnswersRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new DeleteAnswerUseCase(answerRepository)
  })

  it('shold be able to delete a answer', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answerRepository.create(createAnswer)
    answerAttachmentsRepository.items.push(makeAnswerAttachments({ answerId: createAnswer.id, attachmentId: new UniqueEntityId('1') }))
    answerAttachmentsRepository.items.push(makeAnswerAttachments({ answerId: createAnswer.id, attachmentId: new UniqueEntityId('2') }))
    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(answerRepository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('shold not be able to delete a answer from another user', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answerRepository.create(createAnswer)
    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to delete a answer with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      answerId: 'wrong-id',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
