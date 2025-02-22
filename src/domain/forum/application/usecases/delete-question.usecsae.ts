import { Either, left, right } from '@/core/either'
import { QuestionRepository } from '../repositories/questions.repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({ authorId, questionId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) return left(new ResourceNotFoundError())
    if (authorId !== question.authorId.toString()) return left(new NotAllowedError())
    await this.questionRepository.delete(question)
    return right({})
  }
}
