import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Comment, CommentProps } from './comment.entity'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }
  
  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): QuestionComment {
    return new QuestionComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
