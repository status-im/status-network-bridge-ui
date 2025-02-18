FROM node:18 AS base

FROM base AS builder

ARG NEXT_PUBLIC_WALLET_CONNECT_ID
ARG NEXT_PUBLIC_L1_TESTNET_RPC_URL
ARG NEXT_PUBLIC_L1_MAINNET_RPC_URL
ARG NEXT_PUBLIC_L2_TESTNET_RPC_URL
ARG NEXT_PUBLIC_L2_MAINNET_RPC_URL
ARG NEXT_PUBLIC_ETH_RPC_PROXY_USER
ARG NEXT_PUBLIC_ETH_RPC_PROXY_PASS

ENV NEXT_PUBLIC_WALLET_CONNECT_ID=$NEXT_PUBLIC_WALLET_CONNECT_ID
ENV NEXT_PUBLIC_L1_TESTNET_RPC_URL=$NEXT_PUBLIC_L1_TESTNET_RPC_URL
ENV NEXT_PUBLIC_L1_MAINNET_RPC_URL=$NEXT_PUBLIC_L1_MAINNET_RPC_URL
ENV NEXT_PUBLIC_L2_TESTNET_RPC_URL=$NEXT_PUBLIC_L2_TESTNET_RPC_URL
ENV NEXT_PUBLIC_L2_MAINNET_RPC_URL=$NEXT_PUBLIC_L2_MAINNET_RPC_URL
ENV NEXT_PUBLIC_ETH_RPC_PROXY_USER=$NEXT_PUBLIC_ETH_RPC_PROXY_USER
ENV NEXT_PUBLIC_ETH_RPC_PROXY_PASS=$NEXT_PUBLIC_ETH_RPC_PROXY_PASS

ARG ENV_FILE

WORKDIR /app

# Listening port for docker healthchecks
ARG PORT=3000
EXPOSE ${PORT}

# Enable Corepack and set up Yarn v4
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy package.json, yarn.lock and .yarnrc.yml first for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./
# We also need patches introduced in https://github.com/status-im/status-network-bridge-ui/commit/9281505
COPY .yarn ./.yarn

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
