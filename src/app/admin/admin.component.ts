import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Quizzes} from "../models/quizz.model";
import {Question} from "../models/question.model";
import {QuizService} from "../services/quiz.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
type EditableQuiz = Quizzes & {
  editing?: boolean;
  original: Quizzes;
};
type EditableQuestion = Question & {
  editing?: boolean;
  original: Question;
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  quizzes: EditableQuiz[] = [];
  selectedQuiz: EditableQuiz | null = null;
  selectedQuizQuestions: EditableQuestion[] = [];
  originalQuizData: { [id: number]: EditableQuiz } = {};
  originalQuestionData: { [id: number]: EditableQuestion } = {};
  showQuizForm: boolean = false;
  showQuestionForm: boolean = false;

  newQuiz: Quizzes = {
    id: 0,
    subject: '',
    title: '',
    description: '',
  };

  newQuestion: Question = {
    id: 0,
    subject: '',
    title: '',
    question: '',
    options: ['', '', '', ''],
    topics: [],
    answer: '',
    quizId: 0,
  };


  constructor(private quizService: QuizService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getQuizzes().subscribe(
      (data) => {
        this.quizzes = data.map((quiz) => ({
          ...quiz,
          editing: false,
          original: { ...quiz },
        }));
      },
      (error) => console.error('Error loading quizzes:', error)
    );
  }

  getQuestionsForQuiz(quizId: number): void {
    this.quizService.getQuestions(quizId).subscribe(
      (data) => {
        this.selectedQuiz = this.quizzes.find((q) => q.id === quizId) || null;
        this.selectedQuizQuestions = data.map((question) => ({
          ...question,
          editing: false,
          original: { ...question },
        }));
      },
      (error) => console.error('Error loading questions:', error)
    );
  }

  isQuizChanged(quiz: EditableQuiz): boolean {
    return this.hasQuizChanged(quiz);
  }

  isQuestionChanged(question: EditableQuestion): boolean {
    return this.hasQuestionChanged(question);
  }

  hasQuizChanged(quiz: EditableQuiz): boolean {
    return (
      quiz.title.trim() !== quiz.original.title.trim() ||
      quiz.subject.trim() !== quiz.original.subject.trim() ||
      quiz.description.trim() !== quiz.original.description.trim()
    );
  }

  hasQuestionChanged(question: EditableQuestion): boolean {
    return (
      question.question.trim() !== question.original.question.trim() ||
      JSON.stringify(question.options) !== JSON.stringify(question.original.options) ||
      question.answer.trim() !== question.original.answer.trim()
    );
  }



  editQuiz(quiz: EditableQuiz): void {
    this.originalQuizData[quiz.id] = { ...quiz }; // Save original data
    quiz.editing = true;
    this.cdr.detectChanges();
  }

  cancelEditQuiz(quiz: EditableQuiz): void {
    Object.assign(quiz, this.originalQuizData[quiz.id]); // Restore original
    quiz.editing = false;
    this.cdr.detectChanges();
  }


  updateQuiz(quiz: EditableQuiz): void {
    this.quizService.updateQuiz(quiz.id, quiz).subscribe(
      () => {
        quiz.editing = false;
        quiz.original = { ...quiz };
        console.log('Quiz updated successfully');
      },
      (error) => console.error('Error updating quiz:', error)
    );
  }

  editQuestion(question: EditableQuestion): void {
    this.originalQuestionData[question.id] = { ...question };
    question.editing = true;
  }

  cancelEditQuestion(question: EditableQuestion): void {
    Object.assign(question, this.originalQuestionData[question.id]); // Restore original
    question.editing = false;
  }


  updateQuestion(question: EditableQuestion): void {
    this.quizService.updateQuestion(question.id, question).subscribe(
      () => {
        question.editing = false;
        question.original = { ...question };
        console.log('Question updated successfully');
      },
      (error) => console.error('Error updating question:', error)
    );
  }

  deleteQuiz(quizId: number): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.deleteQuiz(quizId).subscribe(
        () => {
          this.quizzes = this.quizzes.filter((quiz) => quiz.id !== quizId);
          console.log('Quiz deleted successfully');
        },
        (error: any) => console.error('Error deleting quiz:', error)
      );
    }
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.quizService.deleteQuestion(questionId).subscribe(
        () => {
          this.selectedQuizQuestions = this.selectedQuizQuestions.filter(
            (question) => question.id !== questionId
          );
          console.log('Question deleted successfully');
        },
        (error: any) => console.error('Error deleting question:', error)
      );
    }
  }

  toggleQuizForm(): void {
    this.showQuizForm = !this.showQuizForm;
  }

  toggleQuestionForm(): void {
    this.showQuestionForm = !this.showQuestionForm;
  }

  addQuiz(): void {
    this.quizService.addQuiz(this.newQuiz).subscribe(
      (addedQuiz) => {
        this.quizzes.push({ ...addedQuiz, editing: false, original: { ...addedQuiz } });
        console.log('Quiz added successfully');
        this.newQuiz = {
          id: 0,
          subject: '',
          title: '',
          description: '',
        };
        this.showQuizForm = false;
      },
      (error) => console.error('Error adding quiz:', error)
    );
  }

  addQuestion(): void {
    if (this.selectedQuiz) {
      this.newQuestion.quizId = this.selectedQuiz.id;
      this.quizService.addQuestion(this.newQuestion).subscribe(
        (addedQuestion) => {
          this.selectedQuizQuestions.push({ ...addedQuestion, editing: false, original: { ...addedQuestion } });
          console.log('Question added successfully');
          this.newQuestion = {
            id: 0,
            subject: '',
            title: '',
            question: '',
            options: ['', '', '', ''],
            topics: [],
            answer: '',
            quizId: 0,
          };
          this.showQuestionForm = false;
        },
        (error) => console.error('Error adding question:', error)
      );
    }
  }

}
