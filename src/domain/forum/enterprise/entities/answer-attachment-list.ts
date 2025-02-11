import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttchment } from './answer-attachment.entity'

export class AnswerAttachmentList extends WatchedList<AnswerAttchment> {
  compareItems(a: AnswerAttchment, b: AnswerAttchment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
