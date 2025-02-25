# Status Network Bridge

![Status Network Bridge - App - banner](./.github/assets/hero.png)  
Status Network Bridge is a bridge solution, providing secure and efficient cross-chain transactions between Layer 1 and Status Network,
The first Ethereum L2 with gas-free transactions at scale

## Running the project 🐉
### Requirements ✅
To run the project, you'll need:
- If setting up using **[Docker](https://www.docker.com)**:
    - Installed Docker
    - Installed docker-compose (Bundled with the official Docker setup)
- If setting up locally
    - [Node.js](https://nodejs.org/en/) (Version 18)
    - [Yarn](https://yarnpkg.com/)

### Installation 🧙
#### Git
1. Clone the repo: ```git clone https://github.com/status-im/status-network-bridge-ui.git```
2. Navigate to the folder: ```cd status-network-bridge-ui```

#### Installing the dependencies
3. Run ```yarn``` to install the dependencies

### Commands 💻
| Name                | Command          | Description                                |
|---------------------|------------------|--------------------------------------------|
| Build               | ```yarn build``` | Builds all the packages inside the project |
| Linting             | ```yarn lint```  | Lints the project using `next lint`        |
| Running Development | ```yarn dev```   | Runs the project in development mode       |
| Running Production  | ```yarn start``` | Runs the project from production build     |

### Running the project 🏁
To run the server, follow next steps:

**Step 1:** Create the .env file  
```cp .env.template .env```  

The config file `.env.production` is used for public configuration variables.
Private configuration variables are stored inside Jenkins credentials.

**Step 2:** Fill the missing .env values

Where can I obtain the needed values?

| Value                                                            | Description                                       | Link                     |
|------------------------------------------------------------------|---------------------------------------------------|--------------------------|
| NEXT_PUBLIC_WALLET_CONNECT_ID                                    | The Project ID for using Wallet Connect           | https://cloud.reown.com/ |
| NEXT_PUBLIC_ETH_RPC_PROXY_USER                                   | The username for authentication of Status RPC Proxy | N/A                      |
| NEXT_PUBLIC_ETH_RPC_PROXY_PASS                                   | The password for authentication of Status RPC Proxy | N/A                      |
| NEXT_PUBLIC_[L1/L2]_[DEVNET/TESTNET/MAINNET]_RPC_IS_AUTHENTICATED | Flag controlling if Authorization header will be injected to requests or not                                   | N/A                      
| NEXT_PUBLIC_[L1/L2]_[DEVNET/TESTNET/MAINNET]_RPC_URL          | The RPC URL for the corresponding network (L1 / L2) | N/A                      |
> [!IMPORTANT]  
> Ensure that you've filled all the needed values in the .env


**Step 3:** Run docker  
```docker-compose up```

**Step 4:** Enjoy! ٩(^‿^)۶

<br/>
<img align="left" alt="sn-team" width="100" height="100" src="./.github/assets/sn-team.png">

### Made with ❤
by [status.network](https://status.network/) team