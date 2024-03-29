import { AnswerModel } from "./AnswerModel";

export class QuestionModel {
  id: string | null;
  setId: string;
  text: string;
  answers: AnswerModel[];
  correctAnswerId: string;
  selectedAnswerId: string | null = null;

  constructor(id: string | null = null, setId: string = '-1', text: string = "No question text provided", answers: AnswerModel[] = [], correctAnswerId: string, selectedAnswerId: string | null = null) {
    this.id = id;
    this.setId = setId;
    this.text = text;
    this.answers = answers;
    this.correctAnswerId = correctAnswerId;
    this.selectedAnswerId = selectedAnswerId;
  }
}