import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { DeleteQuestionUseCase } from './delete-question.usecsae'
import { makeQuestion } from 'test/factories/make-questio'

describe('Create Questio Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('shold be able to delete a question', async () => {
    const createQuestion = makeQuestion({})
    await questionsRepository.create(createQuestion)
    await sut.execute({
      questionId: createQuestion.id.toValue(),
    })

    expect(questionsRepository.intems).toHaveLength(0)
  })

  it('shold be able to create a question with wrong id', async () => {
    await expect(() =>
      sut.execute({
        questionId: 'wrong-id',
      }),
    ).rejects.instanceOf(Error)
  })
})
