
'use client';

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { QuestionSetModel } from "~/models/question-set-model";
import { trpc } from "~/trpc/react";

export default function DatabaseManagement() {
    const [jsonInput, setJsonInput] = useState('');
    const [deleteIdInput, setDeleteIdInput] = useState('');
    const insertEntireQuestionSet = trpc.questionSetRouter.insertCompleteQuestionSet.useMutation();
    const deleteEntireQuestionSet = trpc.questionSetRouter.deleteEntireQuestionSet.useMutation();

    const insertQuestionSet = async () => {
        return; // Commented for production
        const questionSet = JSON.parse(jsonInput) as QuestionSetModel;
        const questionSetResult = await insertEntireQuestionSet.mutateAsync(questionSet);
        if (questionSetResult.success) {
            alert("Question set added successfully");
        } else {
            alert("Failed to add question set");
        }
        // const questionSetResult = await insertEntireQuestionSet.mutateAsync(pythonQuiz);
    }

    const deleteQuestionSet = async () => {
        return; // Commented for production
        const deleteResult = await deleteEntireQuestionSet.mutateAsync(Number(deleteIdInput));
        if (deleteResult.success) {
            alert("Deletion successful (to some extent)");
        } else {
            alert("Failed to delete");
        }
        // const questionSetResult = await insertEntireQuestionSet.mutateAsync(pythonQuiz);
    }

    return (
        <main className="flex flex-col gap-5 mt-5">
            {/* <h3>Add Question Set</h3>
            <Textarea
                placeholder="Enter question set json"
                onChange={event => setJsonInput(event.target.value)}
                rows={30}
            />

            <Button className="w-48 ml-auto" onClick={insertQuestionSet}>Add Question Set</Button>

            <h3>Delete Question Set</h3>
            <div className="flex gap-5">
                <Input className="w-32 text-cente" placeholder="Set Id" onChange={event => setDeleteIdInput(event.target.value)}/>
                <Button className="w-48" onClick={deleteQuestionSet}>Delete Question Set</Button>
            </div> */}
        </main>
    );
}