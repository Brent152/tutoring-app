
export interface UserAnswerModel {
    id: number;
    userId: number;
    questionSetSessionId: number;
    questionId: number;
    selectedAnswerId: number;
    createdAt: Date;
    updatedAt: Date | null;
}