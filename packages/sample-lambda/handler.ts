import { Logger } from "@aws-lambda-powertools/logger";
import { prisma } from "database";

// Logger
const logger = new Logger({
  serviceName: "sample-lambda",
  logLevel: "INFO", // LOG_LEVELが無ければ"INFO"
});

console.log("✅DATABASE_URL", process.env.DATABASE_URL);

export const handler = async () => {
  await prisma.$queryRaw`SELECT 1`
    .then((res) => {
      logger.info(`✅prisma connection: ${res}`);
    })
    .catch((err) => {
      logger.error(`❌prisma connection: ${err}`);
    });

  logger.info("✅prisma connection: success");
  return;
};
