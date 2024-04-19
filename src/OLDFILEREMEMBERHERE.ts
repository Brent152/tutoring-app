// 'use client';

// import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import HelpComponent from '~/components/HelpComponent';
// import QuestionComponentSkeleton from '~/components/QuestionComponentSkeleton';
// import { Button } from '~/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
// import { Skeleton } from '~/components/ui/skeleton';
// import { QuestionModel } from '~/interfaces/question-model';
// import { QuestionSetModel } from '~/interfaces/question-set-model';
// import { trpc } from '~/trpc/react';
// import QuestionComponent from '../../../components/QuestionComponent';
// import { MessageModel } from '~/interfaces/message-model';
// import { Senders } from '~/enums/senders.enum';

// export default function QuestionSetPage() {
//   const params = useParams();

//   const questionSetQueryResults = trpc.useQueries((t) => {
//     return [
//       t.questionSet.getCompleteQuestionSet(Number(params['questionSetId'])),
//       t.question.getConfidenceQuestion({ questionSetId: Number(params['questionSetId']) }),
//     ];
//   });

//   const isLoading = questionSetQueryResults.some((result) => result.isLoading);
//   const isError = questionSetQueryResults.some((result) => result.isError);
//   const errors = questionSetQueryResults.map((result) => result.error);
//   const _questionSet = questionSetQueryResults[0].data;
//   const _confidenceQuestion = questionSetQueryResults[1].data;

//   const [questionSet, setQuestionSet] = useState<QuestionSetModel | null>();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   const [confidenceQuestion, setConfidenceQuestion] = useState<QuestionModel | null>();
//   const [confidenceQuestionSubmitted, setConfidenceQuestionSubmitted] = useState(false);

//   useEffect(() => {
//     if (_questionSet) {
//       setQuestionSet({..._questionSet, messages: []} as QuestionSetModel);
//     }

//     if (_confidenceQuestion) {
//       setConfidenceQuestion(_confidenceQuestion as QuestionModel);
//     }
//   }, [_questionSet, _confidenceQuestion]);

//   if (isError) {
//     console.error(errors);
//     return <div>Error loading question set</div>;
//   }

//   if (isLoading || !questionSet || !confidenceQuestion) {
//     return (
//       <div className='flex flex-col gap-10 mt-10'>
//         <h1 className='text-4xl'><Skeleton className='h-10 w-1/2' /></h1>
//         <QuestionComponentSkeleton />
//       </div>
//     )
//   }

//   const handleQuestionChanged = (currentQuestionIndex: number | null, newQuestionIndex: number | null) => {
//     if (!questionSet) return null;
//     if (currentQuestionIndex !== null) {
//       handleQuestionNavigatedAway(questionSet.questions[currentQuestionIndex]!.id);
//     }
//     if (newQuestionIndex !== null && newQuestionIndex >= 0 && newQuestionIndex < questionSet.questions.length) {
//       setCurrentQuestionIndex(newQuestionIndex);
//       handleQuestionPresented(questionSet.questions[newQuestionIndex]!.id);
//     }
//   };

//   function handleQuestionPresented(questionId: number): void {
//     const currentTime = new Date();
//     setQuestionSet((prevQuestionSet) => {
//       if (!prevQuestionSet) return null;
//       let newSet = {
//         ...prevQuestionSet,
//         questions: prevQuestionSet.questions.map((question) => {
//           if (question.id === questionId) {
//             let x = {
//               ...question,
//               visits: [...question.visits, { startTime: currentTime, endTime: null }],
//             };
//             return x
//           }
//           return question;
//         }),
//       };

//       return newSet
//     });
//   }

//   function handleQuestionNavigatedAway(questionId: number): void {
//     const currentTime = new Date();
//     setQuestionSet((prevQuestionSet) => {
//       if (!prevQuestionSet) return null;
//       return {
//         ...prevQuestionSet,
//         questions: prevQuestionSet.questions.map((question) => {
//           if (question.id === questionId && question.visits.length > 0 && question.visits[question.visits.length - 1]!.endTime === null) {
//             const updatedVisits = [...question.visits];
//             updatedVisits[updatedVisits.length - 1] = { ...updatedVisits[updatedVisits.length - 1]!, endTime: currentTime };
//             return {
//               ...question,
//               visits: updatedVisits,
//             };
//           }
//           return question;
//         }),
//       };
//     });
//   }

