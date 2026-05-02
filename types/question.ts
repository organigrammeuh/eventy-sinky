export interface QuestionCreation {
  content: string,
  name?: string,
  sessionId: string,
  createdAt: string
}

export interface Question extends QuestionCreation {
  id: string
  upvotes: number
}

export type GetQuestion = Question;
