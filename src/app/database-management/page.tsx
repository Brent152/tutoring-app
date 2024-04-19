
'use client';

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { trpc } from "~/trpc/react";
export const dynamic = "force-dynamic"

export default function DatabaseManagement() {
    const insertEntireQuestionSet = trpc.questionSet.insertCompleteQuestionSet.useMutation();

    const insertPythonQuiz = async () => {
        const questionSetResult = await insertEntireQuestionSet.mutateAsync(pythonQuiz);
        console.log(questionSetResult)
    }

    return (
        <main className="">
            <Button disabled onClick={insertPythonQuiz}>Add Python Quiz</Button>
        </main>
    );
}

const pythonQuiz = {
    title: "Python Fundamentals Challenge",
    subject: "Python Fundamentals",
    description: "Welcome to the Python Fundamentals Challenge! This quiz is designed to test your knowledge of Python basics as you transition from other programming languages. Perfect for those who understand general coding concepts but are new to Python's unique syntax and standard libraries. Dive in and see how well you grasp the essentials!",
    questions: [
        {
            text: "What will be the output of the following code: print(type(3.0))?",
            answers: [
                { text: "<class 'int'>", correct: false },
                { text: "<class 'float'>", correct: true },
                { text: "<class 'string'>", correct: false },
                { text: "<class 'char'>", correct: false }
            ]
        },
        {
            text: "Which operator is used for floor division in Python?",
            answers: [
                { text: "/", correct: false },
                { text: "*", correct: false },
                { text: "//", correct: true },
                { text: "%", correct: false }
            ]
        },
        {
            text: "What does the following code return: bool(\"False\")?",
            answers: [
                { text: "False", correct: false },
                { text: "None", correct: false },
                { text: "True", correct: true },
                { text: "Error", correct: false }
            ]
        },
        {
            text: "How can you create a comment in Python?",
            answers: [
                { text: "/* comment */", correct: false },
                { text: "<!-- comment -->", correct: false },
                { text: "# comment", correct: true },
                { text: "// comment", correct: false }
            ]
        },
        {
            text: "What is the correct way to define a function in Python?",
            answers: [
                { text: "function myFunc():", correct: false },
                { text: "def myFunc():", correct: true },
                { text: "create myFunc():", correct: false },
                { text: "func myFunc():", correct: false }
            ]
        },
        {
            text: "Which of the following is a mutable object in Python?",
            answers: [
                { text: "(\"tuple\",)", correct: false },
                { text: "\"string\"", correct: false },
                { text: "{1, 2, 3}", correct: true },
                { text: "3.5", correct: false }
            ]
        },
        {
            text: "How do you create a list in Python that contains the numbers 1 through 5?",
            answers: [
                { text: "list = [1, 2, 3, 4, 5]", correct: true },
                { text: "list = (1, 2, 3, 4, 5)", correct: false },
                { text: "list = {1, 2, 3, 4, 5}", correct: false },
                { text: "list = <1, 2, 3, 4, 5>", correct: false }
            ]
        },
        {
            text: "What is the output of the following code: print(8 == 8.0)?",
            answers: [
                { text: "True", correct: true },
                { text: "False", correct: false },
                { text: "None", correct: false },
                { text: "Error", correct: false }
            ]
        },
        {
            text: "What is used to handle exceptions in Python?",
            answers: [
                { text: "handle / except", correct: false },
                { text: "try / except", correct: true },
                { text: "try / handle", correct: false },
                { text: "error / catch", correct: false }
            ]
        },
        {
            text: "Which module can be imported to work with regular expressions?",
            answers: [
                { text: "re", correct: true },
                { text: "regex", correct: false },
                { text: "string", correct: false },
                { text: "text", correct: false }
            ]
        }
    ]
}     