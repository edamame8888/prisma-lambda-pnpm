FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 共通のnode_modulesをinstall
FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Lambda: sample-lambda
FROM build AS sample-lambda-builder
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/sample-lambda ./packages/sample-lambda
COPY --from=build /app/packages/db ./packages/db
COPY --from=build /app/.npmrc ./
RUN pnpm --filter db build
RUN pnpm --filter sample-lambda build

FROM public.ecr.aws/lambda/nodejs:22 AS sample-lambda
WORKDIR /var/task
COPY --from=sample-lambda-builder /app/packages/db/generated/client/libquery_engine-*.so.node /tmp/prisma-engines/
COPY --from=sample-lambda-builder /app/packages/sample-lambda/dist ./
COPY --from=sample-lambda-builder /app/packages/sample-lambda/node_modules ./node_modules
CMD ["index.handler"]
