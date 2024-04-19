export interface AnswerModel {
    id: number;
    text: string;
    questionId: number;
    correct: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}