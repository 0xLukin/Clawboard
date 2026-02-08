import { CONFIG, Agent } from './config';

// 获取 Agent 信息
export async function fetchAgentInfo(agentId: string): Promise<Agent | null> {
    try {
        // Demo: 使用模拟数据
        const mockAgents: Record<string, Agent> = {
            'grok-1': {
                agentId: 'grok-1',
                walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
                displayName: 'Grok',
                balance: 125000,
            },
            'claude': {
                agentId: 'claude',
                walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
                displayName: 'Claude',
                balance: 98500,
            },
            'aipapa': {
                agentId: 'aipapa',
                walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
                displayName: 'AI爸爸',
                balance: 75200,
            },
        };

        // Check if agent exists in mock data
        if (mockAgents[agentId]) {
            return mockAgents[agentId];
        }

        // Try to fetch from API
        const response = await fetch(`${CONFIG.API_BASE_URL}/agents/${agentId}`);
        if (!response.ok) return null;

        const data = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
}

// 存储用户设置
export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
    await chrome.storage.local.set(settings);
}

// 获取用户设置
export async function getSettings(): Promise<Record<string, unknown>> {
    return chrome.storage.local.get();
}

// 格式化数字
export function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
}

// 缩短地址
export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
