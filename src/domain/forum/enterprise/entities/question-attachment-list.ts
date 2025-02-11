import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttchment } from './question-attachment.entity'

export class QuestionAttachmentList extends WatchedList<QuestionAttchment> {
  compareItems(a: QuestionAttchment, b: QuestionAttchment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }

  
}
