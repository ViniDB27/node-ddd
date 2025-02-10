import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { CommentAnswerUseCase } from './comment-on-answer.usecase'
import { makeAnswer } from 'test/factories/make-answer'
import { AnswerComment } from '../../enterprise/entities/answer-comment.entity'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Comment on Answer Use Case', async () => {
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let answerCommentsRepository: InMemoryAnswerCommentRepository
  let answerRepository: InMemoryAnswersRepository
  let sut: CommentAnswerUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    sut = new CommentAnswerUseCase(answerRepository, answerCommentsRepository)
  })

  it('shold be able to commemt a answer', async () => {
    const answer = makeAnswer({})
    await answerRepository.create(answer)

    const result = await sut.execute({
      authorId: '1',
      answerId: answer.id.toString(),
      content: 'new answer comment content',
    })

    expect(result.isRight()).toEqual(true)
    expect(answerCommentsRepository.items[0]).toEqual((result.value as { answerComment: AnswerComment }).answerComment)
  })

  it('shold not be able to comment a answer with wrong-id', async () => {
    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'wrong-id',
      content: 'new answer comment content',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
