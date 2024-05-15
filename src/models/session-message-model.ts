export interface MessageModel {
    id: number;
    userId: number;
    questionSetSessionId: number;
    currentQuestionId: number;
    text: string;
    senderTypeId: number;
    createdAt: Date;
    updatedAt: Date | null;
}