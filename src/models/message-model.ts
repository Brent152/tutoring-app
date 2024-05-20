export interface MessageModel {
    id: number;
    text: string;
    currentQuestionId: number;
    senderTypeId: number;
    createdAt: Date;
    updatedAt: Date | null;
}