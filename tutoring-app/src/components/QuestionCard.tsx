import { Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState } from 'react';
import { QuestionModel } from '../models/QuestionModel';


const QuestionCard: React.FC<{ question: QuestionModel }> = ({ question }) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue((event.target as HTMLInputElement).value);
    };

    return (
        <div className='flex flex-col gap-4 w-full'>
            <Typography variant="h5" component="div">
                {question.question}
            </Typography>
            <RadioGroup aria-label={question.question} name={`question-${question.id}`} value={selectedValue} onChange={handleChange}
                sx={{
                    flexDirection: 'column',
                    gap: 1
                }}>
                {question.answers.map((answer, index) => (
                    <React.Fragment key={index}>
                        <FormControlLabel value={answer} control={<Radio />} label={answer} />
                        {index < question.answers.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </RadioGroup>
            <Divider />
        </div>

    );
}

export default QuestionCard;