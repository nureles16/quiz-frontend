import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8080/api/quiz-results';
  constructor(private http: HttpClient) {}

  submitQuizResult(quizResult: any): Observable<any> {
    const url = `${this.apiUrl}/submit`;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(url, quizResult, { headers }).pipe(
      catchError((error) => {
        console.error('Error submitting quiz result:', error);
        return throwError(() => new Error('Failed to submit quiz result.'));
      })
    );
  }

  getQuizResultsByUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const url = `${this.apiUrl}/user-results`;
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }
    console.log("Token",token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log("Header:",headers)
    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching quiz results:', error);
        return throwError(() => new Error('Failed to fetch quiz results.'));
      })
    );
  }

  deleteQuizResult(resultId: number): Observable<any> {
    console.log(resultId);
    const token = localStorage.getItem('token');
    const url = `${this.apiUrl}/${resultId}`;
    if (!token) {
      console.error('No token found in localStorage.');
      return throwError(() => new Error('User is not authenticated.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting quiz result:', error);
        return throwError(() => new Error('Failed to delete quiz result.'));
      })
    );
  }

  calculateScore(selectedAnswers: { [questionId: number]: string }, id: number): { score: number; total: number } {
    const questions = this.getQuestions(id);
    let score = 0;

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });

    return { score, total: questions.length };
  }


  private quizHistory: any[] = [
    { title: 'Math Quiz', score: 85, date: new Date() },
    { title: 'Science Quiz', score: 90, date: new Date() },
  ];

  getUserQuizHistory(userId: number) {
    return this.quizHistory;
  }
  getQuizzes() {
    return [
      { id: 1, subject: 'Math', title: 'Math Basics I', description: 'Covers fundamental math principles' },
      { id: 2, subject: 'Science', title: 'Introduction to Physics', description: 'Basic concepts in physics' },
      { id: 3, subject: 'History', title: 'World History 101', description: 'A primer on significant historical events' },
      { id: 4, subject: 'Science', title: 'Introduction to Chemistry', description: 'Basics of chemical principles' },
      { id: 5, subject: 'Science', title: 'Introduction to Biology', description: 'Fundamentals of biology and life sciences' },
      { id: 6, subject: 'Computer Science', title: 'Computer Science Basics', description: 'Introduction to programming and algorithms' }
    ];
  }

  getQuestions(id: number) {
    const questions: Record<number, { id: number; subject:string, title:string, question: string; options: string[]; answer: string }[]> = {
      1: [
        { id: 1, subject: 'Math', title: 'Math Basics I', question: 'What is 2 + 2?', options: ['2', '3', '4', '5'], answer: '4' },
        { id: 2, subject: 'Math', title: 'Math Basics I', question: 'What is 5 * 5?', options: ['15', '25', '10', '20'], answer: '25' },
        { id: 3, subject: 'Math', title: 'Math Basics I', question: 'What is 10 - 3?', options: ['6', '7', '8', '5'], answer: '7' },
        { id: 4, subject: 'Math', title: 'Math Basics I', question: 'What is 12 ÷ 4?', options: ['3', '4', '5', '6'], answer: '3' },
        { id: 5, subject: 'Math', title: 'Math Basics I', question: 'What is the square root of 16?', options: ['2', '4', '8', '3'], answer: '4' },
        { id: 6, subject: 'Math', title: 'Math Basics I', question: 'What is 3^3?', options: ['6', '9', '27', '81'], answer: '27' },
        { id: 7, subject: 'Math', title: 'Math Basics I', question: 'What is 15% of 200?', options: ['15', '20', '30', '25'], answer: '30' },
        { id: 8, subject: 'Math', title: 'Math Basics I', question: 'What is the next prime number after 7?', options: ['9', '10', '11', '13'], answer: '11' },
        { id: 9, subject: 'Math', title: 'Math Basics I', question: 'If a triangle has angles of 90° and 45°, what is the third angle?', options: ['45°', '60°', '30°', '90°'], answer: '45°' },
        { id: 10, subject: 'Math', title: 'Math Basics I', question: 'What is the area of a rectangle with length 5 and width 4?', options: ['20', '25', '30', '15'], answer: '20' }
      ],
      2: [
        { id: 1, subject: 'Science', title: 'Introduction to Physics', question: 'What is the speed of light?', options: ['299,792 km/s', '150,000 km/s', '300,000 km/s', '200,000 km/s'], answer: '299,792 km/s' },
        { id: 2, subject: 'Science', title: 'Introduction to Physics', question: 'Who discovered gravity?', options: ['Newton', 'Einstein', 'Galileo', 'Tesla'], answer: 'Newton' },
        { id: 3, subject: 'Science', title: 'Introduction to Physics', question: 'What is the unit of force in the SI system?', options: ['Joule', 'Newton', 'Pascal', 'Watt'], answer: 'Newton' },
        { id: 4, subject: 'Science', title: 'Introduction to Physics', question: 'What is the acceleration due to gravity on Earth?', options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '9.5 m/s²'], answer: '9.8 m/s²' },
        { id: 5, subject: 'Science', title: 'Introduction to Physics', question: 'What is the principle of conservation of energy?', options: ['Energy cannot be created or destroyed', 'Energy can be created from nothing', 'Energy always increases', 'Energy can be lost'], answer: 'Energy cannot be created or destroyed' },
        { id: 6, subject: 'Science', title: 'Introduction to Physics', question: 'Which of the following is a scalar quantity?', options: ['Force', 'Velocity', 'Mass', 'Acceleration'], answer: 'Mass' },
        { id: 7, subject: 'Science', title: 'Introduction to Physics', question: 'What is the formula for calculating kinetic energy?', options: ['KE = 1/2 mv²', 'KE = mv', 'KE = mgh', 'KE = 2mv'], answer: 'KE = 1/2 mv²' },
        { id: 8, subject: 'Science', title: 'Introduction to Physics', question: 'What is the phenomenon of bending of light called?', options: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'], answer: 'Refraction' },
        { id: 9, subject: 'Science', title: 'Introduction to Physics', question: 'What is the relationship between voltage, current, and resistance called?', options: ['Ohm’s Law', 'Newton’s Law', 'Faraday’s Law', 'Kirchhoff’s Law'], answer: 'Ohm’s Law' },
        { id: 10, subject: 'Science', title: 'Introduction to Physics', question: 'What is the measure of the average kinetic energy of particles in a substance?', options: ['Temperature', 'Heat', 'Pressure', 'Energy'], answer: 'Temperature' }
      ],
      3: [
        { id: 1, subject: 'History', title: 'World History 101', question: 'Who was the first President of the USA?', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], answer: 'George Washington' },
        { id: 2, subject: 'History', title: 'World History 101', question: 'What year did World War II end?', options: ['1945', '1939', '1918', '1941'], answer: '1945' },
        { id: 3, subject: 'History', title: 'World History 101', question: 'Who wrote the Declaration of Independence?', options: ['George Washington', 'Thomas Jefferson', 'John Adams', 'Benjamin Franklin'], answer: 'Thomas Jefferson' },
        { id: 4, subject: 'History', title: 'World History 101', question: 'Which empire was ruled by Julius Caesar?', options: ['Byzantine Empire', 'Roman Empire', 'Ottoman Empire', 'Mongol Empire'], answer: 'Roman Empire' },
        { id: 5, subject: 'History', title: 'World History 101', question: 'What year did the Berlin Wall fall?', options: ['1989', '1991', '1985', '1990'], answer: '1989' },
        { id: 6, subject: 'History', title: 'World History 101', question: 'Who was the leader of Nazi Germany during World War II?', options: ['Joseph Stalin', 'Adolf Hitler', 'Winston Churchill', 'Franklin D. Roosevelt'], answer: 'Adolf Hitler' },
        { id: 7, subject: 'History', title: 'World History 101', question: 'What was the name of the ship on which the Pilgrims traveled to America?', options: ['Santa Maria', 'Mayflower', 'Endeavour', 'Victoria'], answer: 'Mayflower' },
        { id: 8, subject: 'History', title: 'World History 101', question: 'Who was known as the “Iron Lady”?', options: ['Margaret Thatcher', 'Queen Elizabeth II', 'Angela Merkel', 'Indira Gandhi'], answer: 'Margaret Thatcher' },
        { id: 9, subject: 'History', title: 'World History 101', question: 'What was the main cause of the American Civil War?', options: ['Slavery', 'Taxation', 'Land disputes', 'Religious differences'], answer: 'Slavery' },
        { id: 10, subject: 'History', title: 'World History 101', question: 'Which country was the first to land a man on the moon?', options: ['USA', 'Russia', 'China', 'France'], answer: 'USA' }
      ],
      4: [
        { id: 1, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the chemical symbol for water?', options: ['H2O', 'O2', 'CO2', 'HO2'], answer: 'H2O' },
        { id: 2, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the atomic number of Hydrogen?', options: ['1', '2', '8', '10'], answer: '1' },
        { id: 3, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the pH of a neutral solution?', options: ['0', '7', '14', '1'], answer: '7' },
        { id: 4, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the formula for table salt?', options: ['NaCl', 'KCl', 'NaOH', 'HCl'], answer: 'NaCl' },
        { id: 5, subject: 'Science', title: 'Introduction to Chemistry', question: 'Which gas is most abundant in Earth’s atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Nitrogen' },
        { id: 6, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the molar mass of water (H2O)?', options: ['18 g/mol', '34 g/mol', '22 g/mol', '16 g/mol'], answer: '18 g/mol' },
        { id: 7, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the process of a liquid changing into a gas called?', options: ['Condensation', 'Evaporation', 'Sublimation', 'Freezing'], answer: 'Evaporation' },
        { id: 8, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the main component of natural gas?', options: ['Methane', 'Ethane', 'Butane', 'Propane'], answer: 'Methane' },
        { id: 9, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the charge of an electron?', options: ['Positive', 'Negative', 'Neutral', 'Double Negative'], answer: 'Negative' },
        { id: 10, subject: 'Science', title: 'Introduction to Chemistry', question: 'What is the periodic table?', options: ['A chart of elements', 'A calendar', 'A chemical equation', 'A list of compounds'], answer: 'A chart of elements' }
      ],
      5: [
        { id: 1, subject: 'Science', title: 'Introduction to Biology', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 'Mitochondria' },
        { id: 2, subject: 'Science', title: 'Introduction to Biology', question: 'What is the basic unit of life?', options: ['Tissue', 'Organ', 'Cell', 'Organism'], answer: 'Cell' },
        { id: 3, subject: 'Science', title: 'Introduction to Biology', question: 'Which organ is responsible for pumping blood in the body?', options: ['Brain', 'Liver', 'Heart', 'Lungs'], answer: 'Heart' },
        { id: 4, subject: 'Science', title: 'Introduction to Biology', question: 'What type of macromolecule are enzymes?', options: ['Carbohydrates', 'Proteins', 'Lipids', 'Nucleic acids'], answer: 'Proteins' },
        { id: 5, subject: 'Science', title: 'Introduction to Biology', question: 'What is the process by which plants make their own food?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], answer: 'Photosynthesis' },
        { id: 6, subject: 'Science', title: 'Introduction to Biology', question: 'What is the primary function of red blood cells?', options: ['Transport oxygen', 'Fight infections', 'Clot blood', 'Store energy'], answer: 'Transport oxygen' },
        { id: 7, subject: 'Science', title: 'Introduction to Biology', question: 'What is the largest organ in the human body?', options: ['Liver', 'Heart', 'Skin', 'Brain'], answer: 'Skin' },
        { id: 8, subject: 'Science', title: 'Introduction to Biology', question: 'Which part of the plant is responsible for photosynthesis?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], answer: 'Leaves' },
        { id: 9, subject: 'Science', title: 'Introduction to Biology', question: 'What is DNA short for?', options: ['Deoxyribonucleic Acid', 'Deoxyribose Nucleotide Acid', 'Diacid Nucleic Acid', 'Double Helix Acid'], answer: 'Deoxyribonucleic Acid' },
        { id: 10, subject: 'Science', title: 'Introduction to Biology', question: 'What is the study of animals called?', options: ['Botany', 'Ecology', 'Zoology', 'Genetics'], answer: 'Zoology' }
      ],
      6: [
        { id: 1, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Control Processing Unit', 'Computer Processing Unit', 'Central Power Unit'], answer: 'Central Processing Unit' },
        { id: 2, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What is the primary purpose of an operating system?', options: ['Manage hardware and software', 'Run games', 'Store data', 'Connect to the internet'], answer: 'Manage hardware and software' },
        { id: 3, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'Hyperlink and Text Management Language', 'High-Level Text Machine Language', 'HyperText Machine Language'], answer: 'HyperText Markup Language' },
        { id: 4, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What is the binary representation of the decimal number 5?', options: ['101', '110', '111', '100'], answer: '101' },
        { id: 5, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What does RAM stand for?', options: ['Random Access Memory', 'Read-Only Memory', 'Run Access Memory', 'Random Active Memory'], answer: 'Random Access Memory' },
        { id: 6, subject: 'Computer Science', title: 'Computer Science Basics', question: 'Which of the following is a programming language?', options: ['HTML', 'Python', 'CSS', 'HTTP'], answer: 'Python' },
        { id: 7, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What is the smallest unit of data in a computer?', options: ['Bit', 'Byte', 'Nibble', 'Word'], answer: 'Bit' },
        { id: 8, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What is an algorithm?', options: ['A programming language', 'A set of instructions', 'A computer part', 'A type of memory'], answer: 'A set of instructions' },
        { id: 9, subject: 'Computer Science', title: 'Computer Science Basics', question: 'What does the term “cloud computing” refer to?', options: ['Storing data on the internet', 'A weather forecasting system', 'A local storage solution', 'A type of programming'], answer: 'Storing data on the internet' },
        { id: 10, subject: 'Computer Science', title: 'Computer Science Basics', question: 'Which protocol is used to browse the web?', options: ['HTTP', 'FTP', 'SMTP', 'TCP'], answer: 'HTTP' }
      ]
    };
    return questions[id];
  }
}
