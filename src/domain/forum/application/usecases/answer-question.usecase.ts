import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Answer } from '../../enterprise/entities/answer.entity'
import { AnswersRepository } from '../repositories/answers.repository'
import { Either, right } from '@/core/either'
import { AnswerAttchment } from '../../enterprise/entities/answer-attachment.entity'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseRespinse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ instructorId, questionId, content, attachmentsIds }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseRespinse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })
    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttchment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      }),
    )
    answer.attachments = new AnswerAttachmentList(answerAttachments)
    await this.answersRepository.create(answer)
    return right({ answer })
  }
}