//   function handleAnswerChange(questionId: number, answerId: number): void {
//     if (!questionSet) return;
//     setQuestionSet(
//       {
//         ...questionSet,
//         questions:
//           questionSet.questions.map((question) => {
//             if (question.id === questionId) {
//               question.selectedAnswerId = answerId;
//             }

//             return question;
//           })
//       });
//   }

//   return (
//     <div className='flex flex-col gap-10 mt-10'>
//       <div className='flex justify-between'>
//         <h1 className='text-4xl'>{questionSet?.title}</h1>
//         <div className='flex gap-4'>
//           <Select
//             onValueChange={questionIndex => handleQuestionChanged(currentQuestionIndex, Number(questionIndex))}
//             value={currentQuestionIndex.toString()}>
//             <SelectTrigger className="w-64">
//               <SelectValue placeholder="Select User" />
//             </SelectTrigger>
//             <SelectContent>
//               {questionSet.questions.map((_, index) => (
//                 <SelectItem key={index} value={index.toString()}>
//                   Question {index + 1}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <HelpComponent questionSet={questionSet} setQuestionSet={setQuestionSet} />

//       {!confidenceQuestionSubmitted ?
//         <QuestionComponent question={confidenceQuestion!}
//           header={`Confidence Level`}
//           onAnswerChange={(_, answerId) => setConfidenceQuestion(prevState => {
//             if (!prevState) return null;
//             return {
//               ...prevState,
//               selectedAnswerId: answerId
//             };
//           })} />
//         :
//         <QuestionComponent question={questionSet.questions[currentQuestionIndex]}
//           header={`Question ${currentQuestionIndex + 1}`}
//           onAnswerChange={handleAnswerChange} />
//       }
//       <div className='flex justify-between'>
//         <Button
//           className='flex gap-2'
//           onClick={() => handleQuestionChanged(currentQuestionIndex, currentQuestionIndex - 1)}
//           disabled={currentQuestionIndex === 0 || !confidenceQuestionSubmitted}>
//           <ChevronLeftIcon /> Previous
//         </Button>
//         <Button
//           className='flex gap-2'
//           onClick={confidenceQuestionSubmitted ? () => { handleQuestionChanged(currentQuestionIndex, currentQuestionIndex + 1) } : () => { setConfidenceQuestionSubmitted(true); handleQuestionChanged(null, 0) }}
//           disabled={currentQuestionIndex === questionSet.questions.length - 1 || !confidenceQuestion!.selectedAnswerId}>
//           Next <ChevronRightIcon />
//         </Button>
//       </div>
//       <Button variant={'secondary'} onClick={() => { console.log(questionSet.questions[currentQuestionIndex]!.visits) }}>Print Question Set</Button>
//     </div >
//   );
// }


// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { trpc } from '~/trpc/react';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
// import { Button } from './ui/button';
// import { Card, CardContent } from './ui/card';
// import { Skeleton } from './ui/skeleton';
// import { Textarea } from './ui/textarea';
// import { Input } from './ui/input';
// import { MessageModel } from '~/interfaces/message-model';
// import { Senders } from '~/enums/senders.enum';
// import { QuestionSetModel } from '~/interfaces/question-set-model';

// export default function HelpComponent(props: {
//     questionSet: QuestionSetModel;
//     setQuestionSet: (questionSet: QuestionSetModel) => void;
// }) {

//     if (!props.questionSet) return;

//     const [lastMessageSentWasUser, setLastMessageSentWasUser] = useState<boolean>(false);
//     const { data, isLoading, isError, error, isSuccess } = trpc.openAIRouter.sendMessage.useQuery(props.questionSet, { enabled: props.questionSet.messages.length > 0 && lastMessageSentWasUser });

//     const messageInputRef = useRef<HTMLInputElement | null>(null);

//     function setMessages(messages: MessageModel[]) {
//         props.setQuestionSet({ ...props.questionSet, messages: messages });
//     }

//     useEffect(() => {
//         if (data?.choices[0]?.message.content) {
//             setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: data.choices[0].message.content, senderId: Senders.Tutor, createdAt: new Date(), updatedAt: null }]);
//         }
//         setLastMessageSentWasUser(false);
//     }, [data]);

