import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam, type ChatCompletionMessage } from "openai/resources/index.mjs";
import { z } from "zod";
import { Senders } from "~/enums/senders.enum";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from 'fs';
import path from 'path';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
                isCurrentlyViewed: z.boolean().optional(),
                answers: z.array(z.object({
                    id: z.number(),
                    text: z.string(),
                    correct: z.boolean(),
                })),
            })),
            messages: z.array(z.object({
                id: z.number(),
                text: z.string(),
                senderTypeId: z.number(),
            }))
        }))
        .mutation(async ({ ctx, input }) => {
            const messages = input.messages.map((message) => {
                return {
                    role: message.senderTypeId as Senders === Senders.Tutor ? "assistant" : "user",
                    content: message.text,
                } as ChatCompletionMessage;
            });

            const promptsPath = path.join(process.cwd(), 'src/prompts');
            const startContextMessage: ChatCompletionSystemMessageParam = {
                role: "system",
                content: fs.readFileSync(path.join(promptsPath, 'startContextMessage.txt'), 'utf8')
            };

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
    
    The student is currently viewing question ${input.questions.findIndex(x => x.isCurrentlyViewed) + 1}.
---
Assess the relevance of previous misunderstandings or gaps in responses to the current question. Use your judgment to decide if and how to incorporate this into your guidance. If relevant, suggest revisiting specific concepts or questions.
Prioritize shorter messages at a time to encourage student engagement.
Do not arbitrarily repeat questions or answers.
DO NOT PROMPT ABOUT FUTURE QUESTIONS.
`
            };

            const messagesWithContext = [startContextMessage, ...messages.slice(0, -1), repeatedContextMessage, messages[messages.length - 1]] as ChatCompletionMessageParam[];

            const completion = await openai.chat.completions.create({
                // model: "gpt-3.5-turbo",
                // model: "gpt-4-turbo",
                model: "gpt-4o",
                messages: messagesWithContext,
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            return completion;
        }),


    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.questions.findMany();
    }),
});