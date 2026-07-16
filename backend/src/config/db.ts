import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("DB connected with prisma");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("DB connection error " + message);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
