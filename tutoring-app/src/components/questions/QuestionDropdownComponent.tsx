import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { QuestionModel } from '../../models/QuestionModel';

interface QuestionDropdownProps {
  currentQuestionIndex: number;
  questions: QuestionModel[];
  onQuestionChange: (questionId: number) => void;
}

const QuestionDropdownComponent: React.FC<QuestionDropdownProps> = ({ questions, currentQuestionIndex: currentQuestionIndex, onQuestionChange }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | ''>(currentQuestionIndex);

  useEffect(() => {
    setSelectedQuestionIndex(currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const questionIndex = Number(event.target.value);
    setSelectedQuestionIndex(questionIndex);
    onQuestionChange(questionIndex);
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

export default QuestionDropdownComponent;
