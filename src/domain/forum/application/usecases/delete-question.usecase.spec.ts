import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { DeleteQuestionUseCase } from './delete-question.usecsae'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

describe('Delete Question Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('shold be able to delete a question', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(questionsRepository.intems).toHaveLength(0)
  })

  it('shold not be able to delete a question from another user', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId: 'question-1',
      }),
    ).rejects.instanceOf(Error)
  })

  it('shold be able to delete a question with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'wrong-id',
        questionId: 'wrong-id',
      }),
    ).rejects.instanceOf(Error)
  })
})
