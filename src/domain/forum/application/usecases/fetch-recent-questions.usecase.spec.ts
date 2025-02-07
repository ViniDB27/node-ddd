import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { makeQuestion } from 'test/factories/make-questio'
import { FetchRecentQuestionsCase } from './fetch-recent-questions.usecase'

describe('Fetch Recent Questions Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let sut: FetchRecentQuestionsCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new FetchRecentQuestionsCase(questionsRepository)
  })

  it('shold be able to fetch recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 18) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 23) }))

    const { questions } = await sut.execute({ page: 1 })

    expect(questions.length).toEqual(3)
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('shold be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(makeQuestion({}))
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions.length).toEqual(2)
  })

})
