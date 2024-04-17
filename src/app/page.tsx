'use client';

import { useState } from "react";
import { UserQuizSelectCard } from "~/components/user-quiz-select-card";

export const dynamic = "force-dynamic"

export default function Home() {

  const [currentUser, setCurrentUser] = useState(null);
  const [currentQuestionSet, setCurrentQuestionSet] = useState(null);

  return (
    <main className="flex flex-col items-center">
      <UserQuizSelectCard />
      <div className="">
        test
      </div>
    </main>
  );
}
