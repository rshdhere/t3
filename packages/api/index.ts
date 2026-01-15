// Export tRPC utilities for creating routers
export {
  router,
  publicProcedure,
  protectedProcedure,
  createContext,
} from "./trpc";
export type { Context } from "./trpc";

// Export routers
export { userRouter } from "./routers/user";

// Export type utilities
export type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
