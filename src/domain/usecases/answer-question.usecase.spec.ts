import { AnswerQuestionUseCase } from './answer-question.usecase'
import { AnswersRepository } from '../repositories/answers.repository'
import { Answer } from '../entities/answer.entity'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {},
}

describe('Answer Questio Use Case', async () => {
  it('shold be able to create a answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)
    
    const answer = await answerQuestion.execute({
      questionId: '1',
      instructorId: '1',
      content: 'answer',
    })

    expect(answer.content).toEqual('answer')
  })
})
