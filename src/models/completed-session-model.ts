import { QuestionModel } from "./question-model";
import { SessionMessageModel } from "./session-message-model";
import { SessionModel } from "./session-model";
import { UserModel } from "./user-model";

export interface CompletedSessionModel extends SessionModel {
    questionSetTitle: string;
    user: UserModel;
    questions?: QuestionModel[];
    messages?: SessionMessageModel[];
  }