import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { router, publicProcedure, JWT_SECRET } from "../trpc";
import {
  userSignupOutputValidation,
  userSignupValidation,
} from "@repo/validators";
import { prismaClient } from "@repo/store";

export const userRouter = router({
  signup: publicProcedure
    .output(userSignupOutputValidation)
    .input(userSignupValidation)
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
});
