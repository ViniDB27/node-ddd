import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../usecases/send-notification.usecase'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { QuestionBestAnserChoosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-choosen-event'

export class OnQuestioBestAnswerChoosen implements EventHandler {
  constructor(
    private readonly anserRepository: AnswersRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendQuestionBestAnswerNotification.bind(this), QuestionBestAnserChoosenEvent.name)
  }

  private async sendQuestionBestAnswerNotification({ question, bestAnserId }: QuestionBestAnserChoosenEvent) {
    const answer = await this.anserRepository.findById(bestAnserId.toString())
    if (answer) {
      this.sendNotification.execute({
        recipienteId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor! `,
      })
    }
  }
}
