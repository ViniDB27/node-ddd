import { QuestionComment } from '../../enterprise/entities/question-comment.entity'
import { QuestionCommentRepository } from '../repositories/question-comments.repository'

interface FetchCommentQuestionUseCaseRequest {
  questionId: string
  page: number
}

interface FetchCommentQuestionUseCaseResponse {
  questionComments: QuestionComment[]
}

export class FetchCommentQuestionUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchCommentQuestionUseCaseRequest): Promise<FetchCommentQuestionUseCaseResponse> {
    const questionComments =
      await this.questionCommentRepository.findByQuestionId(questionId, {
        page,
      })
    return {
      questionComments,
    }
  }
}
