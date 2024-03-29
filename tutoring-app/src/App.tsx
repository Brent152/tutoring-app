import React from 'react';
import QuestionSetComponent from './components/questions/QuestionSetComponent';
import StartPageComponent from './components/StartPageComponent';
import { UserModel } from './models/UserModel';
import { Typography, Box } from '@mui/material';
import { QuestionSetModel } from './models/QuestionSetModel';

const App: React.FC = () => {

  const [currentUser, setCurrentUser] = React.useState<UserModel | null>(null);
  const [currentQuestionSet, setCurrentQuestionSet] = React.useState<QuestionSetModel | null>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70vw', height: '70vh', margin: 'auto', marginTop: 5 }}>
      {(!currentUser || !currentQuestionSet) && <StartPageComponent
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
        setCurrentQuestionSet={setCurrentQuestionSet}
        currentQuestionSet={currentQuestionSet} />
      }
      {
        currentUser && currentQuestionSet && <>
          <div className='flex justify-between w-full'>
            <div></div>
            <Typography variant="h6" component="div" color="text.secondary" sx={{ marginBottom: 1 }}>{currentUser.firstName} {currentUser.lastName}</Typography>
          </div>

          <QuestionSetComponent setId={currentQuestionSet.id} currentUser={currentUser} />
        </>
      }
    </Box>
  );
}

export default App;