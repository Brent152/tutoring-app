import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.users.findMany()
    }),
});
