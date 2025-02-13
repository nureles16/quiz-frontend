export interface Question {
  id: number;
  subject: string;
  title: string;
  question: string;
  options: string[];
  topics: string[];
  answer: string;
  quizId: number;
}
