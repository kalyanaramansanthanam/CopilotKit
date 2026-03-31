FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
# Build Next.js frontend
RUN pnpm build
# Compile TypeScript agent server
RUN npx tsc --outDir /app/dist --module commonjs --moduleResolution node \
    --target es2020 --esModuleInterop true --skipLibCheck true \
    src/agent_server.ts

FROM node:20-slim AS runner
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist/agent_server.js ./agent_server.js

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production
CMD ["./entrypoint.sh"]
