import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments.repository'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { CommentQuestionUseCase } from './comment-on-question.usecase'
import { makeQuestion } from 'test/factories/make-questio'

describe('Comment on Question Use Case', async () => {
  let questionCommentsRepository: InMemoryQuestionCommentRepository
  let questionsRepository: InMemoryQuestionRepository
  let sut: CommentQuestionUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    questionsRepository = new InMemoryQuestionRepository()
    sut = new CommentQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('shold be able to commemt a question', async () => {
    const question = makeQuestion({})
    await questionsRepository.create(question)

    const { questionComment } = await sut.execute({
      authorId: '1',
      questionId: question.id.toString(),
      content: 'new question comment content',
    })

    expect(questionComment.id).toBeTruthy()
    expect(questionCommentsRepository.items[0].id).toEqual(questionComment.id)
  })

  it('shold not be able to comment a question with wrong-id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId: 'wrong-id',
        content: 'new question comment content',
      }),
    ).rejects.instanceOf(Error)
  })
})
