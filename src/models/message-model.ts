export interface MessageModel {
    id: number;
    text: string;
    senderTypeId: number;
    createdAt: Date;
    updatedAt: Date | null;
}