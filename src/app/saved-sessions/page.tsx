'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import CardAccordion from '~/components/card-accordion';
import SavedSession from '~/components/saved-session';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { CompletedSessionModel } from '~/models/completed-session-model';
import { QuestionModel } from '~/models/question-model';
import { SessionModel } from '~/models/session-model';
import { UserModel } from '~/models/user-model';
import { trpc } from '~/trpc/react';

export default function SavedSessionsPage() {
  const [selectedUserId, setSelectedUserId] = useState("-1");
  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState("-1");

  const [allSessions, setAllSessions] = useState<CompletedSessionModel[]>([]);
  const [shownSessions, setShownSessions] = useState<CompletedSessionModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sessionOptionsQuery = trpc.sessionRouter.getSessionOptions.useQuery();
  const usersQuery = trpc.userRouter.getAll.useQuery();
  const questionSetsQuery = trpc.questionSetRouter.getAll.useQuery();

  useEffect(() => {
    if (!(sessionOptionsQuery.isLoading && questionSetsQuery.isLoading && usersQuery.isLoading)) {
      setIsLoading(false);
    }

    if (!(sessionOptionsQuery.data && questionSetsQuery.data && usersQuery.data)) return;

    const sessionOptions = sessionOptionsQuery.data;
    const questionSets = questionSetsQuery.data;
    const users = usersQuery.data;

    const sessions = sessionOptions.map((sessionOption) => {
      return {
        ...sessionOption,
        questionSetTitle: questionSets.find(x => x.id === sessionOption.questionSetId)?.title,
        user: users.find(x => x.id === sessionOption.userId),
      } as CompletedSessionModel;
    });

    setAllSessions(sessions);
    setShownSessions(sessions);
    setIsLoading(false);
  }, [sessionOptionsQuery.data, questionSetsQuery.data]);

  useEffect(() => {
    if (isLoading) return;

    let filteredSessions = allSessions;

    if (selectedUserId !== "-1") {
      filteredSessions = filteredSessions.filter(x => x.userId.toString() === selectedUserId);
    }

    if (selectedQuestionSetId !== "-1") {
      filteredSessions = filteredSessions.filter(x => x.questionSetId.toString() === selectedQuestionSetId);
    }

    setShownSessions(filteredSessions);
  }, [selectedUserId, selectedQuestionSetId, allSessions])

  if (isLoading) {
    return (
      <div className='flex flex-col gap-10 mt-10'>
        <div className="p-5 flex gap-5">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
    );
  }

  if (sessionOptionsQuery.error ?? questionSetsQuery.error) {
    return <div>Error...</div>;
  }

  const users = usersQuery.data;
  const questionSets = questionSetsQuery.data;

  return (
    <div className='flex flex-col gap-10 mt-10'>
      <div className="border rounded-md p-5 flex gap-3">

        <Select
          onValueChange={value => setSelectedUserId(value)}
          value={selectedUserId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select User Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={-1} value={"-1"}>{"Any User"}</SelectItem>
            {users!.map(user => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={value => setSelectedQuestionSetId(value)}
          value={selectedQuestionSetId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Question Set Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={-1} value={"-1"}>{"Any Question Set"}</SelectItem>
            {questionSets!.map(questionSet => (
              <SelectItem key={questionSet.id} value={questionSet.id.toString()}>
                {questionSet.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-5'>
        {shownSessions.map((session) => (
          <CardAccordion
            key={session.id}
            title={session.questionSetTitle}
            subTitle={`${session.user.firstName} ${session.user.lastName} - ${format(session.createdAt, 'MM/dd/yyyy HH:mm')}`}
            itemValue={session.id.toString()}>
            <SavedSession session={session} onSessionDelete={() => setAllSessions(prevState => prevState.filter(x => x.id !== session.id))} />
          </CardAccordion>
        ))}
      </div>
    </div>
  );
}
