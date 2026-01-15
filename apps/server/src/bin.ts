import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { createContext } from "@repo/api/trpc";
import { appRouter } from "./index";

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

const PORT = process.env.PORT || 3001;

server.listen(PORT);
console.log(`tRPC server listening on http://localhost:${PORT}`);
