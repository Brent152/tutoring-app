import { type AnswerModel } from "./answer-model";

export interface QuestionModel {
    id: number;
    questionSetId: number;
    text: string;
    answers: AnswerModel[];
    selectedAnswerId: number | null;
    currentlyViewed: boolean;
    visits: { startTime: Date, endTime: Date | null }[];
    createdAt: Date;
    updatedAt: Date | null;
}