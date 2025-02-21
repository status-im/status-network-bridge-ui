#!/usr/bin/env groovy
library 'status-jenkins-lib@v1.9.16'

pipeline {
  agent { label 'linux' }

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
    string(
      name: 'NEXT_PUBLIC_L1_TESTNET_RPC_URL',
      description: 'L1 Testnet RPC URL.',
      defaultValue: '',
    )
    string(
      name: 'NEXT_PUBLIC_L2_TESTNET_RPC_URL',
      description: 'L2 Testnet RPC URL.',
      defaultValue: '',
    )
    /*Not used yet*/
    string(
      name: 'NEXT_PUBLIC_L1_MAINNET_RPC_URL',
      description: 'L1 Mainnet RPC URL.',
      defaultValue: '',
    )
    /*Not used yet*/
    string(
      name: 'NEXT_PUBLIC_L2_MAINNET_RPC_URL',
      description: 'L2 Mainnet RPC URL.',
      defaultValue: '',
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L1_MAINNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L1 Mainnet will be injected to requests.',
      defaultValue: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L2_MAINNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L2 Mainnet will be injected to requests.',
      defaultValue: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L1_TESTNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L1 Testnet will be injected to requests.',
      defaultValue: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L2_TESTNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L2 Testnet will be injected to requests.',
      defaultValue: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L1_DEVNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L1 Devnet will be injected to requests.',
      defaultValue: false,
    )
    booleanParam(
      name: 'NEXT_PUBLIC_L2_DEVNET_RPC_IS_AUTHENTICATED',
      description: 'Flag controlling if auth header for L2 Devnet will be injected to requests.',
      defaultValue: false,
    )
  }

  options {
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
              usernamePassword(
                credentialsId: 'eth-rpc-proxy',
                usernameVariable: 'NEXT_PUBLIC_ETH_RPC_PROXY_USER',
                passwordVariable: 'NEXT_PUBLIC_ETH_RPC_PROXY_PASS'
              )
          ]) {
            image = docker.build(
              "${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_COMMIT.take(8)}",
              """--build-arg NEXT_PUBLIC_WALLET_CONNECT_ID='${env.NEXT_PUBLIC_WALLET_CONNECT_ID}' \
                  --build-arg NEXT_PUBLIC_L1_TESTNET_RPC_URL='${params.NEXT_PUBLIC_L1_TESTNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L1_MAINNET_RPC_URL='${params.NEXT_PUBLIC_L1_MAINNET_RPC_URL}' \
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
          withDockerRegistry([credentialsId: 'harbor-status-im-bridge-robot', url: 'https://${DOCKER_REGISTRY}']) {
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
