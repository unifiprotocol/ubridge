import * as dotenv from "dotenv"

import "hardhat-iotex-verify"
import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"

dotenv.config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    Binance: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Binance"
    },
    Ethereum: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Ethereum"
    },
    EthereumRopsten: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Ropsten"
    },
    EthereumRinkeby: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Rinkeby"
    },
    BinanceTestnet: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/BinanceTesnet"
    },
    Iotex: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Iotex"
    },
    Tron: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Tron"
    },
    Harmony: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Harmony"
    },
    Polygon: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Polygon"
    },
    Avalanche: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/Avalanche"
    },
    BTTC: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/BTTC"
    },
    FTM: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/FTM"
    },
    OntologyTestnet: {
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      url: "https://proxy.unifiprotocol.com/rpc/OntologyTestnet"
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    apiKey: {
      mainnet: "RX5F9AXT5BSG696ZUYC4IVENDAGGPSQ9I1",
      ropsten: "6329MS2FHP9NCKF6DKPDMR5RIE3HYCYGW1",
      bscTestnet: "BC9318STPGVMNCWWBSKTUTZ5CTVK8DDD1B",
      bsc: "2N8MMDJJRIE9661UDSJXICDHEN5N4I4ZD1",
      polygon: "C8YFTAEB68WSSEQVKZQENPY98DH7VKCGYV",
      avalanche: "Q7HS4I9BHTUU761CVGUFK79SY5NBYVNCTN",
      opera: "71ZCRD5TYV9SPK8XTSPYAMI7XTUQWIC1V2"
    }
  }
}

export default config
