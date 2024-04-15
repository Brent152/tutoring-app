import { QuestionModel } from "../models/QuestionModel";
import moment from 'moment';

class QuestionsUtility {
  getTotalTimeSpent(question: QuestionModel): string {
    if (!question.visits) return "Question has not been visited";
    return this.formatTime(this.getTotalTimeSpentMS(question));
  }

  getTotalTimeSpentMS(question: QuestionModel): number {
    if (!question.visits) return -1;
    let totalTime = 0;
    const currentTime = new Date().getTime();
    question.visits.forEach(visit => {
      const startTime = new Date(visit.startTime).getTime();
      const endTime = visit.endTime ? new Date(visit.endTime).getTime() : currentTime;
      totalTime += endTime - startTime;
    });
    return totalTime;
  }

  formatTime(ms: number): string {
    const duration = moment.duration(ms);
    const hours = String(duration.hours()).padStart(2, '0');
    const mins = String(duration.minutes()).padStart(2, '0');
    const secs = String(duration.seconds()).padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  }
}

export default new QuestionsUtility();