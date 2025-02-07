import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Question } from '../../enterprise/entities/question.entity'
import { QuestionRepository } from '../repositories/questions.repository'
import { Either, right } from '@/core/either'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({ authorId, title, content }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })
    await this.questionRepository.create(question)
    return right({ question })
  }
}
