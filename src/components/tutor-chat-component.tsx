'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Senders } from '~/enums/senders.enum';
import { type MessageModel } from '~/models/message-model';
import { QuestionSetModel } from '~/models/question-set-model';
import { trpc } from '~/trpc/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import CardAccordion from './card-accordion';

export default function TutorChatComponent(props: {
    questionSet: QuestionSetModel,
    setMessages: (messages: MessageModel[]) => void;
    currentQuestionId: number;
}) {
    const messagesRef = useRef<HTMLDivElement>(null);

    const [lastMessageSentWasUser, setLastMessageSentWasUser] = useState<boolean>(false);
    const [userMessageInput, setUserMessageInput] = useState<string>('');
    const sendMessageMutation = trpc.openAIRouter.sendMessage.useMutation();

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
        }

        if (!lastMessageSentWasUser) return;

        sendMessageMutation.mutateAsync(props.questionSet).then(data => {
            if (data?.choices[0]?.message.content) {
                props.setMessages([...props.questionSet.messages,
                {
                    id: props.questionSet.messages.length + 1,
                    text: data.choices[0].message.content,
                    currentQuestionId: props.currentQuestionId,
                    senderTypeId: Senders.Tutor,
                    createdAt: new Date(),
                    updatedAt: null
                }]);
            }
        }).catch((error: string) => {
            throw new Error(error);
        });
        setLastMessageSentWasUser(false);
    }, [props.questionSet.messages, sendMessageMutation.isPending]);

    function handleSendClicked() {
        props.setMessages([...props.questionSet.messages,
        {
            id: props.questionSet.messages.length + 1,
            text: userMessageInput,
            currentQuestionId: props.currentQuestionId,
            senderTypeId: Senders.User,
            createdAt: new Date(),
            updatedAt: null
        }
        ]);
        setUserMessageInput('');
        setLastMessageSentWasUser(true);
    }

    return (
        <CardAccordion title="Tutor Chat" itemValue="chat-accordion" size='large'>
            <div className='flex flex-col'>
                {/* Messages */}
                <div ref={messagesRef} className='flex flex-col h-auto lg:max-h-[60vh] overflow-y-scroll px-4'>
                    {props.questionSet.messages.map((message, index) =>
                        <Card key={index}
                            className={`text-lg whitespace-pre-wrap mt-4 px-5 py-3  ${message.senderTypeId as Senders === Senders.User ? 'ml-auto' : 'mr-auto bg-secondary'}`}
                        >
                            <ReactMarkdown>
                                {message.text}
                            </ReactMarkdown>
                        </Card>)
                    }

                    {/* Loading Skeleton */}
                    {sendMessageMutation.isPending ?
                        <Skeleton className="whitespace-pre-wrap p-6 mb-8 mt-4 w-1/3" /> :
                        <div className='mb-8'></div>
                    }
                </div>

                <Input placeholder="Message Tutor"
                    value={userMessageInput}
                    className='mt-3'
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
        </CardAccordion>
    );
}
