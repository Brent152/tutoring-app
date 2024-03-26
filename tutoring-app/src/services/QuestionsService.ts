import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { AnswerModel } from "../models/AnswerModel";
import { QuestionModel } from "../models/QuestionModel";

class QuestionsService {

    questions: QuestionModel[] = [
        new QuestionModel(
            1,
            1,
            'What is the capital of France?',
            [new AnswerModel(1, 'Paris'), new AnswerModel(2, 'London'), new AnswerModel(3, 'Berlin'), new AnswerModel(4, 'Madrid')]
        ),
        new QuestionModel(
            2,
            1,
            'What is 5 + 10?',
            [new AnswerModel(1, '15'), new AnswerModel(2, '13'), new AnswerModel(3, '22'), new AnswerModel(4, '41')]
        ),
        new QuestionModel(
            3,
            1,
            'What is the capital of France?',
            [new AnswerModel(1, 'Paris'), new AnswerModel(2, 'London'), new AnswerModel(3, 'Berlin'), new AnswerModel(4, 'Madrid')]
        ),
        new QuestionModel(
            4,
            1,
            'What is the capital of Arizona?',
            [new AnswerModel(1, 'Phoenix'), new AnswerModel(2, 'Glendale'), new AnswerModel(3, 'Chandler'), new AnswerModel(4, 'Tempe')]
        ),
        // Add more questions here...
    ];

    async addQuestions() {
        this.questions.forEach(async (question) => {
            try {
                const docRef = doc(collection(db, 'Questions'), question.id.toString());
                await setDoc(docRef, {
                    id: question.id,
                    text: question.text,
                    setId: question.setId,
                    answers: question.answers.map(answer => ({
                        id: answer.id,
                        text: answer.text
                    })),
                    selectedAnswerId: question.selectedAnswerId
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        });
    }


    async getDocument(collection: string, docId: string) {
        const docRef = doc(db, collection, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            throw new Error("No such document!");
        }
    }

    async getQuestionSet(setId: number): Promise<QuestionModel[]> {
        const q = query(collection(db, 'Questions'), where('setId', '==', setId));

        const querySnapshot = await getDocs(q);
        const questions: QuestionModel[] = [];
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            if (docData) {
                const question: QuestionModel = {
                    id: docData.id,
                    setId: docData.setId,
                    text: docData.text,
                    answers: docData.answers,
                    selectedAnswerId: docData.selectedAnswerId,
                };
                questions.push(question);
            }
        });

        return questions;
    }
}

export default new QuestionsService();