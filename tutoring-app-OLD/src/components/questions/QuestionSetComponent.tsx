import { AppBar, Box, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { QuestionSetModel } from '../../models/QuestionSetModel';
import { UserModel } from '../../models/UserModel';
import QuestionsService from '../../services/QuestionsService';
import QuestionCardComponent from './QuestionCardComponent';
import QuestionNavigator from './QuestionDropdownComponent';
import { QuestionModel } from '../../models/QuestionModel';
import QuestionsUtility from '../../utilities/QuestionsUtility';
import ChatGPTService from '../../services/ChatGPTService';

interface QuestionSetProps {
    setId: string;
    currentUser: UserModel;
}

const QuestionSetComponent: React.FC<QuestionSetProps> = (props) => {

    const [questionSet, setQuestionSet] = useState<QuestionSetModel | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentConfidenceQuestion, setStudentConfidenceQuestion] = useState<QuestionModel | null>(null);
    const [studentConfidenceSubmitted, setStudentConfidenceSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            const result = await QuestionsService.getQuestionSet(props.setId);
            setQuestionSet(result);
            setStudentConfidenceQuestion(QuestionsService.getConfidenceQuestion(result))
            setIsLoading(false);
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

    const handleQuestionChanged = (currentQuestionIndex: number | null, newQuestionIndex: number | null) => {
        if (!questionSet) return null;
        if (currentQuestionIndex !== null) {
            handleQuestionNavigatedAway(questionSet.questions[currentQuestionIndex].id!);
        }
        if (newQuestionIndex !== null && newQuestionIndex >= 0 && newQuestionIndex < questionSet.questions.length) {
            setCurrentQuestionIndex(newQuestionIndex);
            handleQuestionPresented(questionSet.questions[newQuestionIndex].id!);
        }
    };

    function handleQuestionPresented(questionId: string): void {
        const currentTime = new Date();
        setQuestionSet((prevQuestionSet) => {
            if (!prevQuestionSet) return null;
            let newSet = {
                ...prevQuestionSet,
                questions: prevQuestionSet.questions.map((question) => {
                    if (question.id === questionId) {
                        if (!question.visits) {
                            question.visits = [];
                        }

                        return {
                            ...question,
                            visits: [...question.visits, { startTime: currentTime, endTime: null }],
                        };
                    }
                    return question;
                }),
            };

            return newSet
        });
    }

    function handleQuestionNavigatedAway(questionId: string): void {
        const currentTime = new Date();
        setQuestionSet((prevQuestionSet) => {
            if (!prevQuestionSet) return null;
            return {
                ...prevQuestionSet,
                questions: prevQuestionSet.questions.map((question) => {
                    if (question.id === questionId && question.visits.length > 0 && question.visits[question.visits.length - 1].endTime === null) {
                        const updatedVisits = [...question.visits];
                        updatedVisits[updatedVisits.length - 1] = { ...updatedVisits[updatedVisits.length - 1], endTime: currentTime };
                        return {
                            ...question,
                            visits: updatedVisits,
                        };
                    }
                    return question;
                }),
            };
        });
    }

    function handleAnswerChange(questionId: string, answerId: string): void {
        if (!questionSet) return;
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
    }

    if (!questionSet) {
        return <div>Question Set not found</div>
    }

    return (
        <Box sx={{
            border: 2,
            borderColor: blue[500],
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
                {studentConfidenceSubmitted && <QuestionNavigator questions={questionSet.questions} currentQuestionIndex={currentQuestionIndex} onQuestionChange={handleQuestionChanged} />}
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: 5
            }}>
                {studentConfidenceSubmitted ?
                    <QuestionCardComponent question={questionSet?.questions[currentQuestionIndex]}
                        onAnswerChange={handleAnswerChange} />
                    :
                    <>
                        <QuestionCardComponent question={studentConfidenceQuestion!}
                            onAnswerChange={(_, answerId: string) => setStudentConfidenceQuestion(prevState => {
                                if (!prevState) return null;
                                return {
                                  ...prevState,
                                  selectedAnswerId: answerId
                                };
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
                    <Button variant="contained"
                        onClick={() => handleQuestionChanged(currentQuestionIndex, currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0 || !studentConfidenceSubmitted}>
                        Previous
                    </Button>
                    <Button variant="contained"
                        onClick={studentConfidenceSubmitted ? () => { handleQuestionChanged(currentQuestionIndex, currentQuestionIndex + 1) } : () => { setStudentConfidenceSubmitted(true); handleQuestionChanged(null, 0) }}
                        disabled={currentQuestionIndex === questionSet.questions.length - 1 || !studentConfidenceQuestion?.selectedAnswerId}>
                        Next
                    </Button>
                </Box>
            </Box>
            <Button sx={{ border: 1, marginTop: 5, height: 50, width: '100%' }} onClick={async () => {
                try {
                    console.log(QuestionsUtility.getTotalTimeSpent(questionSet.questions[currentQuestionIndex]))
                    console.log(questionSet.questions[currentQuestionIndex].visits.length);
                } catch (error) {
                    console.error(error);
                }
            }}>TEST BUTTON</Button>
                        <Button sx={{ border: 1, marginTop: 5, height: 50, width: '100%' }} onClick={async () => {
                try {
                    let result = await ChatGPTService.sendMessageToGPT3("test message");
                    console.log(result);
                } catch (error) {
                    console.error(error);
                }
            }}>Test ChatGPT</Button>
        </Box>
    );
};

export default QuestionSetComponent;