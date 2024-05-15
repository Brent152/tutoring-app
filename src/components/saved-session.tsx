import { BuiltSessionModel } from "~/app/saved-sessions/page";
import { trpc } from "~/trpc/react";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { QuestionModel } from "~/models/question-model";
import { TrashIcon } from "lucide-react";


export default function SavedSession(props: { session: BuiltSessionModel, onSessionDelete: () => void}) {
    const questionsQuery = trpc.questionRouter.getCompletedQuestions.useQuery({ questionSetId: props.session.questionSetId, sessionId: props.session.id });
    const deleteSessionMutation = trpc.sessionRouter.deleteSession.useMutation();

    const [questions, setQuestions] = useState<QuestionModel[] | null>(null);

    useEffect(() => {
        if (!questionsQuery.data) return;
        setQuestions(questionsQuery.data as QuestionModel[]);
        console.log(questionsQuery);
    }, [questionsQuery.data]);

    if (questionsQuery.isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                ))}
            </div>
        );
    }

    function getAnswerColorClass(question: QuestionModel): string {
        if (question.selectedAnswerId === null) {
            return "";
        }

        if (question.selectedAnswerId === question.correctAnswerId) {
            return "border-green-300";
        }

        return "border-red-300";
    }

    async function handleDeleteClicked() {
        const deleteResult = await deleteSessionMutation.mutateAsync({sessionId: Number(props.session.id)});
        if (!deleteResult.success) {
            alert("Delete Failed");
            return;
        }
        props.onSessionDelete();
    }

    return (
        <div className="flex flex-col gap-2">
            {questions?.map((question, index) =>
                <div key={index} className={`border rounded p-2 ${getAnswerColorClass(question)}`}>{index + 1}: {question.text}</div>
            )}

            <div className="flex justify-end mt-6">
                <TrashIcon onClick={handleDeleteClicked} className="cursor-pointer transition-all hover:text-red-300" size={24} />
            </div>
        </div>
    )
}