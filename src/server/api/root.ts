import { userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { answerRouter } from "./routers/answer-router";
import { questionRouter } from "./routers/question-router";
import { questionSetRouter } from "./routers/question-set-router";
import { openAIRouter } from "./routers/open-ai-router";
import { sessionRouter } from "./routers/session-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userRouter: userRouter,
  questionSetRouter: questionSetRouter,
  questionRouter: questionRouter,
  answerRouter: answerRouter,
  openAIRouter: openAIRouter,
  sessionRouter: sessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
