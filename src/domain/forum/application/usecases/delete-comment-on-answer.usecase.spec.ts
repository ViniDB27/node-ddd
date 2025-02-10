import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { DeleteCommentAnswerUseCase } from './delete-comment-on-answer.usecase'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Delete Comment on Answer Use Case', async () => {
  let answerCommentsRepository: InMemoryAnswerCommentRepository
  let sut: DeleteCommentAnswerUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteCommentAnswerUseCase(answerCommentsRepository)
  })

  it('shold be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })
    await answerCommentsRepository.create(answerComment)
    await sut.execute({
      authorId: 'author-1',
      answerCommentId: answerComment.id.toString(),
    })
    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it('shold not be able to delete a answer comment from another user', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })
    await answerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('shold not be able to delete a answer comment with wrong id', async () => {
    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
