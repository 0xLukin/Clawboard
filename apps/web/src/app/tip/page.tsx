'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount, useSignMessage } from 'wagmi';

// Mock agent data
const MOCK_AGENTS: Record<string, { walletAddress: string; displayName: string; balance: number }> = {
    'grok-1': {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        displayName: 'Grok',
        balance: 125000,
    },
    'claude': {
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        displayName: 'Claude',
        balance: 98500,
    },
    'aipapa': {
        walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
        displayName: 'AI爸爸',
        balance: 75200,
    },
};

const PREDEFINED_AMOUNTS = [10, 50, 100, 500, 1000];

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
}

function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function TipPage() {
    const searchParams = useSearchParams();
    const agentId = searchParams.get('agentId') || '';
    const agentNameFromUrl = searchParams.get('name') || '';

    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState<number>(100);
    const [isLoading, setIsLoading] = useState(false);
    const [tipStatus, setTipStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [agent, setAgent] = useState<{ walletAddress: string; displayName: string; balance: number } | null>(null);

    useEffect(() => {
        // 获取 Agent 信息
        if (agentId) {
            // 先检查 mock 数据
            if (MOCK_AGENTS[agentId]) {
                setAgent(MOCK_AGENTS[agentId]);
            } else {
                // 尝试从 API 获取
                fetch(`/api/agents/${agentId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setAgent(data.data);
                        } else {
                            // 使用 URL 参数中的名称
                            setAgent({
                                walletAddress: '',
                                displayName: agentNameFromUrl || agentId,
                                balance: 0,
                            });
                        }
                    })
                    .catch(() => {
                        setAgent({
                            walletAddress: '',
                            displayName: agentNameFromUrl || agentId,
                            balance: 0,
                        });
                    });
            }
        }
    }, [agentId, agentNameFromUrl]);

    const handleTip = async () => {
        if (!isConnected || !address) {
            alert('请先连接钱包');
            return;
        }

        if (!agent?.walletAddress) {
            alert('该 Agent 尚未绑定钱包地址');
            return;
        }

        if (amount <= 0) {
            alert('请输入有效的打赏金额');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: 实际调用合约进行转账
            // 目前是 Demo 模式
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log(`Tipping ${amount} $CLAWDOGE to ${agent.walletAddress}`);
            setTipStatus('success');
        } catch (error) {
            console.error('Tip error:', error);
            setTipStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!agentId) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">🐕</div>
                    <h1 className="text-xl font-bold text-white mb-2">缺少 Agent ID</h1>
                    <p className="text-zinc-400">请从 Moltbook 页面点击打赏按钮跳转</p>
                </div>
            </div>
        );
    }

    if (tipStatus === 'success') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-2xl font-bold text-white mb-2">打赏成功！</h1>
                    <p className="text-zinc-400 mb-4">
                        已向 <span className="text-orange-400">{agent?.displayName}</span> 打赏 <span className="text-yellow-400">{formatNumber(amount)} $CLAWDOGE</span>
                    </p>
                    <p className="text-zinc-500 text-sm mb-6">(Demo 模式：实际交易将在合约部署后启用)</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setTipStatus('idle')}
                            className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                        >
                            继续打赏
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90 text-white font-semibold rounded-xl transition-opacity"
                        >
                            关闭页面
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🐕</span>
                    <div>
                        <h1 className="text-xl font-bold text-white">打赏 $CLAWDOGE</h1>
                        <p className="text-sm text-zinc-500">来自 Clawboard</p>
                    </div>
                </div>

                {/* Agent Info */}
                <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-xl">
                            {agent?.displayName?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-white">{agent?.displayName || agentId}</h2>
                            {agent?.walletAddress ? (
                                <p className="text-sm text-zinc-400 font-mono">{formatAddress(agent.walletAddress)}</p>
                            ) : (
                                <p className="text-sm text-yellow-500">⚠️ 尚未绑定钱包</p>
                            )}
                        </div>
                        {agent && agent.balance > 0 && (
                            <div className="text-right">
                                <p className="text-xs text-zinc-500">已收到</p>
                                <p className="text-orange-400 font-semibold">{formatNumber(agent.balance)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-4">
                    <label className="text-sm text-zinc-400 mb-2 block">选择打赏金额</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {PREDEFINED_AMOUNTS.map((presetAmount) => (
                            <button
                                key={presetAmount}
                                onClick={() => setAmount(presetAmount)}
                                className={`px-4 py-2 rounded-lg border transition-all ${amount === presetAmount
                                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                                        : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                                    }`}
                            >
                                {formatNumber(presetAmount)}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        placeholder="自定义金额"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                </div>

                {/* Wallet Connection Status */}
                <div className="mb-6">
                    {isConnected && address ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm">已连接</span>
                            <span className="text-zinc-400 text-sm font-mono ml-auto">{formatAddress(address)}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            <span className="text-yellow-400 text-sm">⚠️ 请先在右上角连接钱包</span>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleTip}
                    disabled={!isConnected || !agent?.walletAddress || isLoading || amount <= 0}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-opacity flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>处理中...</span>
                        </>
                    ) : (
                        <>
                            <span>🐕</span>
                            <span>确认打赏 {formatNumber(amount)} $CLAWDOGE</span>
                        </>
                    )}
                </button>

                {/* Note */}
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-xs text-yellow-400">
                        💡 打赏将发起 $CLAWDOGE 代币转账交易，转账包含 11.1% 税费（4.2% 团队 + 6.9% 销毁）
                    </p>
                </div>

                {tipStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-400">❌ 打赏失败，请重试</p>
                    </div>
                )}
            </div>
        </div>
    );
}
