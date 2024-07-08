"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET = exports.CHAIN_IDS_TO_TOKEN_MESSENGER_ADDRESSES_TESTNET = exports.CHAIN_IDS_TO_USDC_ADDRESSES_TESTNET = exports.ChainToSupportedChainIdTestnet = exports.wssUrlsTestnet = exports.rpcUrlsTestnet = exports.BlockConfirmationTestnet = exports.chainIdMappingTestnet = exports.BlockConfirmation = exports.getChainOptionsTestnet = exports.ChinDomainsTestnet = exports.SupportedChainIdTestnet = exports.ChainTestnet = void 0;
var ChainTestnet;
(function (ChainTestnet) {
    ChainTestnet["ETH"] = "ETH";
    ChainTestnet["AVAX"] = "AVAX";
    ChainTestnet["OP"] = "OP";
    ChainTestnet["ARB"] = "ARB";
})(ChainTestnet || (exports.ChainTestnet = ChainTestnet = {}));
var SupportedChainIdTestnet;
(function (SupportedChainIdTestnet) {
    SupportedChainIdTestnet[SupportedChainIdTestnet["ETH_TESTNET"] = 11155111] = "ETH_TESTNET";
    SupportedChainIdTestnet[SupportedChainIdTestnet["AVAX_TESTNET"] = 43113] = "AVAX_TESTNET";
    SupportedChainIdTestnet[SupportedChainIdTestnet["OP_TESTNET"] = 11155420] = "OP_TESTNET";
    SupportedChainIdTestnet[SupportedChainIdTestnet["ARB_TESTNET"] = 421614] = "ARB_TESTNET";
})(SupportedChainIdTestnet || (exports.SupportedChainIdTestnet = SupportedChainIdTestnet = {}));
exports.ChinDomainsTestnet = {
    [ChainTestnet.ETH]: 0,
    [ChainTestnet.AVAX]: 1,
    [ChainTestnet.OP]: 2,
    [ChainTestnet.ARB]: 3,
};
const getChainOptionsTestnet = () => {
    return Object.values(ChainTestnet).map((chain) => ({
        label: chain,
        value: chain,
        chainId: exports.chainIdMappingTestnet[chain],
    }));
};
exports.getChainOptionsTestnet = getChainOptionsTestnet;
exports.BlockConfirmation = {
    [ChainTestnet.ETH]: 66,
    [ChainTestnet.AVAX]: 2,
    [ChainTestnet.OP]: 66,
    [ChainTestnet.ARB]: 66,
};
exports.chainIdMappingTestnet = {
    [ChainTestnet.ETH]: SupportedChainIdTestnet.ETH_TESTNET,
    [ChainTestnet.AVAX]: SupportedChainIdTestnet.AVAX_TESTNET,
    [ChainTestnet.OP]: SupportedChainIdTestnet.OP_TESTNET,
    [ChainTestnet.ARB]: SupportedChainIdTestnet.ARB_TESTNET,
};
exports.BlockConfirmationTestnet = {
    [ChainTestnet.ETH]: 6,
    [ChainTestnet.AVAX]: 2,
    [ChainTestnet.OP]: 6,
    [ChainTestnet.ARB]: 6,
};
exports.rpcUrlsTestnet = [
    { ETH: 'https://rpc.sepolia.org' },
    { AVAX: 'https://api.avax-test.network/ext/bc/C/rpc' },
    { OP: 'https://sepolia.optimism.io' },
    { ARB: 'https://sepolia-rollup.arbitrum.io/rpc' },
];
exports.wssUrlsTestnet = {
    [ChainTestnet.ETH]: 'wss://ethereum-rpc.publicnode.com',
    [ChainTestnet.AVAX]: 'wss://avalanche-c-chain-rpc.publicnode.com',
    [ChainTestnet.OP]: 'wss://ethereum-rpc.publicnode.com',
    [ChainTestnet.ARB]: 'wss://ethereum-rpc.publicnode.com',
};
exports.ChainToSupportedChainIdTestnet = {
    [ChainTestnet.ETH]: SupportedChainIdTestnet.ETH_TESTNET,
    [ChainTestnet.AVAX]: SupportedChainIdTestnet.AVAX_TESTNET,
    [ChainTestnet.OP]: SupportedChainIdTestnet.OP_TESTNET,
    [ChainTestnet.ARB]: SupportedChainIdTestnet.ARB_TESTNET,
};
exports.CHAIN_IDS_TO_USDC_ADDRESSES_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0x5425890298aed601595a70ab815c96711a31bc65',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
};
exports.CHAIN_IDS_TO_TOKEN_MESSENGER_ADDRESSES_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
};
exports.CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872',
};
