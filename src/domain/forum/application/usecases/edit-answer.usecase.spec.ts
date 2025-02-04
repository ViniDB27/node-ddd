import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { EditAnswerUseCase } from './edit-answer.usecase'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswer } from 'test/factories/make-answer'

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
    const { answer } = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'new content',
    })

    expect(answer.id.toString()).toEqual(createAnswer.id.toString())
    expect(answer.content).toEqual('new content')
  })

  it('shold not be able to edit a answer from another user', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answersRepository.create(createAnswer)
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
        content: 'new content',
      }),
    ).rejects.instanceOf(Error)
  })

  it('shold be able to edit a answer with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'wrong-id',
        answerId: 'wrong-id',
        content: 'new content',
      }),
    ).rejects.instanceOf(Error)
  })
})
