import { AnswerType } from "./answer-type";

export interface QuestionType {
    id: number;
    questionSetId: number;
    text: string;
    answers: AnswerType[];
    selectedAnswerId: number | null;
    visits: { startTime: Date, endTime: Date | null }[];
    createdAt: Date;
    updatedAt: Date | null;
}