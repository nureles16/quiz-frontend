export interface QuizResult {
  id: number;
  userId: number;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  selectedAnswers: { [questionId: number]: string };
}
