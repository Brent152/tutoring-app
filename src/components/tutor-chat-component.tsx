'use client';

import { useEffect, useState } from 'react';
import { Senders } from '~/enums/senders.enum';
import { type MessageModel } from '~/interfaces/message-model';
import { QuestionSetModel } from '~/interfaces/question-set-model';
import { trpc } from '~/trpc/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

export default function TutorChatComponent(props: {
    questionSet: QuestionSetModel,
    setMessages: (messages: MessageModel[]) => void;
}) {

    const [lastMessageSentWasUser, setLastMessageSentWasUser] = useState<boolean>(false);
    const [userMessageInput, setUserMessageInput] = useState<string>('');
    const sendMessageMutation = trpc.openAIRouter.sendMessage.useMutation();

    // const getBackendMemoryConversationQuery = trpc.openAIRouter.getCurrentConversationRequests.useQuery();

    useEffect(() => {
        if (!lastMessageSentWasUser) return;
        sendMessageMutation.mutateAsync(props.questionSet).then(data => {
            if (data?.choices[0]?.message.content) {
                props.setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: data.choices[0].message.content, senderId: Senders.Tutor, createdAt: new Date(), updatedAt: null }]);
            }
        }).catch((error: string) => {
            throw new Error(error);
        });
        setLastMessageSentWasUser(false);
    }, [props.questionSet.messages, sendMessageMutation]);

    function handleSendClicked() {
        props.setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: userMessageInput, senderId: Senders.User, createdAt: new Date(), updatedAt: null }]);
        setUserMessageInput('');
        setLastMessageSentWasUser(true);
    }

    function handleExportFrontendClicked() {
        const data = props.questionSet.messages.map(message => `${message.senderId as Senders === Senders.User ? 'User' : 'Tutor'}:\n${message.text}`).join('\n\n');
        const fileName = 'frontend-conversation.txt';

        const blob = new Blob([data], { type: 'text/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(url);
    }

    // function handleExportBackendClicked() {
    //     let blobData: string | undefined;

    //     // getBackendMessagesMutation.mutateAsync({ questionSetId: props.questionSet.id }).then(data => {
    //     //     blobData = data.map(conversation => `${conversation.id}:::\n\n${conversation.text}`).join('\n\n---\n\n');
    //     // }).catch(error => {
    //     //     throw new Error(error);
    //     // });

    //     blobData = getBackendMemoryConversationQuery.data?.map((request, index) => `Request ${index}:::\n\n${request.map(
    //         message => `${message.role}:\n${message.content}`
    //     ).join('\n\n')}`).join('\n\n---\n\n');
    //     if (blobData === undefined) return console.error('No data to export');

    //     const fileName = 'backend-conversation.txt'; // Replace this with the name of the file you want to download

    //     const blob = new Blob([blobData], { type: 'text/json' });
    //     const url = URL.createObjectURL(blob);

    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = fileName;
    //     link.click();

    //     // It's important to revoke the object URL to avoid memory leaks
    //     URL.revokeObjectURL(url);
    // }

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
                                <Card key={index}
                                    className={`text-lg whitespace-pre-wrap mt-4 p-3  ${message.senderId as Senders === Senders.User ? 'ml-auto' : 'mr-auto bg-secondary'}`}
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
                                    type='button'
                                    variant='secondary'
                                    className='w-32 ml-auto mt-3'
                                    onClick={handleExportFrontendClicked}>
                                    Export Chat
                                </Button>

                                {/* <Button
                                    type='button'
                                    variant='secondary'
                                    className='w-32 ml-auto mt-3'
                                    onClick={handleExportBackendClicked}>
                                    Export Backend Chat
                                </Button> */}

                                <Button
                                    type='submit'
                                    className='w-32 mt-3'
                                    disabled={userMessageInput.length === 0}
                                    onClick={handleSendClicked}>
                                    Send
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion >

    );
}
