'use client';

import { useEffect, useState } from 'react';
import { Senders } from '~/enums/senders.enum';
import { type MessageModel } from '~/models/message-model';
import { QuestionSetModel } from '~/models/question-set-model';
import { trpc } from '~/trpc/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import CardAccordian from './card-accordion';

export default function TutorChatComponent(props: {
    questionSet: QuestionSetModel,
    setMessages: (messages: MessageModel[]) => void;
}) {

    const [lastMessageSentWasUser, setLastMessageSentWasUser] = useState<boolean>(false);
    const [userMessageInput, setUserMessageInput] = useState<string>('');
    const sendMessageMutation = trpc.openAIRouter.sendMessage.useMutation();

    useEffect(() => {
        if (!lastMessageSentWasUser) return;
        sendMessageMutation.mutateAsync(props.questionSet).then(data => {
            if (data?.choices[0]?.message.content) {
                props.setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: data.choices[0].message.content, senderTypeId: Senders.Tutor, createdAt: new Date(), updatedAt: null }]);
            }
        }).catch((error: string) => {
            throw new Error(error);
        });
        setLastMessageSentWasUser(false);
    }, [props.questionSet.messages, sendMessageMutation]);

    function handleSendClicked() {
        props.setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: userMessageInput, senderTypeId: Senders.User, createdAt: new Date(), updatedAt: null }]);
        setUserMessageInput('');
        setLastMessageSentWasUser(true);
    }

    return (
        <CardAccordian title="Tutor Chat">
            <div className='flex flex-col'>
                {/* Messages */}
                {props.questionSet.messages.map((message, index) =>
                    <Card key={index}
                        className={`text-lg whitespace-pre-wrap mt-4 p-3  ${message.senderTypeId as Senders === Senders.User ? 'ml-auto' : 'mr-auto bg-secondary'}`}
                    >
                        {message.text}
                    </Card>)
                }

                {/* Loading Skeleton */}
                {sendMessageMutation.isPending ?
                    <Skeleton className="h-12 mb-8 mt-4 w-1/3" /> :
                    <div className='mb-8'></div>
                }

                <Input placeholder="Message Tutor"
                    value={userMessageInput}
                    className=''
                    onChange={event => setUserMessageInput(event.target.value)}
                    onKeyDown={event => { if (event.key === 'Enter' && userMessageInput.length > 0) handleSendClicked() }} />
                <div className='flex gap-5 ml-auto'>
                    <Button
                        type='submit'
                        className='w-32 mt-3'
                        disabled={userMessageInput.length === 0 || sendMessageMutation.isPending}
                        onClick={handleSendClicked}>
                        Send
                    </Button>
                </div>
            </div>
        </CardAccordian>
    );
}
