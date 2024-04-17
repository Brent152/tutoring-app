import { z } from "zod";
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
        }).returning({ insertedId: questions.id});
    }),


    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.questions.findMany()
    })
});
