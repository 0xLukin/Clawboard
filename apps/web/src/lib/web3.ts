import { defineChain } from 'viem';

export const monadTestnet = defineChain({
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Monad',
        symbol: 'MON',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.ankr.com/monad_testnet'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Monad Explorer',
            url: 'https://explorer.monad.xyz',
        },
    },
    testnet: true,
});

// 合约地址 (部署后填入)
export const CONTRACT_ADDRESSES = {
    CLAWDOGE: process.env.NEXT_PUBLIC_CLAWDOGE_ADDRESS || '',
    AGENT_REGISTRY: process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS || '',
};

// $CLAWDOGE 代币信息
export const CLAWDOGE_TOKEN = {
    symbol: 'CLAWDOGE',
    name: 'ClawDoge',
    decimals: 18,
    maxSupply: 2_100_000_000n * 10n ** 18n,
    transferTax: 0.111, // 11.1%
    teamTax: 0.042,     // 4.2%
    burnTax: 0.069,     // 6.9%
};
