import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { QuestionSetModel } from '../models/QuestionSetModel';
import { UserModel } from '../models/UserModel';
import QuestionsService from '../services/QuestionsService';
import UserService from '../services/UserService';
import { Link, useNavigate } from 'react-router-dom';

interface StartPageComponentProps {
    setCurrentUser: (user: UserModel) => void;
    currentUser: UserModel | null;
    setCurrentQuestionSet: (user: QuestionSetModel) => void;
    currentQuestionSet: QuestionSetModel | null;
}

const StartPageComponent: React.FC<StartPageComponentProps> = (props) => {

    const [userOptions, setUserOptions] = useState<UserModel[]>();
    const [questionSetOptions, setQuestionSetOptions] = useState<QuestionSetModel[]>();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLookups = async () => {
            setIsLoading(true);
            const users = await UserService.getUsers();
            setUserOptions(users);
            const setOptions = await QuestionsService.getQuestionSetOptions();
            setQuestionSetOptions(setOptions);
            setIsLoading(false);
        };

        fetchLookups();
    }, []);

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        let user = userOptions?.find(user => user.id === event.target.value);
        if (user) {
            props.setCurrentUser(user);
        }
    }

    const handleQuestionSetChange = (event: SelectChangeEvent<string>) => {
        let questionSet = questionSetOptions?.find(set => set.id === event.target.value);
        if (questionSet) {
            props.setCurrentQuestionSet(questionSet);
        }
    }

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>
    }

    if (!userOptions || userOptions.length === 0) {
        return <Typography variant="h6" component="div">No Users Found</Typography>
    }

    if (!questionSetOptions || questionSetOptions.length === 0) {
        return <Typography variant="h6" component="div">No Question Sets Found</Typography>
    }

    return (
        <Box sx={{
            border: 2,
            borderColor: blue[500],
            padding: 5,
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: 5,
                height: '100%',
            }}>
                <FormControl sx={{ minWidth: 400 }}>
                    <InputLabel id="user-dropdown-label">Select User</InputLabel>
                    <Select
                        labelId="user-dropdown-label"
                        id="user-dropdown"
                        value={props?.currentUser?.id || ''}
                        label="Select User"
                        onChange={handleUserChange}
                    >
                        {userOptions.map((userOption, index) => {
                            return <MenuItem key={index} value={userOption.id}>
                                {userOption.firstName} {userOption.lastName}
                            </MenuItem>
                        }
                        )}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 400 }}>
                    <InputLabel id="set-options-dropdown-label">Select Question Set</InputLabel>
                    <Select
                        labelId="set-options-dropdown-label"
                        id="set-options-dropdown"
                        value={props?.currentQuestionSet?.id || ''}
                        label="Select Question Set"
                        onChange={handleQuestionSetChange}
                    >
                        {questionSetOptions.map((setOption, index) => {
                            return <MenuItem key={index} value={setOption.id}>
                                {setOption.title}
                            </MenuItem>
                        }
                        )}
                    </Select>
                </FormControl>
                <Button variant="contained" sx={{alignSelf: 'end'}}
                    disabled={!props.currentUser || !props.currentQuestionSet?.id}
                    onClick={() => navigate(`/question-set/${props.currentQuestionSet!.id}`)}>
                    Start
                </Button>
            </Box>
        </Box>
    );
};

export default StartPageComponent;