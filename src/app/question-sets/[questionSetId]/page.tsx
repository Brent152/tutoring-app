'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionComponentSkeleton from '~/components/question-component-skeleton';
import TutorChatComponent from '~/components/tutor-chat-component';
import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { useCurrentUser } from '~/contexts/current-user-provider';
import { Senders } from '~/enums/senders.enum';
import { type MessageModel } from '~/models/message-model';
import { type QuestionModel } from '~/models/question-model';
import { type QuestionSetModel } from '~/models/question-set-model';
import { trpc } from '~/trpc/react';
import QuestionComponent from '../../../components/question-component';

export default function QuestionSetPage() {
  const params = useParams();
  const questionSetQueryResults = trpc.useQueries((t) => {
    return [
      t.questionSetRouter.getCompleteQuestionSet(Number(params.questionSetId)),
      t.questionRouter.getConfidenceQuestion({ questionSetId: Number(params.questionSetId) }),
    ];
  });

  const isLoading = questionSetQueryResults.some((result) => result.isLoading);
  const isError = questionSetQueryResults.some((result) => result.isError);
  const errors = questionSetQueryResults.map((result) => result.error);

  const _questionSet = questionSetQueryResults[0].data;
  const _confidenceQuestion = questionSetQueryResults[1].data;
  const saveNewSession = trpc.sessionRouter.saveNewSession.useMutation();

  const { currentUser, setCurrentUser } = useCurrentUser();

  const [questionSet, setQuestionSet] = useState<QuestionSetModel | null>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [confidenceQuestion, setConfidenceQuestion] = useState<QuestionModel | null>();
  // Temporarily remove confidence question
  const [confidenceQuestionSubmitted, setConfidenceQuestionSubmitted] = useState(true);

  useEffect(() => {
    if (_questionSet) {
      _questionSet.messages = [{
        id: 1,
        text: `Hi there! I'm here to help you navigate through your quiz.\nIf you need explanations or a little nudge in the right direction, just let me know.`,
        currentQuestionId: questionSet?.questions[0]!.id || -1,
        senderTypeId: Senders.Tutor,
        createdAt: new Date(),
        updatedAt: null
      }
    ];
      setQuestionSet(_questionSet);
    }

    if (_confidenceQuestion) {
      // Temporarily remove confidence question
      _confidenceQuestion.selectedAnswerId = 1;
      setConfidenceQuestion(_confidenceQuestion);
    }
  }, [_questionSet, _confidenceQuestion]);

  if (isError) {
    console.error(errors);
    return <div>Error loading question set</div>;
  }

  if (isLoading || !questionSet || !confidenceQuestion) {
    return (
      <div className='flex flex-col gap-10 mt-10'>
        <h1 className='text-4xl'><Skeleton className='h-10 w-1/2' /></h1>
        <QuestionComponentSkeleton />
      </div>
    )
  }

  function setMessages(messages: MessageModel[]) {
    setQuestionSet((prevQuestionSet) => {
      if (!prevQuestionSet) return null;
      return {
        ...prevQuestionSet,
        messages: messages
      };
    });
  }

  const handleQuestionChanged = (currentQuestionIndex: number | null, newQuestionIndex: number | null) => {
    if (!questionSet) return null;
    if (currentQuestionIndex !== null) {
      handleQuestionNavigatedAway(questionSet.questions[currentQuestionIndex]!.id);
    }
    if (newQuestionIndex !== null && newQuestionIndex >= 0 && newQuestionIndex < questionSet.questions.length) {
      setCurrentQuestionIndex(newQuestionIndex);
      handleQuestionPresented(questionSet.questions[newQuestionIndex]!.id);
    }
  };

  function handleQuestionPresented(questionId: number): void {
    const currentTime = new Date();
    setQuestionSet((prevQuestionSet) => {
      if (!prevQuestionSet) return null;
      const newSet = {
        ...prevQuestionSet,
        questions: prevQuestionSet.questions.map((question) => {
          if (question.id === questionId) {
            const x = {
              ...question,
              currentlyViewed: true,
              visits: [...question.visits, { startTime: currentTime, endTime: null }],
            };
            return x
          }
          return question;
        }),
      };

      return newSet
    });
  }

  function handleQuestionNavigatedAway(questionId: number): void {
    const currentTime = new Date();
    setQuestionSet((prevQuestionSet) => {
      if (!prevQuestionSet) return null;
      return {
        ...prevQuestionSet,
        questions: prevQuestionSet.questions.map((question) => {
          if (question.id === questionId && question.visits.length > 0 && question.visits[question.visits.length - 1]!.endTime === null) {
            const updatedVisits = [...question.visits];
            updatedVisits[updatedVisits.length - 1] = { ...updatedVisits[updatedVisits.length - 1]!, endTime: currentTime };
            return {
              ...question,
              currentlyViewed: false,
              visits: updatedVisits,
            };
          }
          return question;
        }),
      };
    });
  }

  function handleAnswerChange(questionId: number, answerId: number): void {
    if (!questionSet) return;
    setQuestionSet(
      {
        ...questionSet,
        questions:
          questionSet.questions.map((question) => {
            if (question.id === questionId) {
              question.selectedAnswerId = answerId;
            }

            return question;
          })
      });
  }

  async function handleSaveSession(): Promise<void> {
    if (!currentUser) throw new Error('User not found');
    if (!questionSet) throw new Error('Question Set not found');
    const questionSetResult = await saveNewSession.mutateAsync({ userId: currentUser.id, questionSetId: questionSet.id, ...questionSet });
    console.log(questionSetResult)
  }

  return (
    <div className='flex flex-col gap-10 mt-10'>
      <div className='flex justify-between'>
        <h1 className='text-4xl'>{questionSet?.title}</h1>
        <div className='flex gap-4 items-center'>
          <Button variant='outline' onClick={handleSaveSession}>Save Session</Button>
          <Select
            onValueChange={questionIndex => handleQuestionChanged(currentQuestionIndex, Number(questionIndex))}
            value={currentQuestionIndex.toString()}>
            <SelectTrigger className="min-w-16 lg:min-w-64">
              <SelectValue placeholder="Select a question" />
            </SelectTrigger>
            <SelectContent>
              {questionSet.questions.map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  Question {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {confidenceQuestionSubmitted && <TutorChatComponent questionSet={questionSet} setMessages={setMessages} currentQuestionId={questionSet.questions[currentQuestionIndex]?.id || -1} />}

      {!confidenceQuestionSubmitted ?
        <QuestionComponent question={confidenceQuestion}
          header={`Confidence Level`}
          onAnswerChange={(_, answerId) => setConfidenceQuestion(prevState => {
            if (!prevState) return null;
            return {
              ...prevState,
              selectedAnswerId: answerId
            };
          })} />
        :
        <QuestionComponent question={questionSet.questions[currentQuestionIndex]}
          header={`Question ${currentQuestionIndex + 1}`}
          onAnswerChange={handleAnswerChange} />
      }
      <div className='flex justify-between'>
        <Button
          className='flex gap-2'
          onClick={() => handleQuestionChanged(currentQuestionIndex, currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0 || !confidenceQuestionSubmitted}>
          <ChevronLeftIcon /> Previous
        </Button>
        <Button
          className='flex gap-2'
          onClick={confidenceQuestionSubmitted ? () => { handleQuestionChanged(currentQuestionIndex, currentQuestionIndex + 1) } : () => { setConfidenceQuestionSubmitted(true); handleQuestionChanged(null, 0) }}
          disabled={currentQuestionIndex === questionSet.questions.length - 1 || !confidenceQuestion.selectedAnswerId}>
          Next <ChevronRightIcon />
        </Button>
      </div>
      {/* <Button variant={'secondary'} onClick={() => { console.log(questionSet.questions[currentQuestionIndex]!.visits) }}>Print Question Set</Button> */}
    </div >
  );
}
