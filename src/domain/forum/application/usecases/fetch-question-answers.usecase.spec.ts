import { FetchQuestionAnswersCase } from './fetch-questions-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

describe('Fetch Recent Questions Use Case', async () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: FetchQuestionAnswersCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersCase(answersRepository)
  })

  it('shold be able to fetch question answers', async () => {
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('questianId-1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('questianId-1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('questianId-1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('questianId-2') }),
    )

    const { answers } = await sut.execute({
      questionId: 'questianId-1',
      page: 1,
    })

    expect(answers.length).toEqual(3)
    expect(answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityId('questianId-1'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityId('questianId-1'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityId('questianId-1'),
      }),
    ])
  })

  it('shold be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('questianId-1') }),
      )
    }

    const { answers } = await sut.execute({
      questionId: 'questianId-1',
      page: 2,
    })

    expect(answers.length).toEqual(2)
  })
})
