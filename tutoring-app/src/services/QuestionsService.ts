import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { AnswerModel } from "../models/AnswerModel";
import { QuestionModel } from "../models/QuestionModel";
import { QuestionSetModel } from "../models/QuestionSetModel";

class QuestionsService {

    randomQuestions: QuestionModel[] = [
        new QuestionModel(
            null,
            '1',
            'What is the capital of France?',
            [new AnswerModel('1', 'Paris'), new AnswerModel('2', 'London'), new AnswerModel('3', 'Berlin'), new AnswerModel('4', 'Madrid')],
            '1'
        ),
        new QuestionModel(
            null,
            '1',
            'What is 5 + 10?',
            [new AnswerModel('1', '15'), new AnswerModel('2', '13'), new AnswerModel('3', '22'), new AnswerModel('4', '41')],
            '1'
        ),
        new QuestionModel(
            null,
            '1',
            'What is the capital of France?',
            [new AnswerModel('1', 'Paris'), new AnswerModel('2', 'London'), new AnswerModel('3', 'Berlin'), new AnswerModel('4', 'Madrid')],
            '1'
        ),
        new QuestionModel(
            null,
            '1',
            'What is the capital of Arizona?',
            [new AnswerModel('1', 'Phoenix'), new AnswerModel('2', 'Glendale'), new AnswerModel('3', 'Chandler'), new AnswerModel('4', 'Tempe')],
            '1'
        ),
        // Add more questions here...
    ];

    trigQuestions: QuestionModel[] = [
        new QuestionModel(
            null,
            '2',
            'What is the sine of 30 degrees?',
            [new AnswerModel('1', '1/2'), new AnswerModel('2', '√3/2'), new AnswerModel('3', '√2/2'), new AnswerModel('4', '3/2')],
            '1'
        ),
        new QuestionModel(
            null,
            '2',
            'What is the cosine of 45 degrees?',
            [new AnswerModel('1', '√3/2'), new AnswerModel('2', '1/√2'), new AnswerModel('3', '1/2'), new AnswerModel('4', '2/√3')],
            '2'
        ),
        new QuestionModel(
            null,
            '2',
            'What is the tangent of 60 degrees?',
            [new AnswerModel('1', '√3'), new AnswerModel('2', '1/√3'), new AnswerModel('3', '√3/3'), new AnswerModel('4', '3')],
            '1'
        ),
        new QuestionModel(
            null,
            '2',
            'In a right-angled triangle, if the angle is 45 degrees, what is the ratio of the opposite side to the hypotenuse?',
            [new AnswerModel('1', '1:√2'), new AnswerModel('2', '1:1'), new AnswerModel('3', '1:2'), new AnswerModel('4', '√2:1')],
            '1'
        ),
        new QuestionModel(
            null,
            '2',
            'In a right-angled triangle, if one angle is 30 degrees and the opposite side is 4, what is the length of the hypotenuse?',
            [new AnswerModel('1', '8'), new AnswerModel('2', '4√3'), new AnswerModel('3', '8√3'), new AnswerModel('4', '4')],
            '2'
        ),
        new QuestionModel(
            null,
            '2',
            'Which trigonometric ratio is equivalent to opposite/adjacent?',
            [new AnswerModel('1', 'Sine'), new AnswerModel('2', 'Cosine'), new AnswerModel('3', 'Tangent'), new AnswerModel('4', 'Cotangent')],
            '3'
        ),
        new QuestionModel(
            null,
            '2',
            'In a right-angled triangle, if the adjacent side is 5 and the hypotenuse is 10, what is the cosine of the angle?',
            [new AnswerModel('1', '1/2'), new AnswerModel('2', '2'), new AnswerModel('3', '1'), new AnswerModel('4', '5')],
            '1'
        ),
        new QuestionModel(
            null,
            '2',
            'In a right triangle, if the angles are 30, 60, and 90 degrees, what is the ratio of the sides opposite these angles?',
            [new AnswerModel('1', '1:2:√3'), new AnswerModel('2', '1:√3:2'), new AnswerModel('3', '√3:1:2'), new AnswerModel('4', '1:√2:2')],
            '2'
        ),
        new QuestionModel(
            null,
            '2',
            'What is the sine of 90 degrees?',
            [new AnswerModel('1', '1'), new AnswerModel('2', '0'), new AnswerModel('3', '√2/2'), new AnswerModel('4', '√3/2')],
            '1'
        ),
        new QuestionModel(
            null,
            '2',
            'What is the tangent of an angle if the sine is 1/2 and the cosine is √3/2?',
            [new AnswerModel('1', '√3/3'), new AnswerModel('2', '1/√3'), new AnswerModel('3', '1/√2'), new AnswerModel('4', '√3')],
            '2'
        )
    ];

    async addQuestions() {
        this.trigQuestions.forEach(async (question) => {
            try {
                const docRef = doc(collection(db, 'Questions'));
                await setDoc(docRef, {
                    text: question.text,
                    questionSetId: question.setId,
                    answers: question.answers.map(answer => ({
                        id: answer.id,
                        text: answer.text
                    })),
                    correctAnswerId: question.correctAnswerId,
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

    async getQuestionSet(setId: string): Promise<QuestionSetModel> {
        const questionsQuery = query(collection(db, 'Questions'), where('questionSetId', '==', setId));
        const questionsQuerySnapshot = await getDocs(questionsQuery);
        const questions: QuestionModel[] = [];
        questionsQuerySnapshot.forEach((doc) => {
            const docData = doc.data();
            if (docData) {
                const question: QuestionModel = {
                    id: doc.id,
                    setId: docData.questionSetId,
                    text: docData.text,
                    answers: docData.answers,
                    correctAnswerId: docData.correctAnswerId,
                    selectedAnswerId: docData.selectedAnswerId,
                };
                questions.push(question);
            }
        });

        const questionSetDocRef = doc(db, 'QuestionSets', setId.toString());
        const questionSetDocSnap = await getDoc(questionSetDocRef);

        if (!questionSetDocSnap.exists()) {
            throw new Error("No such document!");
        }

        const questionSetDocData = questionSetDocSnap.data();

        return new QuestionSetModel(
            questionSetDocSnap.id,
            questionSetDocData.title,
            questionSetDocData.subject,
            questionSetDocData.description,
            questions
        );
    }

    async getQuestionSetOptions(): Promise<QuestionSetModel[]> {
        const q = query(collection(db, 'QuestionSets'));
        const querySnapshot = await getDocs(q);
        const questionSetOptions: QuestionSetModel[] = [];
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const questionSetModel: QuestionSetModel = {
                id: doc.id,
                title: docData.title,
                subject: docData.subject,
                description: docData.description,
                questions: []
            }
            questionSetOptions.push(questionSetModel);
        });
        return questionSetOptions;
    }

    getConfidenceQuestion(questionSet: QuestionSetModel): QuestionModel {
        return new QuestionModel(
            '-1',
            '-1',
            `Rate your level of expertise in ${questionSet.subject}:`,
            [
                new AnswerModel('1', 'None - Never heard of it'),
                new AnswerModel('2', 'Basic - Heard of it, but that\'s about it'),
                new AnswerModel('3', 'Familiar - Basic understanding'),
                new AnswerModel('4', 'Competent - Comfortable with the basics'),
                new AnswerModel('5', 'Proficient - Good working knowledge'),
                new AnswerModel('6', 'Advanced - Deep understanding'),
                new AnswerModel('7', 'Expert - Comprehensive and detailed knowledge')
            ],
            '-1'
        );
    }
}

export default new QuestionsService();