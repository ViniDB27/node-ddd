import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { QuestionRepository } from '../repositories/questions.repository'
import { QuestionComment } from '../../enterprise/entities/question-comment.entity'
import { QuestionCommentRepository } from '../repositories/question-comments.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({ authorId, questionId, content }: CommentQuestionUseCaseRequest): Promise<CommentQuestionUseCaseResponse> {
    const questio = await this.questionRepository.findById(questionId)
    if (!questio) return left(new ResourceNotFoundError())
    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: questio.id,
      content,
    })
    await this.questionCommentRepository.create(questionComment)
    return right({ questionComment })
  }
}
