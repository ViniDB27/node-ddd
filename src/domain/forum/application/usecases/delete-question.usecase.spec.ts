import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { DeleteQuestionUseCase } from './delete-question.usecsae'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('shold not be able to delete a question from another user', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )
    await questionsRepository.create(createQuestion)
    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold be able to delete a question with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'wrong-id',
      questionId: 'wrong-id',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
