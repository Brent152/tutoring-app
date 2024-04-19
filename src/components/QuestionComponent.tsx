'use client';

import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { AnswerModel } from '~/interfaces/answer-model';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { QuestionModel } from '~/interfaces/question-model';

export default function QuestionComponent(props: {
    question: QuestionModel | undefined,
    header: string,
    onAnswerChange: (questionId: number, answerId: number) => void
}) {

    if (!props.question) return (<div>No question found</div>);

    return (
        <Card>
            <CardHeader className='text-2xl border-b'>{props.header}</CardHeader>
            <CardContent className='flex flex-col'>
                <h3 className='text-lg my-8'>{props.question.text}</h3>
                <hr />
                <RadioGroup
                    onValueChange={answerId => props.onAnswerChange(props.question!.id, Number(answerId))}
                    value={props.question!.selectedAnswerId?.toString()}>
                    {props.question.answers.map((answer: AnswerModel, index) => (
                        <div key={answer.id} className='flex flex-col'>
                            <div className="flex items-center space-x-3 my-4">
                                <RadioGroupItem value={answer.id.toString()} id={answer.id.toString()} />
                                <Label className='text-lg hover:cursor-pointer' htmlFor={answer.id.toString()}>{answer.text}</Label>
                            </div>
                            {props.question && index < props.question.answers.length - 1 && <hr />}
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
}
