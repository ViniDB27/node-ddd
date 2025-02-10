import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer.entity'
import { AnswersRepository } from '../repositories/answers.repository'
import { AnswerAttachmentRepository } from '../repositories/answer-attachments.repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttchment } from '../../enterprise/entities/answer-attachment.entity'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswersRepository,
    private readonly answersAttachmentRepository: AnswerAttachmentRepository,
  ) {}

  async execute({ authorId, answerId, content, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) return left(new ResourceNotFoundError())
    if (authorId !== answer.authorId.toString()) return left(new NotAllowedError())
    const currentAnswerAttachments = await this.answersAttachmentRepository.findManyByAnswerId(answerId)
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)
    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttchment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      }),
    )
    answerAttachmentList.update(answerAttachments)
    answer.content = content
    await this.answerRepository.update(answer)
    return right({ answer })
  }
}
