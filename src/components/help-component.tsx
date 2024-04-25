'use client';

import { useEffect, useRef, useState } from 'react';
import { Senders } from '~/enums/senders.enum';
import { type MessageModel } from '~/interfaces/message-model';
import { trpc } from '~/trpc/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { QuestionSetModel } from '~/interfaces/question-set-model';

export default function HelpComponent(props: {
    questionSet: QuestionSetModel,
    setMessages: (messages: MessageModel[]) => void;
}) {

    const [lastMessageSentWasUser, setLastMessageSentWasUser] = useState<boolean>(false);
    // const { data, isLoading, isError, error, isSuccess } = trpc.openAIRouter.sendMessage.useQuery(props.messages, { enabled: props.messages.length > 0 && lastMessageSentWasUser });
    const sendMessageMutation = trpc.openAIRouter.sendMessage.useMutation();

    const messageInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!lastMessageSentWasUser) return;
        sendMessageMutation.mutateAsync(props.questionSet).then(data => {
            if (data?.choices[0]?.message.content) {
                props.setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: data.choices[0].message.content, senderId: Senders.Tutor, createdAt: new Date(), updatedAt: null }]);
            }
        }).catch(error => {
            console.log(props.questionSet)
            // throw new Error(error);
        });
        setLastMessageSentWasUser(false);
    }, [props.questionSet.messages, sendMessageMutation]);

    function handleSendPressed() {
        props.setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: messageInputRef.current!.value, senderId: Senders.User, createdAt: new Date(), updatedAt: null }]);
        messageInputRef.current!.value = '';
        setLastMessageSentWasUser(true);
    }

    return (
        <Accordion type="single" collapsible className="w-full" >
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    Tutor Chat
                </AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className='flex flex-col'>
                            {/* Messages */}
                            {props.questionSet.messages.map((message, index) =>
                                <Card key={index} className={`text-lg mt-4 p-3  ${message.senderId as Senders === Senders.User ? 'ml-auto' : 'mr-auto bg-secondary'}`}>{message.text}</Card>)
                            }

                            {/* Loading Skeleton */}
                            {sendMessageMutation.isPending ?
                                <Skeleton className="h-12 mb-8 mt-4 w-1/3" /> :
                                <div className='mb-8'></div>
                            }

                            <Input placeholder="Message Tutor" className='' ref={messageInputRef} onKeyDown={event => { if (event.key === 'Enter') handleSendPressed() }} />
                            <Button
                                type='submit'
                                className='w-32 ml-auto mt-3'
                                onClick={handleSendPressed}>
                                Send
                            </Button>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion >

    );
}
