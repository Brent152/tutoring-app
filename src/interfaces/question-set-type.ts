import { QuestionType } from "./question-type";

export interface QuestionSetType {
    id: number;
    title: string;
    subject: string;
    description: string;
    questions: QuestionType[];
    createdAt: Date;
    updatedAt: Date | null;
}