import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const answerRouter = createTRPCRouter({
    getAnswers: publicProcedure
        .input(z.object({ questionid: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.db.query.answers.findMany({
                where: (answers, { eq }) => eq(answers.questionId, input.questionid),
            })
        }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.answers.findMany()
    })
});
