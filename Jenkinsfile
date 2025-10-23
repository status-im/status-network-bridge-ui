#!/usr/bin/env groovy
library 'status-jenkins-lib@v1.9.16'

pipeline {
  agent {
    docker {
      label 'linuxcontainer'
      image 'harbor.status.im/infra/ci-build-containers:linux-base-1.0.0'
      args '--volume=/var/run/docker.sock:/var/run/docker.sock ' +
           '--user jenkins'
    }
  }

  parameters {
    string(
      name: 'DOCKER_REGISTRY',
      description: 'Docker registry ',
      defaultValue: params.DOCKER_REGISTRY ?: 'harbor.status.im',
    )
    string(
      name: 'IMAGE_NAME',
      description: 'Docker image name to push.',
      defaultValue: params.IMAGE_NAME ?: 'harbor.status.im/status-im/bridge-status-network',
    )
    string(
      name: 'IMAGE_TAG',
      description: 'Docker image tag to push.',
      defaultValue: params.IMAGE_TAG ?: 'deploy-develop',
    )
    booleanParam(
      name: 'NEXT_PUBLIC_USE_DEVNET',
      description: 'Flag controlling to use Devnet.',
      defaultValue: params.NEXT_PUBLIC_USE_DEVNET ?: false,
    )
    string(
      name: 'NEXT_PUBLIC_L1_TESTNET_RPC_URL',
      description: 'L1 Testnet RPC URL.',
      defaultValue: params.NEXT_PUBLIC_L1_TESTNET_RPC_URL ?: 'https://snt.eth-rpc.status.im/ethereum/sepolia',
    )
    string(
      name: 'NEXT_PUBLIC_L2_TESTNET_RPC_URL',
      description: 'L2 Testnet RPC URL.',
      defaultValue: params.NEXT_PUBLIC_L2_TESTNET_RPC_URL ?: 'https://snt.eth-rpc.status.im/status/sepolia',
    )
    /*Not used yet*/
    string(
      name: 'NEXT_PUBLIC_L1_MAINNET_RPC_URL',
      description: 'L1 Mainnet RPC URL.',
      defaultValue: params.NEXT_PUBLIC_L1_MAINNET_RPC_URL ?: 'https://snt.eth-rpc.status.im/ethereum/mainnet',
    )
    /*Not used yet*/
    string(
      name: 'NEXT_PUBLIC_L2_MAINNET_RPC_URL',
      description: 'L2 Mainnet RPC URL.',
      defaultValue: params.NEXT_PUBLIC_L2_MAINNET_RPC_URL ?: 'https://snt.eth-rpc.status.im/status/mainnet',
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L1_MAINNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L1 Mainnet will be injected to requests.',
      defaultValue: params.NEXT_PUBLIC_L1_MAINNET_RPC_IS_AUTHENTICATED ?: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L2_MAINNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L2 Mainnet will be injected to requests.',
      defaultValue: params.NEXT_PUBLIC_L2_MAINNET_RPC_IS_AUTHENTICATED ?: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L1_TESTNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L1 Testnet will be injected to requests.',
      defaultValue: params.NEXT_PUBLIC_L1_TESTNET_RPC_IS_AUTHENTICATED ?: true,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L2_TESTNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L2 Testnet will be injected to requests.',
      defaultValue: params.NEXT_PUBLIC_L2_TESTNET_RPC_IS_AUTHENTICATED ?: true,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L1_DEVNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L1 Devnet will be injected to requests.',
      defaultValue: params.NEXT_PUBLIC_L1_DEVNET_RPC_IS_AUTHENTICATED ?: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L2_DEVNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L2 Devnet will be injected to requests.',
      defaultValue: params.NEXT_PUBLIC_L2_DEVNET_RPC_IS_AUTHENTICATED ?: false,
    )
  }

  options {
    disableRestartFromStage()
    disableConcurrentBuilds()
    /* manage how many builds we keep */
    buildDiscarder(logRotator(
      numToKeepStr: '20',
      daysToKeepStr: '30',
    ))
  }

  environment {
    IMAGE_NAME = 'status-im/bridge-status-network'
    NEXT_PUBLIC_SITE_URL = "https://${env.JOB_BASE_NAME}"
  }

  stages {
    stage('Build') {
      steps {
        script {
          sh 'cp ./.env.production ./.env'
          withCredentials([
              string(
                credentialsId: 'bridge-status-network-wallet-connect-id',
                variable: 'NEXT_PUBLIC_WALLET_CONNECT_ID',
              ),
              string(
                credentialsId: 'bridge-status-network-public-l1-devnet-rpc-url',
                variable: 'NEXT_PUBLIC_L1_DEVNET_RPC_URL',
              ),
              string(
                credentialsId: 'bridge-status-network-public-l2-devnet-rpc-url',
                variable: 'NEXT_PUBLIC_L2_DEVNET_RPC_URL',
              ),
              string(
                credentialsId: 'bridge-status-network-public-l1-devnet-chain-id',
                variable: 'NEXT_PUBLIC_L1_DEVNET_CHAIN_ID',
              ),
              string(
                credentialsId: 'bridge-status-network-public-l2-devnet-chain-id',
                variable: 'NEXT_PUBLIC_L2_DEVNET_CHAIN_ID',
              ),
              usernamePassword(
                credentialsId: 'eth-rpc-proxy',
                usernameVariable: 'NEXT_PUBLIC_ETH_RPC_PROXY_USER',
                passwordVariable: 'NEXT_PUBLIC_ETH_RPC_PROXY_PASS'
              )
          ]) {
            image = docker.build(
              "${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_COMMIT.take(8)}",
              """--build-arg NEXT_PUBLIC_WALLET_CONNECT_ID='${env.NEXT_PUBLIC_WALLET_CONNECT_ID}' \
                  --build-arg NEXT_PUBLIC_USE_DEVNET='${params.NEXT_PUBLIC_USE_DEVNET}' \
                  --build-arg NEXT_PUBLIC_L1_DEVNET_CHAIN_ID='${env.NEXT_PUBLIC_L1_DEVNET_CHAIN_ID}' \
                  --build-arg NEXT_PUBLIC_L1_DEVNET_RPC_URL='${env.NEXT_PUBLIC_L1_DEVNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L1_TESTNET_RPC_URL='${params.NEXT_PUBLIC_L1_TESTNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L1_MAINNET_RPC_URL='${params.NEXT_PUBLIC_L1_MAINNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L2_DEVNET_CHAIN_ID='${env.NEXT_PUBLIC_L2_DEVNET_CHAIN_ID}' \
                  --build-arg NEXT_PUBLIC_L2_DEVNET_RPC_URL='${env.NEXT_PUBLIC_L2_DEVNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L2_TESTNET_RPC_URL='${params.NEXT_PUBLIC_L2_TESTNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L2_MAINNET_RPC_URL='${params.NEXT_PUBLIC_L2_MAINNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L1_MAINNET_RPC_IS_AUTHENTICATED='${params.NEXT_PUBLIC_L1_MAINNET_RPC_IS_AUTHENTICATED}' \
                  --build-arg NEXT_PUBLIC_L2_MAINNET_RPC_IS_AUTHENTICATED='${params.NEXT_PUBLIC_L2_MAINNET_RPC_IS_AUTHENTICATED}' \
                  --build-arg NEXT_PUBLIC_L1_TESTNET_RPC_IS_AUTHENTICATED='${params.NEXT_PUBLIC_L1_TESTNET_RPC_IS_AUTHENTICATED}' \
                  --build-arg NEXT_PUBLIC_L2_TESTNET_RPC_IS_AUTHENTICATED='${params.NEXT_PUBLIC_L2_TESTNET_RPC_IS_AUTHENTICATED}' \
                  --build-arg NEXT_PUBLIC_L1_DEVNET_RPC_IS_AUTHENTICATED='${params.NEXT_PUBLIC_L1_DEVNET_RPC_IS_AUTHENTICATED}' \
                  --build-arg NEXT_PUBLIC_L2_DEVNET_RPC_IS_AUTHENTICATED='${params.NEXT_PUBLIC_L2_DEVNET_RPC_IS_AUTHENTICATED}' \
                  --build-arg NEXT_PUBLIC_ETH_RPC_PROXY_USER='${env.NEXT_PUBLIC_ETH_RPC_PROXY_USER}' \
                  --build-arg NEXT_PUBLIC_ETH_RPC_PROXY_PASS='${env.NEXT_PUBLIC_ETH_RPC_PROXY_PASS}' \
              ."""
            )
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          withDockerRegistry([credentialsId: 'harbor-status-im-bridge-robot', url: "https://${DOCKER_REGISTRY}"]) {
            image.push(params.IMAGE_TAG)
          }
        }
      }
    }
  }

  post {
    cleanup { cleanWs() }
  }
}
