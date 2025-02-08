import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Question } from '../../enterprise/entities/question.entity'
import { QuestionRepository } from '../repositories/questions.repository'
import { Either, right } from '@/core/either'
import { QuestionAttchment } from '../../enterprise/entities/question-attachment.entity'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({ authorId, title, content, attachmentsIds }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })
    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttchment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      }),
    )
    question.attachments = new QuestionAttachmentList(questionAttachments)
    await this.questionRepository.create(question)
    return right({ question })
  }
}
