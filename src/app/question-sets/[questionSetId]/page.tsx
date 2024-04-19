'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionComponentSkeleton from '~/components/QuestionComponentSkeleton';
import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { QuestionSetType } from '~/interfaces/question-set-type';
import { trpc } from '~/trpc/react';
import QuestionComponent from '../../../components/QuestionComponent';
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon, LucideChevronLeft } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { QuestionType } from '~/interfaces/question-type';

export default function QuestionSetPage() {
  const params = useParams();
  const queryResults = trpc.useQueries((t) => {
    return [
      t.questionSet.getCompleteQuestionSet(Number(params['questionSetId'])),
      t.question.getConfidenceQuestion({ questionSetId: Number(params['questionSetId']) }),
    ];
  });

  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);
  const errors = queryResults.map((result) => result.error);
  const _questionSet = queryResults[0].data;
  const _confidenceQuestion = queryResults[1].data;

  const [questionSet, setQuestionSet] = useState<QuestionSetType | null>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [confidenceQuestion, setConfidenceQuestion] = useState<QuestionType | null>();
  const [confidenceQuestionSubmitted, setConfidenceQuestionSubmitted] = useState(false);

  useEffect(() => {
    if (_questionSet) {
      setQuestionSet(_questionSet as QuestionSetType);
    }

    if (_confidenceQuestion) {
      setConfidenceQuestion(_confidenceQuestion as QuestionType);
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
      let newSet = {
        ...prevQuestionSet,
        questions: prevQuestionSet.questions.map((question) => {
          if (question.id === questionId) {
            let x = {
              ...question,
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

  return (
    <div className='flex flex-col gap-10 mt-10'>
      <div className='flex justify-between'>
        <h1 className='text-4xl'>{questionSet?.title}</h1>
        <Select
          onValueChange={questionIndex => handleQuestionChanged(currentQuestionIndex, Number(questionIndex))}
          value={currentQuestionIndex.toString()}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select User" />
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

      {!confidenceQuestionSubmitted ?
        <QuestionComponent question={confidenceQuestion!}
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
          disabled={currentQuestionIndex === questionSet.questions.length - 1 || !confidenceQuestion!.selectedAnswerId}>
          Next <ChevronRightIcon />
        </Button>
      </div>
      <Button variant={'secondary'} onClick={() => { console.log(questionSet.questions[currentQuestionIndex]!.visits) }}>Print Question Set</Button>
    </div >
  );
}
