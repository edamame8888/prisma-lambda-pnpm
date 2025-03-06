import { Logger } from "@aws-lambda-powertools/logger";
import { PrismaClient } from "db";

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

export const main = async () => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.info(`✅prisma connection: ${JSON.stringify(result)}`);
    console.info("✅prisma connection: success");
  } catch (err) {
    console.error(`❌prisma connection: ${err}`);
    throw err; // Re-throw to properly handle the error
  } finally {
    // Important: Disconnect Prisma client to avoid connection issues on subsequent invocations
    await prisma.$disconnect();
  }

  return { statusCode: 200, body: "Lambda executed successfully" };
};

// Run  main()  if the script is executed directly
main();
