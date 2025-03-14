import { Logger } from "@aws-lambda-powertools/logger";
import { PrismaClient } from "db";

// Logger
const logger = new Logger({
  serviceName: "sample-lambda",
  logLevel: "INFO", // LOG_LEVELが無ければ"INFO"
});

// Initialize Prisma client with proper configuration for Lambda
const prisma = new PrismaClient({
  // This helps with Lambda cold starts
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

console.log("✅DATABASE_URL", process.env.DATABASE_URL);

export const handler = async () => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    logger.info(`✅prisma connection: ${result}`);
    logger.info("✅prisma connection: success");
  } catch (err) {
    logger.error(`❌prisma connection: ${err}`);
    throw err; // Re-throw to properly handle the error
  } finally {
    // Important: Disconnect Prisma client to avoid connection issues on subsequent invocations
    await prisma.$disconnect();
  }

  return { statusCode: 200, body: "Lambda executed successfully" };
};
