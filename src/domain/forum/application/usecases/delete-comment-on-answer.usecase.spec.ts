import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { DeleteCommentAnswerUseCase } from './delete-comment-on-answer.usecase'

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
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerCommentId: answerComment.id.toString(),
      }),
    ).rejects.instanceOf(Error)
  })

  it('shold not be able to delete a answer comment with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerCommentId: 'wrong-id',
      }),
    ).rejects.instanceOf(Error)
  })
})
