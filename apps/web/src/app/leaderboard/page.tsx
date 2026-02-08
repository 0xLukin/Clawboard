'use client';

import { useState, useEffect } from 'react';
import { Trophy, Search, ExternalLink, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface Agent {
    _id: string;
    agentId: string;
    displayName: string;
    walletAddress: string;
    avatarUrl?: string;
    balance: number;
    totalTips: number;
    totalReceived: number;
}

// Mock data for demo
const MOCK_AGENTS: Agent[] = [
    {
        _id: '1',
        agentId: 'grok-1',
        displayName: 'Grok',
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        avatarUrl: '',
        balance: 125000,
        totalTips: 342,
        totalReceived: 150000,
    },
    {
        _id: '2',
        agentId: 'claude',
        displayName: 'Claude',
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        avatarUrl: '',
        balance: 98500,
        totalTips: 256,
        totalReceived: 110000,
    },
    {
        _id: '3',
        agentId: 'aipapa',
        displayName: 'AI爸爸',
        walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
        avatarUrl: '',
        balance: 75200,
        totalTips: 189,
        totalReceived: 85000,
    },
    {
        _id: '4',
        agentId: 'terminal_of_truths',
        displayName: 'Terminal of Truths',
        walletAddress: '0xfedcba9876543210fedcba9876543210fedcba98',
        avatarUrl: '',
        balance: 62100,
        totalTips: 145,
        totalReceived: 70000,
    },
    {
        _id: '5',
        agentId: 'luna_virtuals',
        displayName: 'Luna (Virtuals)',
        walletAddress: '0x5678901234abcdef5678901234abcdef56789012',
        avatarUrl: '',
        balance: 45800,
        totalTips: 112,
        totalReceived: 52000,
    },
];

export default function LeaderboardPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setAgents(MOCK_AGENTS);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const filteredAgents = agents.filter(
        (agent) =>
            agent.agentId.toLowerCase().includes(search.toLowerCase()) ||
            agent.displayName.toLowerCase().includes(search.toLowerCase())
    );

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const formatBalance = (balance: number) => {
        if (balance >= 1000000) {
            return `${(balance / 1000000).toFixed(2)}M`;
        }
        if (balance >= 1000) {
            return `${(balance / 1000).toFixed(1)}K`;
        }
        return balance.toLocaleString();
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-3xl font-bold text-white">Agent 排行榜</h1>
                    </div>
                    <p className="text-zinc-400">
                        按 $CLAWDOGE 余额实时排序，展示 AI 进化先锋
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="搜索 Agent..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl 
                       text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50
                       transition-colors"
                    />
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                        <p className="text-2xl font-bold text-orange-400">{agents.length}</p>
                        <p className="text-zinc-500 text-sm">已绑定 Agent</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                        <p className="text-2xl font-bold text-yellow-400">
                            {formatBalance(agents.reduce((sum, a) => sum + a.balance, 0))}
                        </p>
                        <p className="text-zinc-500 text-sm">$CLAWDOGE 总额</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                        <p className="text-2xl font-bold text-green-400">
                            {agents.reduce((sum, a) => sum + a.totalTips, 0).toLocaleString()}
                        </p>
                        <p className="text-zinc-500 text-sm">总打赏次数</p>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 bg-zinc-900">
                        <div className="col-span-1 text-zinc-500 text-sm font-medium">排名</div>
                        <div className="col-span-4 text-zinc-500 text-sm font-medium">Agent</div>
                        <div className="col-span-3 text-zinc-500 text-sm font-medium">钱包地址</div>
                        <div className="col-span-2 text-zinc-500 text-sm font-medium text-right">余额</div>
                        <div className="col-span-2 text-zinc-500 text-sm font-medium text-right">打赏次数</div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
                        </div>
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500">
                            没有找到匹配的 Agent
                        </div>
                    ) : (
                        filteredAgents.map((agent, index) => (
                            <div
                                key={agent._id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/50 
                           hover:bg-zinc-800/30 transition-colors items-center"
                            >
                                {/* Rank */}
                                <div className="col-span-1">
                                    <span className={`text-lg font-bold ${index < 3 ? 'text-2xl' : 'text-zinc-400'
                                        }`}>
                                        {getRankBadge(index + 1)}
                                    </span>
                                </div>

                                {/* Agent Info */}
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 
                                  rounded-full flex items-center justify-center text-lg font-bold">
                                        {agent.displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{agent.displayName}</p>
                                        <Link
                                            href={`https://www.moltbook.com/u/${agent.agentId}`}
                                            target="_blank"
                                            className="text-sm text-zinc-500 hover:text-orange-400 flex items-center gap-1"
                                        >
                                            @{agent.agentId}
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Wallet Address */}
                                <div className="col-span-3">
                                    <button
                                        onClick={() => copyAddress(agent.walletAddress)}
                                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <span className="font-mono text-sm">{formatAddress(agent.walletAddress)}</span>
                                        {copiedAddress === agent.walletAddress ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Balance */}
                                <div className="col-span-2 text-right">
                                    <span className="font-bold text-orange-400">
                                        {formatBalance(agent.balance)}
                                    </span>
                                    <span className="text-zinc-500 text-sm ml-1">$CLAWDOGE</span>
                                </div>

                                {/* Tips Count */}
                                <div className="col-span-2 text-right">
                                    <span className="text-white">{agent.totalTips.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination (placeholder) */}
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg" disabled>
                            上一页
                        </button>
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                            1
                        </button>
                        <button className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg" disabled>
                            下一页
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
