import { Session } from "@/lib/types";
import { Question } from "@/types/question";
import SessionClientPage from "@/components/SessionClientPage";

type SessionPageProps = {
  params: { sessionId: string };
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;

  const sessionRes = await fetch(`http://localhost:3000/api/sessions/${sessionId}`);
  const session = await sessionRes.json();

  const questionsRes = await fetch(`http://localhost:3000/api/sessions/${sessionId}/questions`);
  const questions: Question[] = await questionsRes.json();

  return <SessionClientPage session={session} initialQuestions={questions} />;
}