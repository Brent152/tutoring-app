import React, { FC } from 'react';
import Option from './Option';
import RadioGroup from './RadioGroup';

interface QuizCardProps {
  question: string;
  options: string[];
}

const QuizCard: FC<QuizCardProps> = ({ question, options }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 w-full">
      <div className="px-3 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{question}</h3>
        <RadioGroup options={options} />
      </div>
    </div>
  );
}

export default QuizCard;