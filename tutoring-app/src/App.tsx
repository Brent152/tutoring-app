import React from 'react';
import QuestionSet from './components/QuestionSet';

const App: React.FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <QuestionSet setId={1} />
    </div>
  );
}

export default App;