import { PrismaClient } from "./generated/prisma/index";

const prisma = new PrismaClient();

await prisma.user.findMany();
