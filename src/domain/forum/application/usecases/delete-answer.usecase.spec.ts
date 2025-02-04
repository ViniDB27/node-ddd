import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { DeleteAnswerUseCase } from './delete-answer.usecase'
import { makeAnswer } from 'test/factories/make-answer'

describe('Delete Answer Use Case', async () => {
  let answerRepository: InMemoryAnswersRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
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
    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(answerRepository.intems).toHaveLength(0)
  })

  it('shold not be able to delete a answer from another user', async () => {
    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('answer-1'),
    )
    await answerRepository.create(createAnswer)
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
      }),
    ).rejects.instanceOf(Error)
  })

  it('shold be able to delete a answer with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'wrong-id',
        answerId: 'wrong-id',
      }),
    ).rejects.instanceOf(Error)
  })
})
