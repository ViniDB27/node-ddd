import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments.repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { CommentQuestionUseCase } from './comment-on-question.usecase'
import { makeQuestion } from 'test/factories/make-questio'
import { QuestionComment } from '../../enterprise/entities/question-comment.entity'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Comment on Question Use Case', async () => {
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionCommentsRepository: InMemoryQuestionCommentRepository
  let questionsRepository: InMemoryQuestionRepository
  let sut: CommentQuestionUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionRepository(questionAttachmentsRepository)
    sut = new CommentQuestionUseCase(questionsRepository, questionCommentsRepository)
  })

  it('shold be able to commemt a question', async () => {
    const question = makeQuestion({})
    await questionsRepository.create(question)
    const result = await sut.execute({
      authorId: '1',
      questionId: question.id.toString(),
      content: 'new question comment content',
    })
    expect(result.isRight()).toEqual(true)
    expect(questionCommentsRepository.items[0]).toEqual(
      (
        result.value as {
          questionComment: QuestionComment
        }
      ).questionComment,
    )
  })

  it('shold not be able to comment a question with wrong-id', async () => {
    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'wrong-id',
      content: 'new question comment content',
    })
    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
