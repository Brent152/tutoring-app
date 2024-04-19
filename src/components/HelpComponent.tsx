'use client';

import { useEffect, useRef, useState } from 'react';
import { trpc } from '~/trpc/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { MessageModel } from '~/interfaces/message-model';
import { Senders } from '~/enums/senders.enum';

export default function HelpComponent(props: {
    messages: MessageModel[];
    setMessages: (messages: MessageModel[]) => void;
}) {

    const [lastMessageSentWasUser, setLastMessageSentWasUser] = useState<boolean>(false);
    const { data, isLoading, isError, error, isSuccess } = trpc.openAIRouter.sendMessage.useQuery(props.messages, { enabled: props.messages.length > 0 && lastMessageSentWasUser });

    const messageInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (data?.choices[0]?.message.content) {
            props.setMessages([...props.messages, { id: props.messages.length + 1, text: data.choices[0].message.content, senderId: Senders.Tutor, createdAt: new Date(), updatedAt: null }]);
        }
        setLastMessageSentWasUser(false);
    }, [data]);

    function handleSendPressed() {
        props.setMessages([...props.messages, { id: props.messages.length + 1, text: messageInputRef.current!.value, senderId: Senders.User, createdAt: new Date(), updatedAt: null }]);
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
                            {props.messages.map((message, index) =>
                                <Card key={index} className={`text-lg mt-4 p-3 bg-secondary ${message.senderId === Senders.User ? 'ml-auto bg-secondary' : 'mr-auto'}`}>{message.text}</Card>)
                            }

                            {/* Loading Skeleton */}
                            {isLoading ?
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
