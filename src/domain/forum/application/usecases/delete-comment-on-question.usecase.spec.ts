import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments.repository'
import { makeQuestionComment } from 'test/factories/make-questio-comment'
import { DeleteCommentQuestionUseCase } from './delete-comment-on-question.usecase'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Delete Comment on Question Use Case', async () => {
  let questionCommentsRepository: InMemoryQuestionCommentRepository
  let sut: DeleteCommentQuestionUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteCommentQuestionUseCase(questionCommentsRepository)
  })

  it('shold be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })
    await questionCommentsRepository.create(questionComment)
    await sut.execute({
      authorId: 'author-1',
      questionCommentId: questionComment.id.toString(),
    })
    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('shold not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })
    await questionCommentsRepository.create(questionComment)
    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold not be able to delete a question comment with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: 'wrong-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
