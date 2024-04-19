export interface AnswerType {
    id: number;
    text: string;
    questionId: number;
    correct: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}