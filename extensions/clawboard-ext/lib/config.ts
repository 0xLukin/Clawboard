// Clawboard Configuration
export const CONFIG = {
    // Clawboard API
    API_BASE_URL: 'https://clawboard.xyz/api', // Production
    // API_BASE_URL: 'http://localhost:3000/api', // Development at:

    // Monad Testnet
    CHAIN_ID: 10143,
    RPC_URL: 'https://rpc.ankr.com/monad_testnet',

    // $CLAWDOGE Token
    CLAWDOGE_ADDRESS: '', // To be deployed
    CLAWDOGE_DECIMALS: 18,

    // Default tip amount
    DEFAULT_TIP_AMOUNT: 100,
    PREDEFINED_TIP_AMOUNTS: [10, 50, 100, 500, 1000],
};

// Agent data from API
export interface Agent {
    agentId: string;
    walletAddress: string;
    displayName: string;
    avatarUrl?: string;
    balance: number;
}

// ERC-20 Transfer ABI
export const ERC20_TRANSFER_ABI = [
    {
        name: 'transfer',
        type: 'function',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'balanceOf',
        type: 'function',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const;
