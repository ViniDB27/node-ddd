import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { EditAnswerUseCase } from './edit-answer.usecase'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Edit Answer Use Case', async () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('shold be able to edit a answer', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answersRepository.create(createAnswer)
    const result = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'new content',
    })
    expect(result.isRight()).toEqual(true)
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
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to edit a answer with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      answerId: 'wrong-id',
      content: 'new content',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
