import { z } from "zod";

export const userInputValidation = z
  .object({
    email: z
      .string()
      .email({ message: "email-id should be valid" })
      .min(5, { message: "email should have atleast 05 charachters" })
      .max(40, { message: "email shouldn't have more than 50 charachters" }),

    password: z
      .string()
      .min(8, { message: "passwords should be atleast 08 charachters" })
      .max(24, { message: "passwords shouldn't be more that 24 charachters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        {
          message:
            "password must contain at least one upper-case letter, one lower-case letter, a number, and a special-character",
        },
      ),
  })
  .strict();

export const userOutputValidation = z.object({
  token: z.string(),
});
