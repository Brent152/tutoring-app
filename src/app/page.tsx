'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "~/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
export const dynamic = "force-dynamic"

export default function HomePage() {

  const [currentUser, setCurrentUser] = useState(null);
  const [currentQuestionSet, setCurrentQuestionSet] = useState(null);

  const router = useRouter();
  const usersQuery = trpc.user.getAll.useQuery();
  const questionSetsQuery = trpc.questionSet.getAll.useQuery();

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState('');

  if (usersQuery.isLoading || questionSetsQuery.isLoading) {
    return (
      <main className="flex flex-col items-center mt-64">
        <Card className="p-5">
          <CardContent className="flex flex-col gap-5 items-end">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (usersQuery.error || questionSetsQuery.error) {
    return <div>Error...</div>;
  }

  const users = usersQuery.data;
  const questionSets = questionSetsQuery.data;

  return (
    <main className="flex flex-col items-center mt-64">
      <Card className="p-5">
        <CardContent className="flex flex-col gap-5">

          <Select
            onValueChange={value => setSelectedUserId(value)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {users!.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            disabled={!selectedUserId}
            onValueChange={value => setSelectedQuestionSetId(value)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Question Set" />
            </SelectTrigger>
            <SelectContent>
              {questionSets!.map(questionSet => (
                <SelectItem key={questionSet.id} value={questionSet.id.toString()}>
                  {questionSet.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-32 ml-auto"
            disabled={!selectedUserId || !selectedQuestionSetId}
            onClick={() => router.push(`/question-sets/${selectedQuestionSetId}`)}>
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
