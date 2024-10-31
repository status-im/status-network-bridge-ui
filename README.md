# Status Network Bridge UI

### Config

The config file `.env.production` is used for public configuration variables.

Private configuration variables are store on GitHub Secrets.

## Development

### Run development server

To start Linea Bridge UI for development:

1. Create a `.env` file by copying `.env.template` and add your private API keys.

```shell
cp .env.template .env
```

2. Install packages:

```shell
npm i
```

3. Start the development server, execute:

```shell
npm run dev
```

Frontend should be available at: http://localhost:3000

## Config

The config variables are:

| Var                                           | Description                                    | Values                                                                                                    |
| --------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_MAINNET_L1_TOKEN_BRIDGE           | Linea Token Bridge on Ethereum mainnet         | 0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319                                                                |
| NEXT_PUBLIC_MAINNET_LINEA_TOKEN_BRIDGE        | Linea Token Bridge on Linea mainnet            | 0x353012dc4a9A6cF55c941bADC267f82004A8ceB9                                                                |
| NEXT_PUBLIC_MAINNET_L1_MESSAGE_SERVICE        | Linea Message Service on Ethereum mainnet      | 0xd19d4B5d358258f05D7B411E21A1460D11B0876F                                                                |
| NEXT_PUBLIC_MAINNET_LINEA_MESSAGE_SERVICE     | Linea Message Service on Linea mainnet         | 0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec                                                                |
| NEXT_PUBLIC_MAINNET_L1_USDC_BRIDGE            | Linea USDC Bridge on Ethereum mainnet          | 0x504A330327A089d8364C4ab3811Ee26976d388ce                                                                |
| NEXT_PUBLIC_MAINNET_LINEA_USDC_BRIDGE         | Linea USDC Bridge on Linea mainnet             | 0xA2Ee6Fce4ACB62D95448729cDb781e3BEb62504A                                                                |
| NEXT_PUBLIC_MAINNET_GAS_ESTIMATED             | Linea gas estimated on mainnet                 | 100000                                                                                                    |
| NEXT_PUBLIC_MAINNET_DEFAULT_GAS_LIMIT_SURPLUS | Linea gas limit surplus on mainnet             | 6000                                                                                                      |
| NEXT_PUBLIC_MAINNET_PROFIT_MARGIN             | Linea profit margin on mainnet                 | 2                                                                                                         |
| NEXT_PUBLIC_MAINNET_TOKEN_LIST                | Linea Token list on mainnet                    | https://raw.githubusercontent.com/Consensys/linea-token-list/main/json/linea-mainnet-token-shortlist.json |
|                                               |                                                |                                                                                                           |
| NEXT_PUBLIC_SEPOLIA_L1_TOKEN_BRIDGE           | Linea Token Bridge on Ethereum Sepolia         | 0x5A0a48389BB0f12E5e017116c1105da97E129142                                                                |
| NEXT_PUBLIC_SEPOLIA_LINEA_TOKEN_BRIDGE        | Linea Token Bridge on Linea Sepolia            | 0x93DcAdf238932e6e6a85852caC89cBd71798F463                                                                |
| NEXT_PUBLIC_SEPOLIA_L1_MESSAGE_SERVICE        | Linea Message Service on Ethereum Sepolia      | 0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5                                                                |
| NEXT_PUBLIC_SEPOLIA_LINEA_MESSAGE_SERVICE     | Linea Message Service on Linea Sepolia         | 0x971e727e956690b9957be6d51Ec16E73AcAC83A7                                                                |
| NEXT_PUBLIC_SEPOLIA_L1_USDC_BRIDGE            | Linea USDC Bridge on Ethereum Sepolia          | 0x32D123756d32d3eD6580935f8edF416e57b940f4                                                                |
| NEXT_PUBLIC_SEPOLIA_LINEA_USDC_BRIDGE         | Linea USDC Bridge on Linea Sepolia             | 0xDFa112375c9be9D124932b1d104b73f888655329                                                                |
| NEXT_PUBLIC_SEPOLIA_GAS_ESTIMATED             | Linea gas estimated on Sepolia                 | 6100000000                                                                                                |
| NEXT_PUBLIC_SEPOLIA_DEFAULT_GAS_LIMIT_SURPLUS | Linea gas limit surplus on Sepolia             | 6000                                                                                                      |
| NEXT_PUBLIC_SEPOLIA_PROFIT_MARGIN             | Linea profit margin on Sepolia                 | 2                                                                                                         |
| NEXT_PUBLIC_SEPOLIA_TOKEN_LIST                | Linea Token list on Sepolia                    | https://raw.githubusercontent.com/Consensys/linea-token-list/main/json/linea-sepolia-token-shortlist.json |
|                                               |                                                |                                                                                                           |
| NEXT_PUBLIC_WALLET_CONNECT_ID                 | Wallet Connect Api Key                         |                                                                                                           |
| NEXT_PUBLIC_INFURA_ID                         | Infura API Key                                 |                                                                                                           |
| E2E_TEST_PRIVATE_KEY                          | Private key to execute e2e on Sepolia          |                                                                                                           |
| NEXT_PUBLIC_STORAGE_MIN_VERSION               | Local storage version for reseting the storage | 1                                                                                                         |
