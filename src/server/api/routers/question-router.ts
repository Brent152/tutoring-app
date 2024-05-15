import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { QuestionModel } from "~/models/question-model";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, questions, sessionAnswers } from "~/server/db/schema";

export const questionRouter = createTRPCRouter({
    insertQuestion: publicProcedure
        .input(z.object({
            questionSetId: z.number(),
            text: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(questions).values({
                questionSetId: input.questionSetId,
                text: input.text,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning({ insertedId: questions.id });
        }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.questions.findMany();
    }),

    getCompletedQuestions: publicProcedure
    .input(z.object({sessionId: z.number(), questionSetId: z.number()}))
    .query(async ({ ctx, input }) => {
        return await ctx.db
        .select({
            id: questions.id,
            questionSetId: questions.questionSetId,
            text: questions.text,
            createdAt: questions.createdAt,
            updatedAt: questions.updatedAt,
            correctAnswerId: answers.id,
            selectedAnswerId: sessionAnswers.selectedAnswerId,
        })
        .from(questions)
        .leftJoin(answers, eq(answers.questionId, questions.id))
        .innerJoin(sessionAnswers, and(eq(sessionAnswers.sessionId, input.sessionId), eq(sessionAnswers.questionId, questions.id)))
        .where((fields) => and(eq(fields.questionSetId, input.questionSetId), answers.correct));
    }),

    getConfidenceQuestion: publicProcedure
        .input(z.object({
            questionSetId: z.number(),
        }))
        .query(async ({ ctx, input }) => {
            const questionSetSubject = (await ctx.db.query.questionSets.findFirst({ where: (fields) => sql`${fields.id} = ${input.questionSetId}` }))?.subject ?? "Subject not found";
            return {
                id: -1,
                questionSetId: -1,
                text: `Rate your level of expertise in ${questionSetSubject}:`,
                answers: [
                    { id: 1, text: "None - Never heard of it" },
                    { id: 2, text: "Basic - Heard of it, but that\'s about it" },
                    { id: 3, text: "Familiar - Basic understanding" },
                    { id: 4, text: "Comfortable with the basics" },
                    { id: 5, text: "Proficient - Good working knowledge" },
                    { id: 6, text: "Advanced - Deep understanding" },
                    { id: 7, text: "Expert - Comprehensive and detailed knowledge" },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            } as QuestionModel;
        }),
});
