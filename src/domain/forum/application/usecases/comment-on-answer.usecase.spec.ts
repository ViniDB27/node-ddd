import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { CommentAnswerUseCase } from './comment-on-answer.usecase'
import { makeAnswer } from 'test/factories/make-answer'

describe('Comment on Answer Use Case', async () => {
  let answerCommentsRepository: InMemoryAnswerCommentRepository
  let answerRepository: InMemoryAnswersRepository
  let sut: CommentAnswerUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentRepository()
    answerRepository = new InMemoryAnswersRepository()
    sut = new CommentAnswerUseCase(
      answerRepository,
      answerCommentsRepository,
    )
  })

  it('shold be able to commemt a answer', async () => {
    const answer = makeAnswer({})
    await answerRepository.create(answer)

    const { answerComment } = await sut.execute({
      authorId: '1',
      answerId: answer.id.toString(),
      content: 'new answer comment content',
    })

    expect(answerComment.id).toBeTruthy()
    expect(answerCommentsRepository.items[0].id).toEqual(answerComment.id)
  })

  it('shold not be able to comment a answer with wrong-id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: 'wrong-id',
        content: 'new answer comment content',
      }),
    ).rejects.instanceOf(Error)
  })
})
