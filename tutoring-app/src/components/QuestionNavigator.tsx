import { Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import React from 'react';
import { QuestionModel } from '../models/QuestionModel';

interface QuestionSelectorProps {
    questions: QuestionModel[];
    onSelect: (index: number) => void;
}

const QuestionNavigator: React.FC<QuestionSelectorProps> = ({ questions, onSelect }) => {
    return (
        <Paper sx={{ width: '100%', maxWidth: 360, }}>
            <List component="nav" aria-label="question selector">
                {questions.map((_, index) => (
                    <ListItem button key={index} onClick={() => onSelect(index)}>
                        <ListItemText primary={`Question ${index + 1}`} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default QuestionNavigator;