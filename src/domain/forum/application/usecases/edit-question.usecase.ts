import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question.entity'
import { QuestionRepository } from '../repositories/questions.repository'
import { QuestionAttachmentRepository } from '../repositories/question-attachments.repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttchment } from '../../enterprise/entities/question-attachment.entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async execute({ authorId, questionId, title, content, attachmentsIds }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) return left(new ResourceNotFoundError())
    if (authorId !== question.authorId.toString()) return left(new NotAllowedError())
    const currentQuestionAttachments = await this.questionAttachmentRepository.findManyByQuestionId(questionId)
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)
    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttchment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      }),
    )
    questionAttachmentList.update(questionAttachments)
    question.title = title
    question.content = content
    question.attachments = questionAttachmentList
    await this.questionRepository.update(question)
    return right({ question })
  }
}
