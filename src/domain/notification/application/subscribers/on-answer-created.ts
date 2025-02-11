import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions.repository'
import { AnswerCreateEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../usecases/send-notification.usecase'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreateEvent.name)
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreateEvent) {
    const question = await this.questionRepository.findById(answer.questionId.toString())
    if (question) {
      this.sendNotification.execute({
        recipienteId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
