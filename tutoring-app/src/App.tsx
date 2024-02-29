import React from 'react';
import QuestionSet from './components/QuestionSet';
import { QuestionModel } from './models/QuestionModel';

const App: React.FC = () => {
  const questions: QuestionModel[] = [
    new QuestionModel(
      1,
      'What is the capital of France?',
      ['Paris', 'London', 'Berlin', 'Madrid']
    ),
    new QuestionModel(
      2,
      'What is 5 + 10?',
      ['15', '13', '22', '41']
    ),
    new QuestionModel(
      3,
      'What is the capital of France?',
      ['Paris', 'London', 'Berlin', 'Madrid']
    ),
    // Add more questions here...
  ];

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <QuestionSet questions={questions} />
    </div>
  );
}

export default App;