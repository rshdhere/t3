import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { createContext } from "@repo/api/trpc";
import { BACKEND_PORT } from "@repo/config";
import { appRouter } from "./index";

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

server.listen(BACKEND_PORT);
console.log(`tRPC server listening on http://localhost:${BACKEND_PORT}`);
