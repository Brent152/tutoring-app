import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import StartPageComponent from './components/StartPageComponent';
import QuestionSetComponent from './components/questions/QuestionSetComponent';
import { QuestionSetModel } from './models/QuestionSetModel';
import { UserModel } from './models/UserModel';

const App: React.FC = () => {

  const [currentUser, setCurrentUser] = React.useState<UserModel | null>(null);
  const [currentQuestionSet, setCurrentQuestionSet] = React.useState<QuestionSetModel | null>(null);

  const NavigationGuard: React.FC<{ currentUser: UserModel | null, currentQuestionSet: QuestionSetModel | null }> = ({ currentUser, currentQuestionSet }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!currentUser || !currentQuestionSet) {
        navigate('/');
      }
    }, [currentUser, currentQuestionSet, navigate]);

    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70vw', height: '70vh', margin: 'auto', marginTop: 5 }}>
      <Router>
        <NavigationGuard currentUser={currentUser} currentQuestionSet={currentQuestionSet} />
        <Routes>
          <Route path="/" element={<StartPageComponent
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
            setCurrentQuestionSet={setCurrentQuestionSet}
            currentQuestionSet={currentQuestionSet} />} />
          {currentUser && currentQuestionSet && <Route path="/question-set/:setId" element={<QuestionSetComponent currentUser={currentUser} setId={currentQuestionSet.id} />} />}
        </Routes>
      </Router>
    </Box>
  );
}


export default App;