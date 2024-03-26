import { AnswerModel } from "./AnswerModel";

export class QuestionModel {
  id: number;
  setId: number;
  text: string;
  answers: AnswerModel[];
  selectedAnswerId: number | null = null;

  constructor(id: number, setId: number = -1, text: string = "No question text provided", answers: AnswerModel[] = [], selectedAnswerId: number | null = null) {
    this.id = id;
    this.setId = setId;
    this.text = text;
    this.answers = answers;
    this.selectedAnswerId = selectedAnswerId;
  }
}