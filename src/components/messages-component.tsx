'use client';

import ReactMarkdown from 'react-markdown';
import { Senders } from '~/enums/senders.enum';
import { MessageModel } from '~/models/message-model';
import { Card } from './ui/card';

export default function MessagesComponent(props: { messages: MessageModel[] }) {
    return (
        <div className='flex flex-col h-auto lg:max-h-[60vh] overflow-y-scroll'>
            {props.messages.map((message, index) =>
                <Card key={index}
                    className={`text-lg whitespace-pre-wrap mt-4 p-3  ${message.senderTypeId as Senders === Senders.User ? 'ml-auto' : 'mr-auto bg-secondary'}`}
                >
                    <ReactMarkdown>
                        {message.text}
                    </ReactMarkdown>
                </Card>)
            }
        </div>
    );
}
