import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { QuestionModel } from '../../models/QuestionModel';

interface QuestionDropdownProps {
  currentQuestionIndex: number;
  questions: QuestionModel[];
  onQuestionChange: (currentQuestionIndex: number, newQuestionIndex: number) => void;
}

const QuestionNavigator: React.FC<QuestionDropdownProps> = ({ questions, currentQuestionIndex: currentQuestionIndex, onQuestionChange }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | ''>(currentQuestionIndex);

  useEffect(() => {
    setSelectedQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const newQuestionIndex = Number(event.target.value);
    onQuestionChange(currentQuestionIndex, newQuestionIndex);
    setSelectedQuestionIndex(newQuestionIndex);
  };

  return (
    <FormControl>
      <Select
        labelId="question-dropdown-label"
        id="question-dropdown"
        value={selectedQuestionIndex}
        onChange={handleChange}
      >
        {questions.map((_, index) => (
          <MenuItem key={index} value={index}>
            Question {index + 1}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QuestionNavigator;
