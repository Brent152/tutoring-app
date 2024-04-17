import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { answers, questionSets, questions } from "~/server/db/schema";

export const questionSetRouter = createTRPCRouter({
    insertEntireQuestionSet: publicProcedure
        .input(z.object({
            title: z.string(),
            subject: z.string(),
            description: z.string(),
            questions: z.array(z.object({
                text: z.string(),
                answers: z.array(z.object({
                    text: z.string(),
                    correct: z.boolean(),
                })),
            })),
        }))
        .mutation(async ({ ctx, input }) => {
            const questionSetResult = await ctx.db.insert(questionSets).values({
                subject: input.subject,
                description: input.description,
                title: input.title,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning({ insertedId: questionSets.id});

            const questionSetId = questionSetResult[0]?.insertedId;
            if (!questionSetId) {
                throw new Error("Failed to insert question set");
            }

            for (const question of input.questions) {
                const questionResult = await ctx.db.insert(questions).values({
                    questionSetId,
                    text: question.text,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning({ insertedId: questions.id });

                const questionId = questionResult[0]?.insertedId;
                if (!questionId) {
                    throw new Error("Failed to insert question");
                }

                for (const answer of question.answers) {
                    await ctx.db.insert(answers).values({
                        questionId,
                        text: answer.text,
                        correct: answer.correct,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }

            return { success: true, insertedQuestionSetId: questionSetId};
        }),

    insertQuestionSetRow: publicProcedure
        .input(z.object({
            subject: z.string(),
            description: z.string(),
            title: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.insert(questionSets).values({
                subject: input.subject,
                description: input.description,
                title: input.title,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning({ insertedId: questionSets.id});
        }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.questionSets.findMany()
    })
});
