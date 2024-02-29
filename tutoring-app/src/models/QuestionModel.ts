export class QuestionModel {
  id: number;
  question: string;
  answers: string[];

  constructor(id: number, question: string, answers: string[]) {
    this.id = id;
    this.question = question;
    this.answers = answers;
  }
}