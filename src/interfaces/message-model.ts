export interface MessageModel {
    id: number;
    text: string;
    senderId: number;
    createdAt: Date;
    updatedAt: Date | null;
}