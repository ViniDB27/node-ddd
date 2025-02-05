import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question.repository'
import { makeQuestion } from 'test/factories/make-questio'
import { UniqueEntityId } from '@/core/vos/unique-entity-id.vo'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.usecase'
import { makeAnswer } from 'test/factories/make-answer'

describe('Choose Question Best Answer Use Case', async () => {
  let questionsRepository: InMemoryQuestionRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: ChooseQuestionBestAnswerUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('shold be able to choose the best enswer', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-2'),
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await questionsRepository.create(createQuestion)
    await answersRepository.create(createAnswer)

    const { question } = await sut.execute({
      authorId: 'author-1',
      answerId: createAnswer.id.toString(),
    })

    expect(question.bestAnswerId!.toString()).toEqual(
      createAnswer.id.toString(),
    )
  })

  it('shold not be able to choose the best enswer from another user', async () => {
    const createQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    const createAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-2'),
        questionId: new UniqueEntityId('question-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await questionsRepository.create(createQuestion)
    await answersRepository.create(createAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: createAnswer.id.toString(),
      }),
    ).rejects.instanceOf(Error)
  })

  it('shold be able to choose the best enswer with wrong id', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'wrong-id',
        answerId: 'wrong-id',
      }),
    ).rejects.instanceOf(Error)
  })
})
