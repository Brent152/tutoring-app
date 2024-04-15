import { Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react';
import { QuestionModel } from '../../models/QuestionModel';

interface QuestionCardProps {
    question: QuestionModel;
    onAnswerChange: (questionId: string, answerId: string) => void;
}

const QuestionCardComponent: React.FC<QuestionCardProps> = (props) => {
    if (props.question.id === null) {
        return <Typography variant="h6" component="div">Invalid Question</Typography>
    }

    return (
        <div className='flex flex-col gap-4 w-full'>
            <Typography variant="h5" component="div">
                {props.question.text}
            </Typography>
            
            <RadioGroup aria-label={props.question.text}
                name={`question-${props.question.id}`}
                radioGroup={`question-${props.question.id}`}
                value={props.question.selectedAnswerId}
                onChange={(_, value) => { props.onAnswerChange(props.question.id!, value) }}
                sx={{ flexDirection: 'column', gap: 1 }}>
                {props.question.answers.map((answer, index) => (
                    <React.Fragment key={index}>
                        <FormControlLabel value={answer.id} control={<Radio />} label={answer.text} />
                        {index < props.question.answers.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </RadioGroup>
            <Divider />
        </div>

    );
}

export default QuestionCardComponent;