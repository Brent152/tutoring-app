import { sql } from "drizzle-orm";
import { z } from "zod";
import { QuestionModel } from "~/interfaces/question-model";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { questions } from "~/server/db/schema";

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
