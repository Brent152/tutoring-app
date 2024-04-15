import { QuestionModel } from "./QuestionModel";

export class QuestionSetModel {
  id: string;
  title: string;
  subject: string;
  description: string;
  questions: QuestionModel[];

  constructor(id: string,
    title: string = 'No title provided',
    subject: string = 'No subject provided',
    description: string = 'No description provided',
    questions: QuestionModel[] = []
  ) {
    this.id = id;
    this.title = title;
    this.subject = subject;
    this.description = description;
    this.questions = questions || [];
  }
}