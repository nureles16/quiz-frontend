export interface QuizResult {
  id: number;
  userId: number;
  username: string;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  userAnswers: { [questionId: string]: string };
  correctAnswers: { [questionId: string]: string };
}
