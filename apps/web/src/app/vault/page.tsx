'use client';

import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Vault, TrendingUp, TrendingDown, Info, ArrowRight, Coins } from 'lucide-react';
import { CLAWDOGE_TOKEN } from '@/lib/web3';

// Mock vault data
const VAULT_DATA = {
    totalSupply: 500_000_000,
    maxSupply: 2_100_000_000,
    totalUSDC: 2_500_000,
    netValue: 0.005, // USDC per CLAWDOGE
    burned: 50_000_000,
    teamAllocation: 21_000_000,
};

export default function VaultPage() {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });

    const [activeTab, setActiveTab] = useState<'mint' | 'redeem'>('mint');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock user CLAWDOGE balance
    const userClawdogeBalance = 10000;

    const calculateOutput = () => {
        const inputAmount = parseFloat(amount) || 0;
        if (activeTab === 'mint') {
            // USDC to CLAWDOGE
            return inputAmount / VAULT_DATA.netValue;
        } else {
            // CLAWDOGE to USDC (with tax)
            const afterTax = inputAmount * (1 - CLAWDOGE_TOKEN.transferTax);
            return afterTax * VAULT_DATA.netValue;
        }
    };

    const handleTransaction = async () => {
        if (!amount || !isConnected) return;

        setLoading(true);
        // Simulate transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setAmount('');
        alert(`Demo: ${activeTab === 'mint' ? 'Mint' : 'Redeem'} 交易已提交!`);
    };

    const formatNumber = (num: number, decimals = 2) => {
        if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(decimals)}B`;
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
        return num.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-black py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Vault className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-3xl font-bold text-white">金库</h1>
                    </div>
                    <p className="text-zinc-400">
                        购买或赎回 $CLAWDOGE，参与 Agent 经济
                    </p>
                </div>

                {/* Vault Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <p className="text-zinc-500 text-sm mb-1">金库净值</p>
                        <p className="text-2xl font-bold text-white">${VAULT_DATA.netValue.toFixed(4)}</p>
                        <p className="text-xs text-zinc-500">per $CLAWDOGE</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <p className="text-zinc-500 text-sm mb-1">总供应量</p>
                        <p className="text-2xl font-bold text-orange-400">{formatNumber(VAULT_DATA.totalSupply)}</p>
                        <p className="text-xs text-zinc-500">/ {formatNumber(VAULT_DATA.maxSupply)} max</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <p className="text-zinc-500 text-sm mb-1">金库 USDC</p>
                        <p className="text-2xl font-bold text-green-400">${formatNumber(VAULT_DATA.totalUSDC)}</p>
                        <p className="text-xs text-zinc-500">抵押物</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <p className="text-zinc-500 text-sm mb-1">已销毁</p>
                        <p className="text-2xl font-bold text-red-400">{formatNumber(VAULT_DATA.burned)}</p>
                        <p className="text-xs text-zinc-500">$CLAWDOGE</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Swap Card */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setActiveTab('mint')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold 
                            transition-all ${activeTab === 'mint'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                <TrendingUp className="w-5 h-5" />
                                铸造 Mint
                            </button>
                            <button
                                onClick={() => setActiveTab('redeem')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold 
                            transition-all ${activeTab === 'redeem'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                <TrendingDown className="w-5 h-5" />
                                赎回 Redeem
                            </button>
                        </div>

                        {!isConnected ? (
                            <div className="text-center py-8">
                                <p className="text-zinc-400">请先在右上角连接钱包</p>
                            </div>
                        ) : (
                            <>
                                {/* Input */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-500">
                                            {activeTab === 'mint' ? '支付' : '赎回'}
                                        </span>
                                        <span className="text-zinc-500">
                                            余额: {activeTab === 'mint'
                                                ? `${balance ? (Number(balance.value) / 10 ** balance.decimals).toFixed(4) : '0'} ${balance?.symbol || 'MON'}`
                                                : `${formatNumber(userClawdogeBalance)} $CLAWDOGE`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-xl">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
                                        />
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 rounded-lg">
                                            <Coins className="w-5 h-5 text-yellow-400" />
                                            <span className="font-medium text-white">
                                                {activeTab === 'mint' ? 'USDC' : '$CLAWDOGE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex justify-center my-2">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-zinc-400 rotate-90" />
                                    </div>
                                </div>

                                {/* Output */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-500">获得</span>
                                        <span className="text-zinc-500">
                                            {activeTab === 'redeem' && '(扣除 11.1% 税后)'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl">
                                        <span className="flex-1 text-2xl font-bold text-white">
                                            {amount ? formatNumber(calculateOutput(), 4) : '0.00'}
                                        </span>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 rounded-lg">
                                            <Coins className="w-5 h-5 text-orange-400" />
                                            <span className="font-medium text-white">
                                                {activeTab === 'mint' ? '$CLAWDOGE' : 'USDC'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Info */}
                                {activeTab === 'redeem' && (
                                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 
                                  rounded-lg mb-6">
                                        <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-yellow-200">
                                            赎回将收取 11.1% 转账税（4.2% 团队 + 6.9% 销毁）
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleTransaction}
                                    disabled={!amount || loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 
                              disabled:cursor-not-allowed ${activeTab === 'mint'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                            : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white'
                                        }`}
                                >
                                    {loading ? '处理中...' : activeTab === 'mint' ? '铸造 $CLAWDOGE' : '赎回 USDC'}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Info Panel */}
                    <div className="space-y-6">
                        {/* Your Holdings */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">你的持仓</h3>
                            {isConnected ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">$CLAWDOGE 余额</span>
                                        <span className="text-xl font-bold text-orange-400">
                                            {formatNumber(userClawdogeBalance)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">估值 (USDC)</span>
                                        <span className="text-xl font-bold text-green-400">
                                            ${(userClawdogeBalance * VAULT_DATA.netValue).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-px bg-zinc-800" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">占总供应</span>
                                        <span className="text-white">
                                            {((userClawdogeBalance / VAULT_DATA.totalSupply) * 100).toFixed(4)}%
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-zinc-500 text-center py-4">连接钱包查看持仓</p>
                            )}
                        </div>

                        {/* Token Mechanics */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">代币机制</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">最大供应量</span>
                                    <span className="text-white">21 亿</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">转账税</span>
                                    <span className="text-white">11.1%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">├ 团队分配</span>
                                    <span className="text-orange-400">4.2%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">└ 销毁</span>
                                    <span className="text-red-400">6.9%</span>
                                </div>
                                <div className="h-px bg-zinc-800" />
                                <p className="text-zinc-500">
                                    每次打赏或转账都会增加金库净值，形成正向飞轮效应。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
