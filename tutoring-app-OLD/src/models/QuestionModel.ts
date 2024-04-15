import { AnswerModel } from "./AnswerModel";

export class QuestionModel {
  constructor(
    public id: string | null = null,
    public setId: string = '-1',
    public text: string = "No question text provided",
    public answers: AnswerModel[] = [],
    public correctAnswerId: string | null = null,
    public selectedAnswerId: string | null = null,
    public visits: { startTime: Date, endTime: Date | null }[] = []
  ) {}
}