import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { type AnswerModel } from "~/models/answer-model";
import { type QuestionSetModel } from "~/models/question-set-model";
import { type QuestionModel } from "~/models/question-model";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, sessions, questionSets, questions, sessionAnswers, sessionMessages } from "~/server/db/schema";

export const sessionRouter = createTRPCRouter({

    getSessionOptions: publicProcedure
    .query(async ({ ctx }) => {
        const sessions = await ctx.db.query.sessions.findMany();
        return sessions;
    }),

    deleteSession: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const foundSession = await ctx.db.query.sessions.findFirst({
            where: (fields) => sql`${fields.id} = ${input.sessionId}`
        });

        if (!foundSession) {
            throw new Error("Session set not found");
        }

        await ctx.db.delete(sessionAnswers).where(eq(sessionAnswers.sessionId, foundSession.id));      
        await ctx.db.delete(sessionMessages).where(eq(sessionMessages.sessionId, foundSession.id));      
        await ctx.db.delete(sessions).where(eq(sessions.id, foundSession.id));      

        return { success: true };
    }),

    saveNewSession: publicProcedure
        .input(z.object({
            userId: z.number(),
            questionSetId: z.number(),
            currentQuestionId: z.number(),
            title: z.string(),
            subject: z.string(),
            description: z.string(),
            questions: z.array(z.object({
                id: z.number(),
                selectedAnswerId: z.number().nullable(),
                text: z.string(),
                answers: z.array(z.object({
                    text: z.string(),
                    correct: z.boolean(),
                })),
            })),
            messages: z.array(z.object({
                text: z.string(),
                senderTypeId: z.number(),
            })),
        }))
        .mutation(async ({ ctx, input }) => {
            const sessionResult = await ctx.db.insert(sessions).values({
                userId: input.userId,
                questionSetId: input.questionSetId,
            }).returning({ insertedId: sessions.id });

            const sessionId = sessionResult[0]?.insertedId;
            if (!sessionId) {
                throw new Error("Failed to insert question set session");
            }

            for (const question of input.questions) {
                const questionResult = await ctx.db.insert(sessionAnswers).values({
                    sessionId: sessionId,
                    userId: input.userId,
                    questionId: question.id,
                    selectedAnswerId: question.selectedAnswerId,
                }).returning({ insertedId: sessionAnswers.id });

                const questionId = questionResult[0]?.insertedId;
                if (!questionId) {
                    throw new Error("Failed to insert session answer for question id: " + question.id);
                }
            }

            for (const message of input.messages) {
                const messageResult = await ctx.db.insert(sessionMessages).values({
                    sessionId: sessionId,
                    userId: input.userId,
                    currentQuestionId: input.currentQuestionId,
                    text: message.text,
                    senderTypeId: message.senderTypeId,
                }).returning({ insertedId: sessionMessages.id });

                const messageId = messageResult[0]?.insertedId;
                if (!messageId) {
                    throw new Error("Failed to insert session message");
                }
            }

            return { success: true, insertedQuestionSetSessionId: sessionId};
        }),
});
