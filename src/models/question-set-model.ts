import { type MessageModel } from "./message-model";
import { type QuestionModel } from "./question-model";

export interface QuestionSetModel {
    id: number;
    title: string;
    subject: string;
    description: string;
    questions: QuestionModel[];
    messages: MessageModel[];
    createdAt: Date;
    updatedAt: Date | null;
}