//     function handleSendPressed() {
//         setMessages([...props.questionSet.messages, { id: props.questionSet.messages.length + 1, text: messageInputRef.current!.value, senderId: Senders.User, createdAt: new Date(), updatedAt: null }]);
//         messageInputRef.current!.value = '';
//         setLastMessageSentWasUser(true);
//     }

//     return (
//         <Accordion type="single" collapsible className="w-full" >
//             <AccordionItem value="item-1">
//                 <AccordionTrigger>
//                     Tutor Chat
//                 </AccordionTrigger>
//                 <AccordionContent>
//                     <Card>
//                         <CardContent className='flex flex-col'>
//                             {/* Messages */}
//                             {props.questionSet.messages.map((message, index) =>
//                                 <Card key={index} className={`text-lg mt-4 p-3 bg-secondary ${message.senderId === Senders.User ? 'ml-auto bg-secondary' : 'mr-auto'}`}>{message.text}</Card>)
//                             }

//                             {/* Loading Skeleton */}
//                             {isLoading ?
//                                 <Skeleton className="h-12 mb-8 mt-4 w-1/3" /> :
//                                 <div className='mb-8'></div>
//                             }

//                             <Input placeholder="Message Tutor" className='' ref={messageInputRef} onKeyDown={event => { if (event.key === 'Enter') handleSendPressed() }} />
//                             <Button
//                                 type='submit'
//                                 className='w-32 ml-auto mt-3'
//                                 onClick={handleSendPressed}>
//                                 Send
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </AccordionContent>
//             </AccordionItem>
//         </Accordion >

//     );
// }


// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import OpenAI from "openai";
// import { ChatCompletionMessage, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
// import { Senders } from "~/enums/senders.enum";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const openAIRouter = createTRPCRouter({
//     sendMessage: publicProcedure
//         .input(z.object({
//             title: z.string(),
//             subject: z.string(),
//             description: z.string(),
//             questions: z.array(z.object({
//                 text: z.string(),
//                 selectedAnswerId: z.number().nullable(),
//                 answers: z.array(z.object({
//                     id: z.number(),
//                     text: z.string(),
//                     correct: z.boolean(),
//                 })),
//             })),
//             messages: z.array(z.object({
//                 id: z.number(),
//                 text: z.string(),
//                 senderId: z.number(),
//             }))
//         }))
//         .query(async ({ ctx, input }) => {
//             let messages = input.messages.map((message) => {
//                 return {
//                     role: message.senderId === Senders.Tutor ? "assistant" : "user",
//                     content: message.text,
//                 } as ChatCompletionMessage;
//             });

//             const contextMessage: ChatCompletionSystemMessageParam = {
//                 role: "system",
//                 content: `
//                 ${input.messages.length === 1 ?
//                         `You are a tutoring assistant, a student is taking a quiz and will be interacting with you in various ways.
                    
//                             The following are key points that need to be understood and remembered for all future prompts:
                            
//                             ---
//                             You will be provided with state information regarding my how I interact with the questions.
                        
//                             Your job is to acutely understand my mental state, detect any confusion or misunderstanding I hold, encourage critical thinking.
                        
//                             Every time a new information is provided, use past context to build an understanding of my mental state, show me what steps I should take to find the correct answer.
                        
//                             Point out simpler mistakes first, to ensure a correction of base understanding before expanding ideas.
//                             ---`
//                         :
//                         `
//                             Use knowledge of the current quiz state to help the student with their question.
//                             Do not directly provide the student with quiz answers, find a way to guide them to it.
//                             `
//                     }

            
//                 CURRENT QUIZ STATE:
//                 ---
//                 Title: ${input.title}

//                 Subject: ${input.subject}

//                 Description: ${input.description}

//                 Questions:
//                  ${input.questions.map((question, index) => `
//                     Question #${index + 1}: ${question.text}
//                     Answers: ${question.answers.map((answer, index) => `
//                         Answer #${index + 1}: ${answer.text}
//                     `).join("\n")}
//                     The correct answer is Answer #${question.answers.findIndex(answer => answer.correct) + 1}.

//                     The student selected Answer #${question.answers.findIndex(answer => question.selectedAnswerId === answer.id) + 1} as their answer.
//                 `).join("\n")}
//                 ---
//                 `
//             }
//             console.log(messages)

//             let completion = await openai.chat.completions.create({
//                 // messages: [contextMessage, ...messages],
//                 messages: messages,
//                 model: "gpt-3.5-turbo",
//             });
//             return completion;
//         }),
// });
