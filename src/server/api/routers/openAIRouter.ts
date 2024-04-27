import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, type ChatCompletionMessage } from "openai/resources/index.mjs";
import { z } from "zod";
import { Senders } from "~/enums/senders.enum";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const currentConversationRequests = [] as ChatCompletionMessageParam[][];

export const openAIRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(z.object({
            id: z.number(),
            title: z.string(),
            subject: z.string(),
            description: z.string(),
            questions: z.array(z.object({
                text: z.string(),
                selectedAnswerId: z.number().nullable().optional(),
                currentlyViewed: z.boolean().optional(),
                answers: z.array(z.object({
                    id: z.number(),
                    text: z.string(),
                    correct: z.boolean(),
                })),
            })),
            messages: z.array(z.object({
                id: z.number(),
                text: z.string(),
                senderId: z.number(),
            }))
        }))
        .mutation(async ({ ctx, input }) => {
            const messages = input.messages.map((message) => {
                return {
                    role: message.senderId as Senders === Senders.Tutor ? "assistant" : "user",
                    content: message.text,
                } as ChatCompletionMessage;
            });

            //             const startContextMessage: ChatCompletionSystemMessageParam = {
            //                 role: "system",
            //                 content: `                        
            // You are a tutoring assistant, a student is taking a quiz and will be interacting with you in various ways.

            // The following are key points that need to be understood and remembered for all future prompts:

            // ---
            // You will be provided with state information regarding my how I interact with the questions.

            // Your job is to acutely understand my mental state, detect any confusion or misunderstanding I hold, encourage critical thinking.

            // Every time a new information is provided, use past context to build an understanding of my mental state, show me what steps I should take to find the correct answer.

            // Point out simpler mistakes first, to ensure a correction of base understanding before expanding ideas.
            // ---
            // `
            // };
            const startContextMessage: ChatCompletionSystemMessageParam = {
                role: "system",
                content: `                        
You are a tutoring assistant. A student is taking a quiz and will interact with you in various ways.

Key responsibilities:
- Understand and respond to the student's mental state and confusion.
- Encourage critical thinking and guide the student towards understanding.
- Use context from past interactions to enhance explanations.
- Prioritize correcting fundamental misunderstandings before addressing more complex ideas.
`
            };

//             const repeatedContextMessage: ChatCompletionSystemMessageParam = {
//                 role: "system",
//                 content: `
// Use knowledge of the current quiz state to help the student with their question.
// Do not directly provide the student with quiz answers, find a way to guide them to it.     

            
// CURRENT QUIZ STATE:
// ---
//     Title: ${input.title}

//     Subject: ${input.subject}

//     Description: ${input.description}

//     Questions:
//     ${input.questions.map((question, index) => `
//     Question #${index + 1}: ${question.text}
//     Answers: ${question.answers.map(answer => `
//         ${answer.text}
//     `).join("\n")}
//     The correct answer is: ${question.answers.find(answer => answer.correct)?.text}.

//     ${question.answers.find(answer => question.selectedAnswerId === answer.id) ?
//                         `The student selected: ${question.answers.find(answer => question.selectedAnswerId === answer.id)?.text}` :
//                         `The student has not selected an answer yet.`
//                     }
// `).join("\n")
//                     }
// The student is currently viewing question ${input.questions.findIndex(x => x.currentlyViewed) + 1}.
// ---
// `
//             }

const repeatedContextMessage: ChatCompletionSystemMessageParam = {
    role: "system",
    content: `
Based on the entire history of this quiz session and your understanding of the topics involved, assess whether previous questions answered incorrectly or left unanswered are crucial for understanding the current question. Provide guidance that builds on the student's existing knowledge and encourages critical thinking, without giving direct answers.

CURRENT QUIZ STATE:
---
    Title: ${input.title}
    Subject: ${input.subject}
    Description: ${input.description}

    Questions:
    ${input.questions.map((question, index) => `
        Question #${index + 1}: ${question.text}
        Answers: ${question.answers.map(answer => `
            ${answer.text}
        `).join("\n")}
        ${question.answers.find(answer => question.selectedAnswerId === answer.id) ?
            `The student selected: ${question.answers.find(answer => question.selectedAnswerId === answer.id)?.text}` :
            `The student has not selected an answer yet.`
        }
    `).join("\n")}
    
    The student is currently viewing question ${input.questions.findIndex(x => x.currentlyViewed) + 1}.
---
Assess the relevance of previous misunderstandings or gaps in responses to the current question. Use your judgment to decide if and how to incorporate this into your guidance. If relevant, suggest revisiting specific concepts or questions.”
`
};

            const messagesWithContext = [startContextMessage, ...messages.slice(0, -1), repeatedContextMessage, messages[messages.length - 1]] as ChatCompletionMessageParam[];

            // let completion = await openai.chat.completions.create({
            //     messages: messagesWithContext,
            //     model: "gpt-3.5-turbo",
            // });

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                // model: "gpt-4-turbo",
                messages: messagesWithContext,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
              });

            // Insert to message logs
            // await ctx.db.insert(messageLogs).values({
            //     questionSetId: input.id,
            //     text: messagesWithContext.map(message => `${ message.role }: \n ${ message.content }`).join("\n\n"),
            //     createdAt: new Date(),
            //     updatedAt: new Date(),
            // });

            // currentConversationRequests.push(messagesWithContext);

            return completion;
        }),

    // getBackendMessages: publicProcedure
    //     .input(z.object({ questionSetId: z.number() }))
    //     .mutation(async ({ ctx, input }) => {
    //         return await ctx.db.query.messageLogs.findMany({ where: (fields) => sql`${ fields.questionSetId } = ${ input.questionSetId }` });
    //     }),

    // resetMemoryConversation: publicProcedure.mutation(() => {
    //     currentConversationRequests = [];
    // }),

    // getCurrentConversationRequests: publicProcedure.query(() => {
    //     return currentConversationRequests;
    // }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.questions.findMany();
    }),
});