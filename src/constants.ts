export enum ChainTestnet {
    ETH = 'ETH',
    AVAX = 'AVAX',
    OP = 'OP',
    ARB = 'ARB',
    SOL = 'SOL'
}
export enum SupportedChainIdTestnet {
    ETH_TESTNET = 11155111,
    AVAX_TESTNET = 43113,
    OP_TESTNET = 11155420,
    ARB_TESTNET = 421614,
    SOL_TESTNET = 111551122
}
export const ChinDomainsTestnet: { [key in ChainTestnet]: number } = {
    [ChainTestnet.ETH]: 0,
    [ChainTestnet.AVAX]: 1,
    [ChainTestnet.OP]: 2,
    [ChainTestnet.ARB]: 3,
    [ChainTestnet.SOL]: 5,
}
export const getChainOptionsTestnet = () => {
    return Object.values(ChainTestnet).map((chain) => ({
        label: chain,
        value: chain,
        chainId: chainIdMappingTestnet[chain as ChainTestnet],
    }));
};

export const BlockConfirmation: Record<ChainTestnet, number> = {
    [ChainTestnet.ETH]: 66,
    [ChainTestnet.AVAX]: 2,
    [ChainTestnet.OP]: 66,
    [ChainTestnet.ARB]: 66,
    [ChainTestnet.SOL]: 66
};
export const chainIdMappingTestnet: { [key in ChainTestnet]: SupportedChainIdTestnet } = {
    [ChainTestnet.ETH]: SupportedChainIdTestnet.ETH_TESTNET,
    [ChainTestnet.AVAX]: SupportedChainIdTestnet.AVAX_TESTNET,
    [ChainTestnet.OP]: SupportedChainIdTestnet.OP_TESTNET,
    [ChainTestnet.ARB]: SupportedChainIdTestnet.ARB_TESTNET,
    [ChainTestnet.SOL]: SupportedChainIdTestnet.SOL_TESTNET
};
export const BlockConfirmationTestnet: Record<ChainTestnet, number> = {
    [ChainTestnet.ETH]: 6,
    [ChainTestnet.AVAX]: 2,
    [ChainTestnet.OP]: 6,
    [ChainTestnet.ARB]: 70,
    [ChainTestnet.SOL]: 6
};

// export const rpcUrlsTestnet = [
//     { ETH: 'https://sepolia.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245' },
//     { AVAX: 'https://avalanche-fuji.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245' },
//     { OP: 'https://optimism-sepolia.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245' },
//     { ARB: 'https://arbitrum-sepolia.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245' },
// ]
const infuraApiKey = process.env.APP_INFURA_API_KEY as string;
export const rpcUrlsTestnet : {[key in ChainTestnet]: string } = {
    [ChainTestnet.ETH]: `https://sepolia.infura.io/v3/${infuraApiKey}`,
    [ChainTestnet.AVAX]: `https://avalanche-fuji.infura.io/v3/${infuraApiKey}`,
    [ChainTestnet.OP]: `https://optimism-sepolia.infura.io/v3/${infuraApiKey}`,
    [ChainTestnet.ARB]: `https://arbitrum-sepolia.infura.io/v3/${infuraApiKey}`,
    [ChainTestnet.SOL]: 'https://api.devnet.solana.com',
  };
export const rpcUrlsTestnetRecord: Record<ChainTestnet, string> = {
    [ChainTestnet.ETH]: 'https://sepolia.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.AVAX]: 'https://avalanche-fuji.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.OP]: 'https://optimism-sepolia.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.ARB]: 'https://arbitrum-sepolia.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.SOL]: 'https://api.devnet.solana.com',
    
}
export const wssUrlsTestnet: Record<ChainTestnet, string> = {
    [ChainTestnet.ETH]: 'wss://sepolia.infura.io/ws/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.AVAX]: 'wss://avalanche-fuji.infura.io/ws/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.OP]: 'wss://optimism-mainnet.infura.io/ws/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.ARB]: 'wss://arbitrum-sepolia.infura.io/ws/v3/4f36124f93704ca1a5bc5e78ffac2245',
    [ChainTestnet.SOL]: 'wss://solana-mainnet.infura.io/ws/v3/4f36124f93704ca1a5bc5e78ffac2245',
};
export const ChainToSupportedChainIdTestnet: { [key in ChainTestnet]: SupportedChainIdTestnet } = {
    [ChainTestnet.ETH]: SupportedChainIdTestnet.ETH_TESTNET,
    [ChainTestnet.AVAX]: SupportedChainIdTestnet.AVAX_TESTNET,
    [ChainTestnet.OP]: SupportedChainIdTestnet.OP_TESTNET,
    [ChainTestnet.ARB]: SupportedChainIdTestnet.ARB_TESTNET,
    [ChainTestnet.SOL]: SupportedChainIdTestnet.SOL_TESTNET
};

export const CHAIN_IDS_TO_USDC_ADDRESSES_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0x5425890298aed601595a70ab815c96711a31bc65',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
}

export const CHAIN_IDS_TO_TOKEN_MESSENGER_ADDRESSES_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
}

export const CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872',
}

export const CHAIN_IDS_TO_MESSAGE_MESSAGE_HASH_RECIVED_TESTNET = {
    [SupportedChainIdTestnet.ETH_TESTNET]: '',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '',
    [SupportedChainIdTestnet.OP_TESTNET]: '',
    [SupportedChainIdTestnet.ARB_TESTNET]: '',
}
export const HELPER_CONTRACTS_TESTNET ={
    [SupportedChainIdTestnet.ETH_TESTNET]: '0x86C7A97e32b57A97f978001451E553067b72F5d1',
    [SupportedChainIdTestnet.AVAX_TESTNET]: '0x9d0a9fC0ef5f85c9753C40bBDa993120403539EB',
    [SupportedChainIdTestnet.OP_TESTNET]: '0x42b95217e2467589d39d763ec1f75ec83691a900',
    [SupportedChainIdTestnet.ARB_TESTNET]: '0x6b79bc016172df0e1644b58fa6c723cb2b742f3d',
}