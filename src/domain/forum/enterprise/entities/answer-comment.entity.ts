import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { Comment, CommentProps } from './comment.entity'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): AnswerComment {
    return new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
  }
}
