FROM node:18 as base

FROM base AS builder

ARG NEXT_PUBLIC_WALLET_CONNECT_ID
ARG NEXT_PUBLIC_L1_TESTNET_RPC_URL
ARG NEXT_PUBLIC_L1_MAINNET_RPC_URL
ARG NEXT_PUBLIC_L2_TESTNET_RPC_URL
ARG NEXT_PUBLIC_L2_MAINNET_RPC_URL

ENV NEXT_PUBLIC_WALLET_CONNECT_ID=$NEXT_PUBLIC_WALLET_CONNECT_ID
ENV NEXT_PUBLIC_L1_TESTNET_RPC_URL=$NEXT_PUBLIC_L1_TESTNET_RPC_URL
ENV NEXT_PUBLIC_L1_MAINNET_RPC_URL=$NEXT_PUBLIC_L1_MAINNET_RPC_URL
ENV NEXT_PUBLIC_L2_TESTNET_RPC_URL=$NEXT_PUBLIC_L2_TESTNET_RPC_URL
ENV NEXT_PUBLIC_L2_MAINNET_RPC_URL=$NEXT_PUBLIC_L2_MAINNET_RPC_URL

ARG ENV_FILE

WORKDIR /app

# Copy package.json and yarn.lock first for dependency installation
COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# Copy application source and environment file
COPY . ./
COPY .env ./

# Build the application
RUN yarn build

FROM base AS runner

ARG X_TAG

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER node

# Copy built files from the builder stage
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Start the application
CMD ["node", "./server.js"]