require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('@nomicfoundation/hardhat-verify')
require('hardhat-gas-reporter')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    /* NETWORKS */
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
        },
        arbitrum: {
            allowUnlimitedContractSize: true,
            url: process.env.RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 421614,
            gasPrice: 20000000000, // 20 Gwei
        },
    },
    /* SOLIDITY SETTINGS */
    solidity: '0.8.24',
    settings: {
        optimizer: {
            enabled: true,
            runs: 50,
            details: { yul: false },
        },
    },
    /* FOR VERIFICATION */
    etherscan: {
        apiKey: process.env.ETHERSCAN_API,
    },
    sourcify: {
        enabled: true,
    },
    /* GAS REPORTER */
    gasReporter: {
        enabled: false,
        currency: 'ETH',
        L2: 'arbitrum',
        L2Etherscan: process.env.ARB_API_KEY,
        gasPrice: 21,
        coinmarketcap: process.env.COINMARKETCAP_API,
    },
}
