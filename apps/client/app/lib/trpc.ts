"use client";

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { BACKEND_URL } from "@repo/config/constants";
import type { AppRouter } from "server";

export const trpc = createTRPCReact<AppRouter>();

function getApiUrl() {
  // Use environment variable or default from config
  return process.env.NEXT_PUBLIC_API_URL || BACKEND_URL;
}

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: getApiUrl(),
        headers() {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
