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
              string(
                credentialsId: 'bridge-status-network-l1-testnet-rpc',
                variable: 'NEXT_PUBLIC_L1_TESTNET_RPC_URL',
              ),
              string(
                credentialsId: 'bridge-status-network-l1-mainnet-rpc',
                variable: 'NEXT_PUBLIC_L1_MAINNET_RPC_URL',
              ),
              string(
                credentialsId: 'bridge-status-network-l2-testnet-rpc',
                variable: 'NEXT_PUBLIC_L2_TESTNET_RPC_URL',
              ),
              string(
                credentialsId: 'bridge-status-network-l2-mainnet-rpc',
                variable: 'NEXT_PUBLIC_L2_MAINNET_RPC_URL',
              )
          ]) {
            image = docker.build(
              "${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_COMMIT.take(8)}",
              """--build-arg NEXT_PUBLIC_WALLET_CONNECT_ID='${env.NEXT_PUBLIC_WALLET_CONNECT_ID}' \
                  --build-arg NEXT_PUBLIC_L1_TESTNET_RPC_URL='${env.NEXT_PUBLIC_L1_TESTNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L1_MAINNET_RPC_URL='${env.NEXT_PUBLIC_L1_MAINNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L2_TESTNET_RPC_URL='${env.NEXT_PUBLIC_L2_TESTNET_RPC_URL}' \
                  --build-arg NEXT_PUBLIC_L2_MAINNET_RPC_URL='${env.NEXT_PUBLIC_L2_MAINNET_RPC_URL}' \
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
            image.push(params.IMAGE_NAME)
          }
        }
      }
    }
  }

  post {
    cleanup { cleanWs() }
  }
}
