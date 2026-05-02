export interface getQuestions {
  content: string,
  name: string | null,
  sessionId: string,
  createdAt: string,
  id: string,
  upvotes: number
}

export interface createQuestion {
  content: string,
  name?: string,
  sessionId: string,
  createdAt: string
}
