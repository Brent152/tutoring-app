// import React from 'react';
// import { Button } from '@mui/material';
// import { collection } from 'firebase/firestore';

// const PrintQuestionsButton: React.FC = () => {
//     const firestore = useFirestore();
//     const questionsRef = collection(firestore, 'questions');
//     const questions = useFirestoreCollectionData(questionsRef);

//     const handleButtonClick = () => {
//         console.log(questions);
//     };

//     return (
//         <Button onClick={handleButtonClick}>
//             Print Questions from Firestore
//         </Button>
//     );
// };

// export default PrintQuestionsButton;