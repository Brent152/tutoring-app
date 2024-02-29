import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useState } from 'react';
import { QuestionModel } from '../models/QuestionModel';
import QuestionCard from './QuestionCard';
import QuestionNavigator from './QuestionNavigator';

interface QuestionSetProps {
    questions: QuestionModel[];
}

const QuestionSet: React.FC<QuestionSetProps> = ({ questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const onQuestionNavigate = () => (index: number) => {
        setCurrentQuestionIndex(index)
    }

    
    return (
        <Box sx={{
            height: '90vh',
            width: '80vw',
            border: 2,
            borderColor: blue[500],
        }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        Test Quiz
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingInline: 5,
                paddingBlock: 3
            }}>
                <div>Temp Space</div>

                <QuestionNavigator questions={questions} onSelect={onQuestionNavigate()} />
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: 5
            }}>
                <QuestionCard question={questions[currentQuestionIndex]} />
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    paddingInline: 3,
                    justifyContent: 'space-between',
                    marginTop: 3
                }}>
                    <Button variant="contained" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                        Next
                    </Button>
                </Box>
            </Box>

        </Box>
    );
};

export default QuestionSet;