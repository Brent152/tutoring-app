import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from "openai";
import { ChatCompletionMessage, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { Senders } from "~/enums/senders.enum";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAIRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(z.array(z.object({
            id: z.number(),
            text: z.string(),
            senderId: z.number(),
        })))
        .query(async ({ ctx, input }) => {
            let messages = input.map((message) => {
                return {
                    role: message.senderId === Senders.Tutor ? "assistant" : "user",
                    content: message.text,
                } as ChatCompletionMessage;
            });

            // const contextMessage: ChatCompletionSystemMessageParam = {
            //     role: "system",
            //     content: `
            //     ${input.messages.length === 1 ?
            //             `You are a tutoring assistant, a student is taking a quiz and will be interacting with you in various ways.
                    
            //                 The following are key points that need to be understood and remembered for all future prompts:
                            
            //                 ---
            //                 You will be provided with state information regarding my how I interact with the questions.
                        
            //                 Your job is to acutely understand my mental state, detect any confusion or misunderstanding I hold, encourage critical thinking.
                        
            //                 Every time a new information is provided, use past context to build an understanding of my mental state, show me what steps I should take to find the correct answer.
                        
            //                 Point out simpler mistakes first, to ensure a correction of base understanding before expanding ideas.
            //                 ---`
            //             :
            //             `
            //                 Use knowledge of the current quiz state to help the student with their question.
            //                 Do not directly provide the student with quiz answers, find a way to guide them to it.
            //                 `
            //         }

            
            //     CURRENT QUIZ STATE:
            //     ---
            //     Title: ${input.title}

            //     Subject: ${input.subject}

            //     Description: ${input.description}

            //     Questions:
            //      ${input.questions.map((question, index) => `
            //         Question #${index + 1}: ${question.text}
            //         Answers: ${question.answers.map((answer, index) => `
            //             Answer #${index + 1}: ${answer.text}
            //         `).join("\n")}
            //         The correct answer is Answer #${question.answers.findIndex(answer => answer.correct) + 1}.

            //         The student selected Answer #${question.answers.findIndex(answer => question.selectedAnswerId === answer.id) + 1} as their answer.
            //     `).join("\n")}
            //     ---
            //     `
            // }


            let completion = await openai.chat.completions.create({
                messages: messages,
                model: "gpt-3.5-turbo",
            });
            return completion;
        }),
});