import { AnswerQuestionUseCase } from './answer-question.usecase'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'

describe('Answer Questio Use Case', async () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('shold be able to create a answer', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'answer',
    })

    expect(answer.id).toBeTruthy()
    expect(answersRepository.intems[0].id).toEqual(answer.id)
  })
})
