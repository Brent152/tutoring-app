import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from "openai";
import { type ChatCompletionMessage, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { Senders } from "~/enums/senders.enum";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAIRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(z.object({
            title: z.string(),
            subject: z.string(),
            description: z.string(),
            questions: z.array(z.object({
                text: z.string(),
                selectedAnswerId: z.number().nullable().optional(),
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
            let messages = input.messages.map((message) => {
                return {
                    role: message.senderId === Senders.Tutor ? "assistant" : "user",
                    content: message.text,
                } as ChatCompletionMessage;
            });

            const contextMessage: ChatCompletionSystemMessageParam = {
                role: "system",
                content: `
                        ${input.messages.length === 1 ?
                        `You are a tutoring assistant, a student is taking a quiz and will be interacting with you in various ways.
                                
                                The following are key points that need to be understood and remembered for all future prompts:
                                
                                ---
                                You will be provided with state information regarding my how I interact with the questions.

                                Your job is to acutely understand my mental state, detect any confusion or misunderstanding I hold, encourage critical thinking.

                                Every time a new information is provided, use past context to build an understanding of my mental state, show me what steps I should take to find the correct answer.

                                Point out simpler mistakes first, to ensure a correction of base understanding before expanding ideas.
                                 ---`
                        :
                        `
                                Use knowledge of the current quiz state to help the student with their question.
                                Do not directly provide the student with quiz answers, find a way to guide them to it.
                                `
                    }

            
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
                    The correct answer is: ${question.answers.find(answer => answer.correct)?.text}.

                    ${question.answers.find(answer => question.selectedAnswerId === answer.id) ?
                    `The student selected: ${question.answers.find(answer => question.selectedAnswerId === answer.id)?.text}` :
                    `The student has not selected an answer yet.`
                    }
                `).join("\n")}
                ---
                `
            }
            console.log("sending api req")
            let completion = await openai.chat.completions.create({
                messages: [contextMessage, ...messages],
                model: "gpt-3.5-turbo",
            });
            console.log(completion)
            return completion;
        }),
});