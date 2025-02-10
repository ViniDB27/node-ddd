import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { EditAnswerUseCase } from './edit-answer.usecase'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { makeAnswerAttachments } from 'test/factories/make-answer-attachment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Edit Answer Use Case', async () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('shold be able to edit a answer', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answersRepository.create(createAnswer)
    answerAttachmentsRepository.items.push(makeAnswerAttachments({ answerId: createAnswer.id, attachmentId: new UniqueEntityId('1') }))
    answerAttachmentsRepository.items.push(makeAnswerAttachments({ answerId: createAnswer.id, attachmentId: new UniqueEntityId('2') }))
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })
    expect(result.isRight()).toEqual(true)
    // expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    // expect(answersRepository.items[0].attachments.currentItems).toEqual([
    //   expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
    //   expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    // ])
  })

  it('shold not be able to edit a answer from another user', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answersRepository.create(createAnswer)
    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to edit a answer with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      answerId: 'wrong-id',
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
