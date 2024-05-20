import { trpc } from "~/trpc/react";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { QuestionModel } from "~/models/question-model";
import { TrashIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { CompletedSessionModel } from "~/models/completed-session-model";
import MessagesComponent from "./messages-component";
import { Card } from "./ui/card";
import ReactMarkdown from "react-markdown";
import { Senders } from "~/enums/senders.enum";
import CardAccordion from "./card-accordion";


export default function SavedSession(props: { session: CompletedSessionModel, onSessionDelete: () => void }) {
    const sessionQuery = trpc.sessionRouter.getCompleteSession.useQuery({ questionSetId: props.session.questionSetId, sessionId: props.session.id });
    const deleteSessionMutation = trpc.sessionRouter.deleteSession.useMutation();

    const [session, setSession] = useState<CompletedSessionModel | null>(null);

    useEffect(() => {
        if (!sessionQuery.data) return;
        setSession(sessionQuery.data as CompletedSessionModel);
        console.log(sessionQuery);
    }, [sessionQuery.data]);

    if (sessionQuery.isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                ))}
                <hr />
                <Skeleton className="h-8 w-full" />
            </div>
        );
    }

    function getQuestionColorClass(question: QuestionModel): string {
        if (question.selectedAnswerId === null) {
            return "";
        }

        if (question.selectedAnswerId === question.correctAnswerId) {
            return "border-green-300";
        }

        return "border-red-300";
    }

    async function handleDeleteClicked() {
        const deleteResult = await deleteSessionMutation.mutateAsync({ sessionId: Number(props.session.id) });
        if (!deleteResult.success) {
            alert("Delete Failed");
            return;
        }
        props.onSessionDelete();
    }

    if (!session) {
        return <div>Load complete, session not found.</div>;
    }

    if (!session.messages) {
        return <div>Load complete, messages not found.</div>;
    }

    return (
        <div className="flex flex-col gap-5">
            <CardAccordion itemValue="questions-accordion" title="Questions" size="medium" expanded={true}>
            <div className="flex flex-col gap-2">
                            {session.questions?.map((question, index) =>
                                <div key={index} className={`border rounded p-2 text-base ${getQuestionColorClass(question)}`}>{index + 1}: {question.text}</div>
                            )}
                        </div>
            </CardAccordion>

            <CardAccordion itemValue="chat-accordion" title="Chat" size="medium">
            <div className="flex flex-col gap-2">
                            <div className='flex flex-col h-auto lg:max-h-[60vh] overflow-y-scroll px-4'>
                                {session.messages.map((message, index) =>
                                    <Card key={index}
                                        className={`text-lg whitespace-pre-wrap mt-4 px-5 py-3  ${message.senderTypeId as Senders === Senders.User ? 'ml-auto text-end' : 'mr-auto bg-secondary'}`}
                                    >
                                        <div className={`text-sm text-secondary-foreground ${message.senderTypeId as Senders === Senders.User ? 'text-end' : ''}`}>
                                            Current Question: {message.currentQuestionId}
                                        </div>
                                        <ReactMarkdown>
                                            {message.text}
                                        </ReactMarkdown>
                                    </Card>)
                                }
                            </div>
                        </div>
            </CardAccordion>

            <div className="flex justify-end mt-6">
                <TrashIcon onClick={handleDeleteClicked} className="cursor-pointer transition-all hover:text-red-300" size={24} />
            </div>
        </div>
    )
}