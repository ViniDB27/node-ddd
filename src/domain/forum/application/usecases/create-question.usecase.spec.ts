import { CreateQuestionUseCase } from './create-question.usecsae'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'

describe('Create Question Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('shold be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'new question',
      content: 'new question content',
    })

    expect(question.id).toBeTruthy()
    expect(questionsRepository.intems[0].id).toEqual(question.id)
  })
})
