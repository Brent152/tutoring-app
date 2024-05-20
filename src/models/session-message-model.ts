import { MessageModel } from "./message-model";

export interface SessionMessageModel extends MessageModel {
    userId: number;
    questionSetSessionId: number;
}