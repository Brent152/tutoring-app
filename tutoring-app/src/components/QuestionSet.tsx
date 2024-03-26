import { AppBar, Box, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { QuestionModel } from '../models/QuestionModel';
import QuestionsService from '../services/QuestionsService';
import QuestionCard from './QuestionCard';
import QuestionNavigator from './QuestionDropdown';

interface QuestionSetProps {
    setId: number;
}

const QuestionSet: React.FC<QuestionSetProps> = (props) => {

    const [questions, setQuestions] = useState<QuestionModel[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            const result = await QuestionsService.getQuestionSet(1);
            setQuestions(result);
            console.log(questions)
        };

        fetchQuestions();
    }, []);

    if (questions.length === 0) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>
    }

    const handleNextPressed = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousPressed = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    function handleAnswerChange(questionId: number, answerId: number): void {
        console.log(answerId)
        setQuestions(questions.map((question) => {
            if (question.id === questionId) {
                question.selectedAnswerId = answerId;
            }
            return question;
        }));
        console.log(questions.find(x => x.id === questionId));
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
                justifyContent: 'end',
                paddingInline: 5,
                paddingBlock: 3
            }}>
                <QuestionNavigator questions={questions} currentQuestionIndex={currentQuestionIndex} onQuestionChange={(index) => setCurrentQuestionIndex(index)} />
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: 5
            }}>
                {<QuestionCard question={questions[currentQuestionIndex] ?? new QuestionModel(-1)} onAnswerChange={handleAnswerChange} />}
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    paddingInline: 3,
                    justifyContent: 'space-between',
                    marginTop: 3
                }}>
                    <Button variant="contained" onClick={handlePreviousPressed} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNextPressed} disabled={currentQuestionIndex === questions.length - 1}>
                        Next
                    </Button>
                </Box>
            </Box>
            {/* <Button sx={{ border: 1, marginTop: 5, height: 50, width: '100%' }} onClick={async () => {
                try {
                    const data = await QuestionsService.getQuestionSet(1);
                    console.log("Document data:", data);
                } catch (error) {
                    console.error(error);
                }
            }}>
                TEST BUTTON
            </Button> */}
        </Box>
    );
};

export default QuestionSet;