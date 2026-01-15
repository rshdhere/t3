import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { router, publicProcedure, JWT_SECRET } from "../trpc.js";
import { userOutputValidation, userInputValidation } from "@repo/validators";
import { prismaClient } from "@repo/store";

export const userRouter = router({
  signup: publicProcedure
    .output(userOutputValidation)
    .input(userInputValidation)
    .mutation(async (opts) => {
      const email = opts.input.email;
      const password = opts.input.password;

      const userAlreadyExists = await prismaClient.user.findFirst({
        where: { email },
      });

      if (userAlreadyExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "user already exists, try signing-in",
        });
      }

      const hash = await Bun.password.hash(password);

      const user = await prismaClient.user.create({
        data: {
          email: email,
          passwordHash: hash,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token };
    }),

  login: publicProcedure
    .output(userOutputValidation)
    .input(userInputValidation)
    .mutation(async (opts) => {
      const email = opts.input.email;
      const password = opts.input.password;

      const user = await prismaClient.user.findFirst({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "user not found",
        });
      }

      const passwordMatched = await Bun.password.verify(
        password,
        user.passwordHash,
      );

      if (!passwordMatched) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "invalid credentials",
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token };
    }),
});
