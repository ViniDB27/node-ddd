import { QuestionRepository } from '../repositories/questions.repository'
import { CreateQuestionUseCase } from './create-question.usecsae'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'

describe('Create Questio Use Case', async () => {
  let questionsRepository: QuestionRepository
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
  })
})
