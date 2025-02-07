import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments.repository'
import { FetchCommentQuestionUseCase } from './fetch-comment-on-question.usecase'
import { makeQuestionComment } from 'test/factories/make-questio-comment'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'

describe('Fetch Comment Question Use Case', async () => {
  let questionCommentsRepository: InMemoryQuestionCommentRepository
  let sut: FetchCommentQuestionUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchCommentQuestionUseCase(questionCommentsRepository)
  })

  it('shold be able to fetch comments of the question', async () => {
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-id') }))
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-id') }))
    await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-id') }))
    const result = await sut.execute({
      questionId: 'question-id',
      page: 1,
    })
    expect(result.isRight()).toEqual(true)
    expect(result.value?.questionComments.length).toEqual(3)
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityId('question-id'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityId('question-id'),
      }),
      expect.objectContaining({
        questionId: new UniqueEntityId('question-id'),
      }),
    ])
  })

  it('shold be able to fetch paginated comments of the question', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-id') }))
    }
    const result = await sut.execute({
      questionId: 'question-id',
      page: 2,
    })
    expect(result.value?.questionComments.length).toEqual(2)
  })
})
