import { AppBar, Box, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { QuestionSetModel } from '../../models/QuestionSetModel';
import { UserModel } from '../../models/UserModel';
import QuestionsService from '../../services/QuestionsService';
import QuestionCardComponent from './QuestionCardComponent';
import QuestionNavigator from './QuestionDropdownComponent';
import { QuestionModel } from '../../models/QuestionModel';

interface QuestionSetProps {
    setId: string;
    currentUser: UserModel;
}

const QuestionSetComponent: React.FC<QuestionSetProps> = (props) => {

    const [questionSet, setQuestionSet] = useState<QuestionSetModel>();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentConfidenceQuestion, setStudentConfidenceQuestion] = useState<QuestionModel>();
    const [studentConfidenceSubmitted, setStudentConfidenceSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            const result = await QuestionsService.getQuestionSet(props.setId);
            setQuestionSet(result);
            setStudentConfidenceQuestion(QuestionsService.getConfidenceQuestion(result))
            setIsLoading(false);
            console.log(result)
        };

        fetchQuestions();
    }, []);

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>
    }

    if (questionSet?.questions.length === 0) {
        return <Typography variant="h6" component="div">
            No Questions Found
            <Button sx={{ border: 1, marginTop: 5, height: 50, width: '100%' }} onClick={async () => {
                try {
                    const data = await QuestionsService.addQuestions();
                    console.log("Document data:", data);
                } catch (error) {
                    console.error(error);
                }
            }}>
                Add Questions
            </Button>
        </Typography>
    }

    const handleNextPressed = () => {
        if (!questionSet) return;
        if (currentQuestionIndex < questionSet.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousPressed = () => {
        if (!questionSet) return;
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    function handleAnswerChange(questionId: string, answerId: string): void {
        if (!questionSet) return;
        console.log(answerId)
        setQuestionSet(
            {
                ...questionSet,
                questions:
                    questionSet.questions.map((question) => {
                        if (question.id === questionId) {
                            question.selectedAnswerId = answerId;
                        }
                        return question;
                    })
            });
        console.log(questionSet.questions.find(x => x.id === questionId));
    }

    if (!questionSet) {
        return <div>Question Set not found</div>
    }

    return (
        <Box sx={{
            border: 2,
            borderColor: blue[500],
            height: '100%',
            width: '100%'
        }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div">
                        {questionSet.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{
                display: 'flex',
                justifyContent: 'end',
                paddingInline: 5,
                paddingBlock: 3
            }}>
                {studentConfidenceSubmitted && <QuestionNavigator questions={questionSet.questions} currentQuestionIndex={currentQuestionIndex} onQuestionChange={(index) => setCurrentQuestionIndex(index)} />}
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: 5
            }}>
                {studentConfidenceSubmitted ?
                    <QuestionCardComponent question={questionSet?.questions[currentQuestionIndex]} onAnswerChange={handleAnswerChange} />
                    :
                    <>
                        <QuestionCardComponent question={studentConfidenceQuestion!}
                            onAnswerChange={(_, answerId: string) => setStudentConfidenceQuestion(prevState => {
                                if (prevState) {
                                    return {
                                        ...prevState,
                                        selectedAnswerId: answerId
                                    };
                                }
                            })} />
                    </>
                }
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    paddingInline: 3,
                    justifyContent: 'space-between',
                    marginTop: 3
                }}>
                    <Button variant="contained" onClick={handlePreviousPressed} disabled={currentQuestionIndex === 0 || !studentConfidenceSubmitted}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={studentConfidenceSubmitted ? handleNextPressed : () => { setStudentConfidenceSubmitted(true) }} disabled={currentQuestionIndex === questionSet.questions.length - 1 || !studentConfidenceQuestion?.selectedAnswerId}>
                        Next
                    </Button>
                </Box>
            </Box>
            <Button sx={{ border: 1, marginTop: 5, height: 50, width: '100%' }} onClick={async () => {
                try {
                    console.log(currentQuestionIndex)
                } catch (error) {
                    console.error(error);
                }
            }}>TEST BUTTON</Button>
        </Box>
    );
};

export default QuestionSetComponent;