
export interface SessionModel {
    id: number;
    userId: number;
    questionSetId: number;
    createdAt: Date;
    updatedAt: Date | null;
}